import React, { useState } from 'react';
import Navbar from './Component/navigation/Navbar';
import LandingPage from './pages/landing-page/landing-page';
import RegistrationPage from './pages/registration/RegistrationPage';
import Dashboard, { type DelegateDashboardData } from './Component/dashboard/Dashboard';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'registration' | 'signin' | 'signup' | 'dashboard'>('landing');
  const [delegateData, setDelegateData] = useState<DelegateDashboardData | null>(null);

  const handleRegistrationSuccess = (data: any) => {
    const newDelegate: DelegateDashboardData = {
      fullName: data.fullName || 'Atulya Jaiswal',
      email: data.email || 'atulya@example.com',
      phone: data.phone || '+91 98765 43210',
      institution: data.institution || 'NIT Raipur',
      academicLevel: data.academicLevel || 'Undergraduate',
      designation: 'Delegate',
      preferredCommittees: [data.primaryCommittee, data.secondaryCommittee, data.tertiaryCommittee].filter(Boolean),
      committeeAllotted: null,
      portfolioAllotted: null,
    };
    setDelegateData(newDelegate);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      ) : activeTab === 'dashboard' ? (
        <Dashboard
          data={delegateData || undefined}
          onLogout={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateHome={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <RegistrationPage
          initialView={activeTab}
          onNavigateToHome={() => {
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToDashboard={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default App;
