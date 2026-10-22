import type { RegistrationFormData } from '../Component/registration/RegistrationForm';

export interface SafeUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  institution: string;
  role: 'DELEGATE' | 'SECRETARIAT' | 'ADMIN';
  emailVerifiedAt: string | null;
}

interface Envelope<T> {
  success: boolean;
  data: T;
  message: string;
  error?: { code: string; message: string; details?: unknown };
  requestId?: string;
}

export interface AuthResult {
  accessToken: string;
  user: SafeUser;
  verificationEmailStatus?: 'sent' | 'not_configured' | 'delivery_failed';
}

export interface ApplicationSubmission {
  id: string;
  reference: string;
  status: string;
}

export interface DashboardResponse extends SafeUser {
  createdAt: string;
  application: null | {
    id: string;
    reference: string;
    status: string;
    academicLevel: string;
    city: string;
    country: string;
    submittedAt: string;
    preferences: Array<{
      rank: number;
      committee: { code: string; name: string };
      portfolios: Array<{ rank: number; portfolio: { name: string } }>;
    }>;
    allocation: null | {
      status: 'ALLOCATED' | 'UNALLOCATED';
      committee: { code: string; name: string };
      portfolio: { name: string };
    };
  };
}

export interface CommitteeOption {
  id: string;
  code: string;
  name: string;
  portfolios: Array<{ id: string; name: string }>;
}

export interface AdminApplication {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  institution: string;
  status: string;
  submittedAt: string;
  preferences: Array<{ rank: number; committee: { code: string; name: string } }>;
  allocation: null | {
    status: 'ALLOCATED' | 'UNALLOCATED';
    committee: { code: string; name: string };
    portfolio: { id: string; name: string };
  };
}

export interface AdminStats {
  totalUsers: number;
  totalApplications: number;
  awaitingReview: number;
  underReview: number;
  accepted: number;
  waitlisted: number;
  rejected: number;
  withdrawn: number;
  allocatedDelegates: number;
  awaitingAllocation: number;
  byCommittee: Array<{ code: string; name: string; preferenceCount: number; allocationCount: number }>;
}

const apiBaseUrl = '/api/v1';
let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

async function readEnvelope<T>(response: Response): Promise<Envelope<T>> {
  let body: Envelope<T>;
  try {
    body = await response.json() as Envelope<T>;
  } catch {
    throw new ApiError('The server returned an unreadable response', response.status, 'INVALID_RESPONSE');
  }

  if (!response.ok || !body.success) {
    throw new ApiError(
      body.error?.message || body.message || 'The request could not be completed',
      response.status,
      body.error?.code || 'REQUEST_FAILED',
      body.requestId,
    );
  }
  return body;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.status === 204) {
        accessToken = null;
        return null;
      }
      const envelope = await readEnvelope<AuthResult>(response);
      accessToken = envelope.data.accessToken;
      return accessToken;
    } catch {
      accessToken = null;
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  allowRefresh = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && allowRefresh && !path.startsWith('/auth/')) {
    const token = await refreshAccessToken();
    if (token) return request<T>(path, init, false);
    notifySessionExpired();
  }

  const envelope = await readEnvelope<T>(response);
  return envelope.data;
}

async function requestBlob(path: string, allowRefresh = true): Promise<Blob> {
  const headers = new Headers();
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${apiBaseUrl}${path}`, { headers, credentials: 'include' });
  if (response.status === 401 && allowRefresh) {
    const token = await refreshAccessToken();
    if (token) return requestBlob(path, false);
    notifySessionExpired();
  }
  if (!response.ok) {
    await readEnvelope<unknown>(response);
    throw new ApiError('The export could not be downloaded', response.status, 'EXPORT_FAILED');
  }
  return response.blob();
}

function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}

function notifySessionExpired(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('litmun:session-expired'));
  }
}

function toApplicationPayload(form: RegistrationFormData) {
  return {
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    institution: form.institution,
    academicLevel: form.academicLevel,
    city: form.city,
    country: form.country,
    committees: [
      {
        committeeCode: form.committeeChoice1,
        portfolios: [form.committee1Pref1, form.committee1Pref2, form.committee1Pref3].filter(Boolean),
      },
      {
        committeeCode: form.committeeChoice2,
        portfolios: [form.committee2Pref1, form.committee2Pref2, form.committee2Pref3].filter(Boolean),
      },
      {
        committeeCode: form.committeeChoice3,
        portfolios: [form.committee3Pref1, form.committee3Pref2, form.committee3Pref3].filter(Boolean),
      },
    ],
    experienceLevel: form.experienceLevel,
    pastConferences: form.pastConferences,
    statementOfIntent: form.statementOfIntent,
    agreedToTerms: form.agreedToTerms,
  };
}

export const api = {
  auth: {
    register: (input: {
      fullName: string;
      email: string;
      phone: string;
      institution: string;
      password: string;
    }) => request<AuthResult>('/auth/register', { method: 'POST', body: jsonBody(input) }, false),
    login: (input: { email: string; password: string }) =>
      request<AuthResult>('/auth/login', { method: 'POST', body: jsonBody(input) }, false),
    refresh: refreshAccessToken,
    logout: async () => {
      try {
        await request<null>('/auth/logout', { method: 'POST', body: jsonBody({}) }, false);
      } finally {
        accessToken = null;
      }
    },
    forgotPassword: (email: string) =>
      request<null>('/auth/forgot-password', { method: 'POST', body: jsonBody({ email }) }, false),
    me: () => request<SafeUser>('/auth/me'),
    verifyEmail: (token: string) =>
      request<null>('/auth/verify-email', { method: 'POST', body: jsonBody({ token }) }, false),
    resetPassword: (token: string, password: string) =>
      request<null>('/auth/reset-password', { method: 'POST', body: jsonBody({ token, password }) }, false),
  },
  applications: {
    submit: (form: RegistrationFormData) =>
      request<ApplicationSubmission>('/applications', { method: 'POST', body: jsonBody(toApplicationPayload(form)) }),
    mine: () => request<DashboardResponse['application']>('/applications/me'),
    update: (form: RegistrationFormData) =>
      request<ApplicationSubmission>('/applications/me', { method: 'PATCH', body: jsonBody(toApplicationPayload(form)) }),
  },
  dashboard: {
    mine: () => request<DashboardResponse>('/dashboard/me'),
  },
  committees: {
    list: () => request<CommitteeOption[]>('/committees'),
  },
  admin: {
    stats: () => request<AdminStats>('/admin/dashboard/stats'),
    applications: (query: { page: number; pageSize: number; q?: string; status?: string }) => {
      const params = new URLSearchParams({
        page: String(query.page),
        pageSize: String(query.pageSize),
      });
      if (query.q) params.set('q', query.q);
      if (query.status) params.set('status', query.status);
      return request<{
        items: AdminApplication[];
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      }>(`/admin/applications?${params.toString()}`);
    },
    updateStatus: (id: string, status: string) =>
      request(`/admin/applications/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        body: jsonBody({ status }),
      }),
    allocate: (id: string, committeeCode: string, portfolioId: string) =>
      request(`/admin/applications/${encodeURIComponent(id)}/allocate`, {
        method: 'POST',
        body: jsonBody({ committeeCode, portfolioId }),
      }),
    unallocate: (id: string) =>
      request(`/admin/applications/${encodeURIComponent(id)}/unallocate`, {
        method: 'POST',
        body: jsonBody({}),
      }),
    export: (query: { q?: string; status?: string }) => {
      const params = new URLSearchParams();
      if (query.q) params.set('q', query.q);
      if (query.status) params.set('status', query.status);
      return requestBlob(`/admin/applications/export?${params.toString()}`);
    },
  },
};
