import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import NITRRMUNcrest from '../../assets/NITRRMUN-crest.png';
import { AdminPanel } from '../dashboard/AdminPanel';
import { SignIn } from '../sign-in/SignIn';
import { useAuth } from '../../contexts/useAuth';
import type { SafeUser } from '../../lib/api';
import './AdminPortal.css';

type AdminPortalView = 'login' | 'dashboard' | 'denied' | 'loading';

interface AdminPortalProps {
  view: AdminPortalView;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

function isStaff(user: SafeUser): boolean {
  return user.role === 'ADMIN' || user.role === 'SECRETARIAT';
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ view, onNavigate, onLogout }) => {
  const { user } = useAuth();

  const handleLogin = (authenticatedUser: SafeUser) => {
    if (!isStaff(authenticatedUser)) {
      throw new Error('This account does not have administration access.');
    }
    onNavigate('/admin');
  };

  return (
    <div className="admin-portal">
      <header className="admin-portal-header">
        <button
          type="button"
          className="admin-portal-brand"
          onClick={() => onNavigate('/')}
          aria-label="LIT-MUN home"
        >
          <img src={NITRRMUNcrest} alt="" />
          <span>
            <strong>NITRRMUN</strong>
            <small>Administration Portal</small>
          </span>
        </button>
        {view === 'dashboard' && user && (
          <div className="admin-portal-account">
            <span>{user.fullName}</span>
            <button type="button" onClick={onLogout}>
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        )}
      </header>

      {view === 'loading' && (
        <main className="admin-portal-message" role="status">
          <p>Verifying your administration session…</p>
        </main>
      )}

      {view === 'login' && (
        <main className="admin-login-content">
          <div className="admin-login-heading">
            <ShieldCheck size={30} aria-hidden="true" />
            <p>Authorized staff access</p>
          </div>
          <SignIn
            title="Administration Sign In"
            subtitle="Sign in with your authorized staff account to manage delegate applications."
            onSuccess={handleLogin}
          />
          <button type="button" className="admin-portal-back" onClick={() => onNavigate('/')}>
            Return to the public website
          </button>
        </main>
      )}

      {view === 'denied' && (
        <main className="admin-portal-message" role="alert">
          <ShieldCheck size={34} aria-hidden="true" />
          <h1>Administration access denied</h1>
          <p>This account is not authorized to access the administration portal.</p>
          <button type="button" onClick={() => onNavigate('/')}>Return to the public website</button>
        </main>
      )}

      {view === 'dashboard' && (
        <main className="admin-portal-dashboard">
          <AdminPanel />
        </main>
      )}
    </div>
  );
};

export default AdminPortal;
