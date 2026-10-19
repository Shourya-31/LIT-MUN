import React from 'react';
import { Navbar } from '../../Component/navigation/Navbar';
import { SignUp } from '../../Component/sign-up/SignUp';
import './SignUpPage.css';

export interface SignUpPageProps {
  onNavigateToSignIn?: () => void;
  onNavigateToRegistration?: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigateToSignIn,
  onNavigateToRegistration,
}) => {
  return (
    <div className="signup-page">
      <Navbar
        activeTab="signup"
        onSelectTab={(tab) => {
          if (tab === 'registration' && onNavigateToRegistration) {
            onNavigateToRegistration();
          } else if (tab === 'signin' && onNavigateToSignIn) {
            onNavigateToSignIn();
          }
        }}
      />
      <main className="signup-page-main">
        <SignUp
          onNavigateToSignIn={onNavigateToSignIn}
          onNavigateToRegistration={onNavigateToRegistration}
        />
      </main>
    </div>
  );
};

export default SignUpPage;
