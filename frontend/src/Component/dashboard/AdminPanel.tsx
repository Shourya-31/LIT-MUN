import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ApiError, api, type AdminApplication, type AdminDelegateProfile, type AdminStats, type Announcement, type CommitteeOption } from '../../lib/api';
import './AdminPanel.css';

const pageSize = 10;
const statusOptions = ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN'];

function formatProfileDate(value: string | null): string {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function formatStatusLabel(status: string | null | undefined): string {
  if (!status || status === 'NO_APPLICATION') return 'No application submitted';
  return status.replaceAll('_', ' ');
}

const ProfileField: React.FC<{ label: string; value: React.ReactNode; long?: boolean }> = ({
  label,
  value,
  long = false,
}) => (
  <div className={`admin-profile-field${long ? ' admin-profile-field-long' : ''}`}>
    <dt>{label}</dt>
    <dd>{value === null || value === undefined || value === '' ? 'Not provided' : value}</dd>
  </div>
);

interface DelegateProfileDialogProps {
  applicationId: string;
  onClose: () => void;
}

const DelegateProfileDialog: React.FC<DelegateProfileDialogProps> = ({ applicationId, onClose }) => {
  const [profile, setProfile] = useState<AdminDelegateProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    void api.admin.delegateProfile(applicationId)
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        if (loadError instanceof ApiError && loadError.status === 404) {
          setError('This application could not be found. It may have been removed.');
        } else {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load this delegate profile.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applicationId, retryCount]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    return () => previouslyFocused?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      event.preventDefault();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="admin-profile-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <section
        className="admin-profile-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-profile-title"
        aria-describedby="admin-profile-reference"
        tabIndex={-1}
      >
        <header className="admin-profile-header">
          <div>
            <p>Delegate profile</p>
            <h2 id="admin-profile-title">{profile?.fullName ?? 'Delegate details'}</h2>
            <span id="admin-profile-reference">
              {profile ? `Application reference · ${profile.reference ?? 'No application submitted'}` : 'Full registration and application record'}
            </span>
          </div>
          <button ref={closeButtonRef} type="button" className="admin-profile-close" onClick={onClose} aria-label="Close delegate profile">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="admin-profile-body" aria-live="polite">
          {isLoading && <p className="admin-profile-state" role="status">Loading delegate profile…</p>}
          {!isLoading && error && (
            <div className="admin-profile-state admin-profile-error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => {
                setError(null);
                setProfile(null);
                setIsLoading(true);
                setRetryCount((current) => current + 1);
              }}>Retry</button>
            </div>
          )}
          {!isLoading && profile && (
            <>
              <section className="admin-profile-section" aria-labelledby="profile-personal-heading">
                <h3 id="profile-personal-heading">Personal and contact information</h3>
                <dl className="admin-profile-grid">
                  <ProfileField label="Full name (submitted)" value={profile.fullName} />
                  <ProfileField label="Email address (submitted)" value={profile.email} />
                  <ProfileField label="Phone number (submitted)" value={profile.phone} />
                  <ProfileField label="Institution (submitted)" value={profile.institution} />
                </dl>
              </section>

              <section className="admin-profile-section" aria-labelledby="profile-academic-heading">
                <h3 id="profile-academic-heading">Academic and location details</h3>
                <dl className="admin-profile-grid">
                  <ProfileField label="Academic level" value={profile.academicLevel} />
                  <ProfileField label="City" value={profile.city} />
                  <ProfileField label="Country" value={profile.country} />
                  <ProfileField label="Conference experience" value={profile.experienceLevel} />
                  <ProfileField label="Past conferences" value={profile.pastConferences} long />
                  <ProfileField label="Statement of intent" value={profile.statementOfIntent} long />
                </dl>
              </section>

              <section className="admin-profile-section" aria-labelledby="profile-account-heading">
                <h3 id="profile-account-heading">Account information</h3>
                <dl className="admin-profile-grid">
                  <ProfileField label="Account name" value={profile.user.fullName} />
                  <ProfileField label="Account email" value={profile.user.email} />
                  <ProfileField label="Account phone" value={profile.user.phone} />
                  <ProfileField label="Account institution" value={profile.user.institution} />
                  <ProfileField label="Account role" value={profile.user.role} />
                  <ProfileField label="Account status" value={profile.user.status} />
                  <ProfileField label="Email verified" value={profile.user.emailVerifiedAt ? `Yes · ${formatProfileDate(profile.user.emailVerifiedAt)}` : 'No'} />
                  <ProfileField label="Last login" value={formatProfileDate(profile.user.lastLoginAt)} />
                  <ProfileField label="Account created" value={formatProfileDate(profile.user.createdAt)} />
                  <ProfileField label="Account last updated" value={formatProfileDate(profile.user.updatedAt)} />
                </dl>
              </section>

              <section className="admin-profile-section" aria-labelledby="profile-application-heading">
                <h3 id="profile-application-heading">Application details</h3>
                <dl className="admin-profile-grid">
                  <ProfileField label="Application ID" value={profile.reference ? profile.id : profile.user.id} />
                  <ProfileField label="Application reference" value={profile.reference ?? 'No application submitted'} />
                  <ProfileField label="Application status" value={formatStatusLabel(profile.status)} />
                  <ProfileField label="Submitted" value={formatProfileDate(profile.submittedAt)} />
                  <ProfileField label="Last updated" value={formatProfileDate(profile.updatedAt)} />
                  <ProfileField label="Agreed to terms" value={profile.agreedToTerms === null ? 'Not provided' : profile.agreedToTerms ? 'Yes' : 'No'} />
                </dl>
              </section>

              <section className="admin-profile-section" aria-labelledby="profile-preferences-heading">
                <h3 id="profile-preferences-heading">Committee and portfolio preferences</h3>
                {profile.preferences.length > 0 ? (
                  <ol className="admin-profile-preferences">
                    {profile.preferences.map((preference) => (
                      <li key={preference.id}>
                        <strong>
                          Committee preference {preference.rank}: {preference.committee.code} — {preference.committee.name}
                        </strong>
                        <span>{preference.committee.category}</span>
                        {preference.portfolios.length > 0 ? (
                          <ol>
                            {preference.portfolios.map(({ id, rank, portfolio }) => (
                              <li key={id}>Portfolio preference {rank}: {portfolio.name}</li>
                            ))}
                          </ol>
                        ) : (
                          <span>No portfolio preferences provided</span>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="admin-profile-empty">No committee or portfolio preferences are recorded.</p>
                )}
              </section>

              <section className="admin-profile-section" aria-labelledby="profile-review-heading">
                <h3 id="profile-review-heading">Administrative review and allocation</h3>
                <dl className="admin-profile-grid">
                  <ProfileField label="Reviewed" value={formatProfileDate(profile.reviewedAt)} />
                  <ProfileField label="Reviewed by" value={profile.reviewer?.fullName ?? 'Not reviewed'} />
                  <ProfileField label="Review note" value={profile.reviewNote} long />
                  <ProfileField
                    label="Allocation"
                    value={profile.allocation
                      ? `${profile.allocation.status.replaceAll('_', ' ')} · ${profile.allocation.committee.code} — ${profile.allocation.committee.name} · ${profile.allocation.portfolio.name}`
                      : 'Not allocated'}
                    long
                  />
                  {profile.allocation && (
                    <>
                      <ProfileField label="Allocated by" value={profile.allocation.assignedBy.fullName} />
                      <ProfileField label="Allocation assigned" value={formatProfileDate(profile.allocation.assignedAt)} />
                      <ProfileField label="Allocation last updated" value={formatProfileDate(profile.allocation.updatedAt)} />
                    </>
                  )}
                </dl>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

interface AnnouncementFormState {
  heading: string;
  subheading: string;
  content: string;
  isPublished: boolean;
}

const emptyAnnouncementForm = (): AnnouncementFormState => ({
  heading: '',
  subheading: '',
  content: '',
  isPublished: true,
});

const AnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<AnnouncementFormState>(emptyAnnouncementForm());
  const [isSaving, setIsSaving] = useState(false);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.announcements();
      setAnnouncements(data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  const handleFieldChange = (field: keyof AnnouncementFormState, value: string | boolean) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const heading = formState.heading.trim();
    const content = formState.content.trim();
    if (!heading || !content) {
      setError('Heading and content are required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      const payload = {
        heading,
        subheading: formState.subheading.trim() || undefined,
        content,
        isPublished: formState.isPublished,
      };

      if (editingId) {
        await api.admin.updateAnnouncement(editingId, payload);
        setNotice('Announcement updated successfully.');
      } else {
        await api.admin.createAnnouncement(payload);
        setNotice('Announcement created successfully.');
      }

      setFormState(emptyAnnouncementForm());
      setEditingId(null);
      await loadAnnouncements();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save this announcement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormState({
      heading: announcement.heading,
      subheading: announcement.subheading ?? '',
      content: announcement.content,
      isPublished: announcement.isPublished,
    });
    setError(null);
    setNotice(null);
  };

  const handleDelete = async (announcementId: string) => {
    if (!window.confirm('Delete this announcement from the public site and admin list?')) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      await api.admin.deleteAnnouncement(announcementId);
      setNotice('Announcement deleted.');
      if (editingId === announcementId) {
        setEditingId(null);
        setFormState(emptyAnnouncementForm());
      }
      await loadAnnouncements();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this announcement');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="admin-announcements" aria-labelledby="admin-announcements-heading">
      <div className="admin-panel-heading">
        <div>
          <h3 id="admin-announcements-heading">Announcements</h3>
          <p>Official notices and updates for public visitors.</p>
        </div>
        <button
          type="button"
          className="admin-announcements-create"
          onClick={() => {
            setEditingId(null);
            setFormState(emptyAnnouncementForm());
            setError(null);
            setNotice(null);
          }}
        >
          {editingId ? 'Cancel edit' : 'Create Announcement'}
        </button>
      </div>

      {notice && <p className="admin-success" role="status">{notice}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}

      <form className="announcement-form" onSubmit={handleSubmit}>
        <label>
          Heading
          <input
            value={formState.heading}
            onChange={(event) => handleFieldChange('heading', event.target.value)}
            placeholder="Conference update"
            maxLength={200}
            disabled={isSaving}
          />
        </label>

        <label>
          Subheading
          <input
            value={formState.subheading}
            onChange={(event) => handleFieldChange('subheading', event.target.value)}
            placeholder="Optional secondary heading"
            maxLength={300}
            disabled={isSaving}
          />
        </label>

        <label>
          Content
          <textarea
            value={formState.content}
            onChange={(event) => handleFieldChange('content', event.target.value)}
            rows={7}
            placeholder="Write the full announcement body…"
            disabled={isSaving}
          />
        </label>

        <label className="announcement-form-toggle">
          <input
            type="checkbox"
            checked={formState.isPublished}
            onChange={(event) => handleFieldChange('isPublished', event.target.checked)}
            disabled={isSaving}
          />
          Publish immediately
        </label>

        <div className="announcement-form-actions">
          <button type="submit" disabled={isSaving}>
            {isSaving ? (editingId ? 'Saving…' : 'Creating…') : (editingId ? 'Save changes' : 'Create announcement')}
          </button>
        </div>
      </form>

      <div className="announcement-admin-list">
        {isLoading && <p className="admin-table-message" role="status">Loading announcements…</p>}
        {!isLoading && announcements.length === 0 && (
          <p className="admin-table-message">No announcements yet. Create the first official notice.</p>
        )}
        {!isLoading && announcements.map((announcement) => (
          <article key={announcement.id} className="announcement-admin-card">
            <div>
              <span className={`announcement-status ${announcement.isPublished ? 'published' : 'draft'}`}>
                {announcement.isPublished ? 'Published' : 'Draft'}
              </span>
              <h4>{announcement.heading}</h4>
              {announcement.subheading && <p>{announcement.subheading}</p>}
            </div>
            <div className="announcement-admin-meta">
              <span>{new Date(announcement.publishedAt ?? announcement.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              <div className="announcement-admin-actions">
                <button type="button" onClick={() => handleEdit(announcement)} disabled={isSaving}>Edit</button>
                <button type="button" className="danger" onClick={() => void handleDelete(announcement.id)} disabled={isSaving}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

interface AdminApplicationRowProps {
  application: AdminApplication;
  committees: CommitteeOption[];
  onChanged: () => void;
  onOpenProfile: (applicationId: string) => void;
}

const AdminApplicationRow: React.FC<AdminApplicationRowProps> = ({ application, committees, onChanged, onOpenProfile }) => {
  const [status, setStatus] = useState(application.status);
  const [committeeCode, setCommitteeCode] = useState(application.allocation?.committee.code ?? '');
  const [portfolioId, setPortfolioId] = useState(application.allocation?.portfolio.id ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const committee = committees.find((item) => item.code === committeeCode);

  const runAction = async (action: () => Promise<unknown>) => {
    setIsSaving(true);
    setError(null);
    try {
      await action();
      onChanged();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'The action failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr>
      <td>
        <strong>{application.reference}</strong>
        <button
          type="button"
          className="admin-delegate-name"
          onClick={() => onOpenProfile(application.id)}
          aria-label={`View complete profile for ${application.fullName}`}
        >
          {application.fullName}
        </button>
        <span>{application.email}</span>
      </td>
      <td>{application.institution}</td>
      <td>{application.preferences.map(({ committee: preference }) => preference.code).join(' → ')}</td>
      <td>{application.status.replaceAll('_', ' ')}</td>
      <td>
        <div className="admin-row-actions">
          <select aria-label={`New status for ${application.reference}`} value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
          </select>
          <button type="button" disabled={isSaving || status === application.status} onClick={() => { void runAction(() => api.admin.updateStatus(application.id, status)); }}>
            Update status
          </button>
          {application.status === 'ACCEPTED' && (
            <>
              <select aria-label={`Committee allocation for ${application.reference}`} value={committeeCode} onChange={(event) => {
                setCommitteeCode(event.target.value);
                setPortfolioId('');
              }}>
                <option value="">Select committee</option>
                {committees.map(({ code, name }) => <option key={code} value={code}>{code} — {name}</option>)}
              </select>
              <select aria-label={`Portfolio allocation for ${application.reference}`} value={portfolioId} onChange={(event) => setPortfolioId(event.target.value)} disabled={!committee}>
                <option value="">Select portfolio</option>
                {committee?.portfolios.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
              </select>
              <button type="button" disabled={isSaving || !committeeCode || !portfolioId || application.allocation?.status === 'ALLOCATED'} onClick={() => { void runAction(() => api.admin.allocate(application.id, committeeCode, portfolioId)); }}>
                Allocate
              </button>
              {application.allocation?.status === 'ALLOCATED' && (
                <button type="button" disabled={isSaving} onClick={() => { void runAction(() => api.admin.unallocate(application.id)); }}>
                  Unallocate
                </button>
              )}
            </>
          )}
          {error && <span className="admin-inline-error" role="alert">{error}</span>}
        </div>
      </td>
    </tr>
  );
};

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [committees, setCommittees] = useState<CommitteeOption[]>([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.admin.stats(),
      api.admin.applications({
        page,
        pageSize,
        ...(appliedSearch ? { q: appliedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
      api.committees.list(),
    ]).then(([nextStats, result, availableCommittees]) => {
      if (!active) return;
      setStats(nextStats);
      setApplications(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setCommittees(availableCommittees);
      setError(null);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load administrative data');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [appliedSearch, page, reloadCounter, statusFilter]);

  const refresh = () => {
    setIsLoading(true);
    setReloadCounter((current) => current + 1);
  };

  const downloadExport = async () => {
    setError(null);
    try {
      const file = await api.admin.export({
        ...(appliedSearch ? { q: appliedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'litmun-applications.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Unable to export applications');
    }
  };

  return (
    <section className="admin-panel" aria-labelledby="admin-panel-heading">
      <div className="admin-panel-heading">
        <div>
          <h2 id="admin-panel-heading">Application Management</h2>
          <p>Database-backed application review and committee allocation.</p>
        </div>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-stats-grid">
        {[
          ['Users', stats?.totalUsers],
          ['Applications', stats?.totalApplications],
          ['Awaiting review', stats?.awaitingReview],
          ['Under review', stats?.underReview],
          ['Accepted', stats?.accepted],
          ['Awaiting allocation', stats?.awaitingAllocation],
          ['Allocated', stats?.allocatedDelegates],
        ].map(([label, value]) => (
          <div className="admin-stat-card" key={label}>
            <span>{label}</span>
            <strong>{value ?? '—'}</strong>
          </div>
        ))}
      </div>

      <AnnouncementManager />

      <form className="admin-filters" onSubmit={(event) => {
        event.preventDefault();
        setPage(1);
        setAppliedSearch(search.trim());
      }}>
        <label>
          Search
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Reference, delegate, or email" />
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => {
            setPage(1);
            setStatusFilter(event.target.value);
          }}>
            <option value="">All statuses</option>
            {statusOptions.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
        <button type="submit">Search applications</button>
        <button type="button" onClick={() => { void downloadExport(); }}>Export filtered CSV</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-applications-table">
          <thead>
            <tr>
              <th>Delegate</th>
              <th>Institution</th>
              <th>Preferences</th>
              <th>Status</th>
              <th>Review / allocation</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <AdminApplicationRow
                key={application.id}
                application={application}
                committees={committees}
                onChanged={refresh}
                onOpenProfile={setSelectedApplicationId}
              />
            ))}
          </tbody>
        </table>
        {isLoading && <p className="admin-table-message" role="status">Loading administrative data…</p>}
        {!isLoading && applications.length === 0 && <p className="admin-table-message">No matching applications.</p>}
      </div>
      <div className="admin-pagination">
        <span>{total} applications · page {page} of {Math.max(totalPages, 1)}</span>
        <div>
          <button type="button" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <button type="button" disabled={page >= totalPages || isLoading} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      </div>
      {selectedApplicationId && (
        <DelegateProfileDialog
          key={selectedApplicationId}
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
        />
      )}
    </section>
  );
};
