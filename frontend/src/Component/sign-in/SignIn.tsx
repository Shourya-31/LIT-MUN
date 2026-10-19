import React, { useState } from 'react';
import './SignIn.css';

export interface SignInProps {
  onSuccess?: (credentials: { email: string }) => void;
  onNavigateToSignUp?: () => void;
  onNavigateToRegistration?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onNavigateToRegistration,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address or delegate ID.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSignedIn(true);
      if (onSuccess) {
        onSuccess({ email });
      }
    }, 600);
  };

  if (isSignedIn) {
    return (
      <div className="signin-container">
        <div className="signin-card">
          <h2 className="signin-title">Access Granted</h2>
          <p className="signin-message">
            Welcome back to the LIT-MUN Delegate Portal. Your credentials have been authenticated.
          </p>
          <div className="signin-session-info">
            <span className="signin-session-label">Authenticated Account:</span>
            <span className="signin-session-value">{email}</span>
          </div>
          <div className="signin-actions">
            {onNavigateToRegistration && (
              <button
                type="button"
                className="signin-submit-btn"
                onClick={onNavigateToRegistration}
              >
                Proceed to Conference Registration
              </button>
            )}
            <button
              type="button"
              className="signin-secondary-btn"
              onClick={() => {
                setIsSignedIn(false);
                setPassword('');
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Delegate Portal Sign In</h2>
        <p className="signin-subtitle">
          Enter your registered credentials to access your committee allocation and conference status.
        </p>

        {errorMessage && (
          <div className="signin-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="signin-form">
          <div className="signin-field-group">
            <label htmlFor="signin-email" className="signin-label">
              Email Address or Delegate ID
            </label>
            <input
              id="signin-email"
              type="email"
              className="signin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="delegate@institution.edu"
              autoComplete="username"
              required
            />
          </div>

          <div className="signin-field-group">
            <div className="signin-password-header">
              <label htmlFor="signin-password" className="signin-label">
                Password
              </label>
              <button
                type="button"
                className="signin-link-btn"
                onClick={() =>
                  alert('Password reset instructions will be dispatched to your registered email.')
                }
              >
                Forgot Password?
              </button>
            </div>
            <div className="signin-input-wrapper">
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                className="signin-input signin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="signin-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="signin-options">
            <label className="signin-checkbox-label">
              <input
                type="checkbox"
                className="signin-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember session on this workstation</span>
            </label>
          </div>

          <button
            type="submit"
            id="signin-submit-button"
            className="signin-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="signin-footer">
          <p className="signin-footer-text">
            Do not have an account yet?{' '}
            {onNavigateToSignUp && (
              <button
                type="button"
                className="signin-inline-link"
                onClick={onNavigateToSignUp}
              >
                Create Account
              </button>
            )}
          </p>
          {onNavigateToRegistration && (
            <p className="signin-footer-text">
              Looking to register directly?{' '}
              <button
                type="button"
                className="signin-inline-link"
                onClick={onNavigateToRegistration}
              >
                Go to Registration
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
