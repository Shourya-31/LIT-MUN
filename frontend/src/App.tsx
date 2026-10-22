import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './Component/navigation/Navbar';
import AdminPortal from './Component/admin/AdminPortal';
import LandingPage from './pages/landing-page/landing-page';
import RegistrationPage from './pages/registration/RegistrationPage';
import Dashboard from './Component/dashboard/Dashboard';
import { api, type DashboardResponse } from './lib/api';
import { useAuth } from './contexts/useAuth';
import './App.css';

type PortalTab = 'landing' | 'registration' | 'signin' | 'signup' | 'dashboard';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [activeTab, setActiveTab] = useState<PortalTab>(() =>
    new URLSearchParams(window.location.hash.slice(1)).has('resetToken') ? 'signin' : 'landing',
  );
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const { user, isLoading: isAuthLoading, signOut } = useAuth();

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setPathname(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const replacePath = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    const staff = user?.role === 'ADMIN' || user?.role === 'SECRETARIAT';
    if (pathname === '/admin' && !user) {
      replacePath('/admin/login');
    } else if (pathname === '/admin/login' && staff) {
      replacePath('/admin');
    } else if (pathname.startsWith('/admin/') && pathname !== '/admin/login' && !user) {
      replacePath('/admin/login');
    }
  }, [isAuthLoading, pathname, replacePath, user]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.slice(1));
    const verificationToken = hashParams.get('verifyEmail');
    if (!verificationToken) return;

    let active = true;
    void api.auth.verifyEmail(verificationToken)
      .then(() => {
        if (active) setAuthNotice('Your email address has been verified.');
      })
      .catch((error: unknown) => {
        if (active) setAuthNotice(error instanceof Error ? error.message : 'Email verification could not be completed.');
      })
      .finally(() => {
        hashParams.delete('verifyEmail');
        url.hash = hashParams.toString();
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'dashboard' || isAuthLoading || !user) return;

    let active = true;
    void api.dashboard.mine()
      .then((data) => {
        if (active) setDashboardData(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setDashboardError(error instanceof Error ? error.message : 'Unable to load the dashboard');
        }
      })
      .finally(() => {
        if (active) setIsDashboardLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeTab, isAuthLoading, user]);

  const navigateToDashboard = () => {
    setDashboardError(null);
    setIsDashboardLoading(true);
    setActiveTab(user ? 'dashboard' : 'signin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = async (data: Parameters<typeof api.applications.submit>[0]) => {
    const application = await api.applications.submit(data);
    setDashboardData(null);
    return { reference: application.reference };
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setDashboardData(null);
      setActiveTab('landing');
      if (pathname.startsWith('/admin')) navigate('/admin/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to sign out');
    }
  };

  const effectiveTab = activeTab === 'dashboard' && !isAuthLoading && !user ? 'signin' : activeTab;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const staff = user?.role === 'ADMIN' || user?.role === 'SECRETARIAT';
    const view = isAuthLoading
      ? 'loading'
      : staff
        ? 'dashboard'
        : user
          ? 'denied'
          : pathname === '/admin/login'
            ? 'login'
            : 'loading';

    return (
      <AdminPortal
        view={view}
        onNavigate={navigate}
        onLogout={() => { void handleLogout(); }}
      />
    );
  }

  return (
    <div className="litmun-app">
      {authNotice && <p className="auth-status-banner" role="status">{authNotice}</p>}
      {effectiveTab === 'landing' ? (
        <div>
          <Navbar
            activeTab="landing"
            onAdministration={() => navigate('/admin/login')}
            onSelectTab={(tab) => {
              if (tab === 'dashboard') {
                navigateToDashboard();
              } else {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
          <LandingPage onNavigateToRegistration={() => {
            setActiveTab('registration');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </div>
      ) : effectiveTab === 'dashboard' ? (
        <Dashboard
          data={dashboardData}
          isLoading={isDashboardLoading}
          errorMessage={dashboardError}
          onLogout={() => { void handleLogout(); }}
          onNavigateHome={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToRegistration={() => {
            setActiveTab('registration');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <RegistrationPage
          key={effectiveTab}
          initialView={effectiveTab}
          onNavigateToHome={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToDashboard={navigateToDashboard}
          onAdministration={() => navigate('/admin/login')}
          noticeMessage={authNotice}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default App;
