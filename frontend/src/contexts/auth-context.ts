import { createContext } from 'react';
import type { SafeUser } from '../lib/api';

export interface AuthContextValue {
  user: SafeUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<SafeUser>;
  signUp: (account: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    password: string;
  }) => Promise<'sent' | 'not_configured' | 'delivery_failed'>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
