import React, { useEffect, useMemo, useState } from 'react';
import { api, setAccessToken, type SafeUser } from '../lib/api';
import { AuthContext, type AuthContextValue } from './auth-context';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const clearSession = () => {
      setAccessToken(null);
      setUser(null);
    };
    const handleSessionExpired = () => clearSession();
    window.addEventListener('litmun:session-expired', handleSessionExpired);

    void (async () => {
      try {
        const token = await api.auth.refresh();
        if (token) {
          const profile = await api.auth.me();
          if (active) setUser(profile);
        }
      } catch {
        clearSession();
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
      window.removeEventListener('litmun:session-expired', handleSessionExpired);
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    signIn: async (email, password) => {
      const result = await api.auth.login({ email, password });
      setAccessToken(result.accessToken);
      setUser(result.user);
      return result.user;
    },
    signUp: async (account) => {
      const result = await api.auth.register(account);
      setAccessToken(result.accessToken);
      setUser(result.user);
      return result.verificationEmailStatus ?? 'not_configured';
    },
    signOut: async () => {
      try {
        await api.auth.logout();
      } finally {
        setUser(null);
      }
    },
  }), [isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
