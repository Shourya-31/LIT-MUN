import React, { useState } from 'react';
import { Navbar } from '../../Component/navigation/Navbar';
import { RegistrationForm } from '../../Component/registration/RegistrationForm';
import { SignIn } from '../../Component/sign-in/SignIn';
import { SignUp } from '../../Component/sign-up/SignUp';
import type { RegistrationFormData } from '../../Component/registration/RegistrationForm';
import { useAuth } from '../../contexts/useAuth';
import './RegistrationPage.css';

export type ActivePortalView = 'registration' | 'signin' | 'signup';

export interface RegistrationPageProps {
  initialView?: ActivePortalView;
  onNavigateToHome?: () => void;
  onNavigateToDashboard?: () => void;
  onAdministration?: () => void;
  noticeMessage?: string | null;
  onRegistrationSuccess?: (data: RegistrationFormData) => Promise<{ reference: string }>;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  initialView = 'registration',
  onNavigateToHome,
  onNavigateToDashboard,
  onAdministration,
  noticeMessage,
  onRegistrationSuccess,
}) => {
  const [activeView, setActiveView] = useState<ActivePortalView>(initialView);
  const { user, isLoading } = useAuth();

  return (
    <div className="registration-page">
      <Navbar
        activeTab={activeView}
        onAdministration={onAdministration ?? (() => undefined)}
        onSelectTab={(tab) => {
          if (tab === 'landing') {
            if (onNavigateToHome) onNavigateToHome();
            return;
          }
          if (tab === 'dashboard') {
            if (onNavigateToDashboard) onNavigateToDashboard();
            return;
          }
          setActiveView(tab as ActivePortalView);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="portal-main">
        <section className="portal-hero">
          <div className="portal-hero-content">
            <h1 className="portal-headline">LIT Model United Nations 2026</h1>
            <p className="portal-lead">
              Official conference registration and delegate portal for diplomatic simulations, committee appointments, and parliamentary procedure.
            </p>

            <div className="conference-specs-grid">
              <div className="spec-card">
                <span className="spec-label">Session Dates</span>
                <span className="spec-value">October xx to yy, 2026</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Conference Venue</span>
                <span className="spec-value">HIRA Hall, NIT Raipur</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Registration Closes</span>
                <span className="spec-value">November xx, 2026</span>
              </div>
            </div>
          </div>
        </section>

        <section className="portal-body">
          <div className="view-selector-tabs" role="tablist" aria-label="Portal Navigation Tabs">
            <button
              type="button"
              id="tab-registration"
              role="tab"
              aria-selected={activeView === 'registration'}
              className={`view-tab-button ${activeView === 'registration' ? 'selected' : ''}`}
              onClick={() => setActiveView('registration')}
            >
              Delegate Registration
            </button>
            <button
              type="button"
              id="tab-signin"
              role="tab"
              aria-selected={activeView === 'signin'}
              className={`view-tab-button ${activeView === 'signin' ? 'selected' : ''}`}
              onClick={() => setActiveView('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup"
              role="tab"
              aria-selected={activeView === 'signup'}
              className={`view-tab-button ${activeView === 'signup' ? 'selected' : ''}`}
              onClick={() => setActiveView('signup')}
            >
              Create Account
            </button>
          </div>

          <div className="portal-active-view">
            {noticeMessage && <p className="signup-message" role="status">{noticeMessage}</p>}
            {activeView === 'registration' && (
              user ? (
                <RegistrationForm
                  onSuccess={onRegistrationSuccess}
                  onNavigateToDashboard={onNavigateToDashboard}
                />
              ) : (
                <div className="registration-card">
                  <h2 className="registration-title">Sign in to save your application</h2>
                  <p className="registration-subtitle">
                    Your committee preferences are saved to your delegate account and remain available after you sign out.
                  </p>
                  {isLoading && <p role="status">Restoring your session…</p>}
                  {!isLoading && (
                    <div className="registration-actions">
                      <button type="button" className="registration-submit-btn" onClick={() => setActiveView('signin')}>
                        Sign In
                      </button>
                      <button type="button" className="registration-secondary-btn" onClick={() => setActiveView('signup')}>
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              )
            )}

            {activeView === 'signin' && (
              <SignIn
                onSuccess={onNavigateToDashboard}
                onNavigateToSignUp={() => {
                  setActiveView('signup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToRegistration={() => {
                  setActiveView('registration');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeView === 'signup' && (
              <SignUp
                onNavigateToSignIn={() => {
                  setActiveView('signin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToRegistration={() => {
                  setActiveView('registration');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="portal-footer">
        <div className="footer-container">
          <div className="footer-col">
            <span className="footer-brand-title">LIT Model United Nations</span>
            <p className="footer-description">
              Organized by the LITERATI (Literary Society, NIT Raipur).
            </p>
          </div>
          <div className="footer-col">
            <span className="footer-heading">Secretariat Inquiries</span>
            <p className="footer-info">Delegate Relations: [EMAIL_ADDRESS]</p>
            <p className="footer-info">Logistics and Accommodation: [EMAIL_ADDRESS]</p>
          </div>
          <div className="footer-col">
            <span className="footer-heading">Regulatory Notice</span>
            <p className="footer-info">
              All committee sessions follow standard parliamentary procedure. Delegate allocations are finalized by the Executive Board upon review.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            (c) 2026 LIT Model United Nations Conference. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationPage;
