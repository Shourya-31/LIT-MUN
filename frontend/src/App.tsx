import React, { useState } from 'react';
import RegistrationPage from './pages/registration/RegistrationPage';
import LandingPage from './pages/landing-page/landing-page';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'registration' | 'landing'>('registration');

  return (
    <>
      {currentView === 'registration' ? (
        <RegistrationPage />
      ) : (
        <div>
          <header style={{ padding: '12px 24px', backgroundColor: 'var(--navy)', borderBottom: '1px solid rgba(212,175,105,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>LIT-MUN</span>
            <button
              onClick={() => setCurrentView('registration')}
              style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)', padding: '8px 16px', borderRadius: 4, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Go to Registration
            </button>
          </header>
          <LandingPage />
        </div>
      )}
    </>
  );
};

export default App;
