import React, { useState } from 'react';
import { Navbar } from '../../Component/navigation/Navbar';
import { RegistrationForm } from '../../Component/registration/RegistrationForm';
import { SignIn } from '../../Component/sign-in/SignIn';
import { SignUp } from '../../Component/sign-up/SignUp';
import './RegistrationPage.css';

export type ActivePortalView = 'registration' | 'signin' | 'signup';

export const RegistrationPage: React.FC = () => {
  const [activeView, setActiveView] = useState<ActivePortalView>('registration');

  return (
    <div className="registration-page">
      <Navbar
        activeTab={activeView}
        onSelectTab={(tab) => {
          setActiveView(tab);
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
                <span className="spec-label">Priority Allotment</span>
                <span className="spec-value">Closes November xx, 2026</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Delegation Secretariat</span>
                <span className="spec-value">Office of Delegate Affairs</span>
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
            {activeView === 'registration' && (
              <RegistrationForm
                onNavigateToSignIn={() => {
                  setActiveView('signin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeView === 'signin' && (
              <SignIn
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
