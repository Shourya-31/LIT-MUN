import React, { useState } from 'react';
import Navbar from './Component/navigation/Navbar';
import LandingPage from './pages/landing-page/landing-page';
import RegistrationPage from './pages/registration/RegistrationPage';
import type { ActivePortalView } from './pages/registration/RegistrationPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'registration' | 'signin' | 'signup'>('landing');

  return (
    <div className="litmun-app">
      {activeTab === 'landing' ? (
        <div>
          <Navbar activeTab="landing" onSelectTab={setActiveTab} />
          <LandingPage />
          <div style={{ textAlign: 'center', padding: '56px 24px', backgroundColor: 'var(--prussian-blue)', borderTop: '1px solid rgba(130, 145, 168, 0.15)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--soft-linen)', marginBottom: '16px' }}>Ready to Represent Your Nation?</h2>
            <p style={{ color: 'var(--lavender-grey)', maxWidth: '600px', margin: '0 auto 24px', fontFamily: 'var(--font-subheading)', lineHeight: 1.6 }}>
              Join diplomats and scholars across the nation at LIT-MUN 2026. Secure your committee appointment today.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('registration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                backgroundColor: 'var(--soft-fawn)',
                color: 'var(--prussian-blue)',
                padding: '14px 28px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-subheading)',
                letterSpacing: '0.04em',
              }}
            >
              Open Delegate Registration
            </button>
          </div>
          <footer style={{ backgroundColor: 'var(--prussian-blue)', borderTop: '1px solid rgba(130, 145, 168, 0.2)', padding: '36px 24px', textAlign: 'center', color: 'var(--lavender-grey)' }}>
            <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--soft-linen)', fontSize: '1.1rem', marginBottom: '8px' }}>LIT Model United Nations</p>
            <p style={{ fontSize: '0.88rem' }}>Organized by the LITERATI (Literary Society, NIT Raipur)</p>
            <p style={{ fontSize: '0.8rem', marginTop: '12px', opacity: 0.8 }}>© 2026 LIT Model United Nations Conference. All rights reserved.</p>
          </footer>
        </div>
      ) : (
        <RegistrationPage
          initialView={activeTab as ActivePortalView}
          onNavigateToHome={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
};

export default App;
