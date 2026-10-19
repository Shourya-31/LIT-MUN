import React from 'react';
import { Navbar } from '../../Component/navigation/Navbar';
import { SignIn } from '../../Component/sign-in/SignIn';
import './SignInPage.css';

export interface SignInPageProps {
  onNavigateToSignUp?: () => void;
  onNavigateToRegistration?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onNavigateToSignUp,
  onNavigateToRegistration,
}) => {
  return (
    <div className="signin-page">
      <Navbar
        activeTab="signin"
        onSelectTab={(tab) => {
          if (tab === 'registration' && onNavigateToRegistration) {
            onNavigateToRegistration();
          } else if (tab === 'signup' && onNavigateToSignUp) {
            onNavigateToSignUp();
          }
        }}
      />
      <main className="signin-page-main">
        <SignIn
          onNavigateToSignUp={onNavigateToSignUp}
          onNavigateToRegistration={onNavigateToRegistration}
        />
      </main>
    </div>
  );
};

export default SignInPage;
