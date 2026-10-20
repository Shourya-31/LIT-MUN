import React, { useState } from 'react';
import Navbar from './Component/navigation/Navbar';
import LandingPage from './pages/landing-page/landing-page';
import RegistrationPage from './pages/registration/RegistrationPage';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'registration' | 'signin' | 'signup'>('landing');

  return (
    <div className="litmun-app">
      {activeTab === 'landing' ? (
        <div>
          <Navbar activeTab="landing" onSelectTab={setActiveTab} />
          <LandingPage
            onNavigateToRegistration={() => {
              setActiveTab('registration');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      ) : (
        <RegistrationPage
          initialView={activeTab}
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
