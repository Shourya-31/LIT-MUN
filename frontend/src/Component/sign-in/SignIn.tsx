import React, { useState } from 'react';
import './SignIn.css';
import { api, type SafeUser } from '../../lib/api';
import { useAuth } from '../../contexts/useAuth';

export interface SignInProps {
  onSuccess?: (user: SafeUser) => void | Promise<void>;
  onNavigateToSignUp?: () => void;
  onNavigateToRegistration?: () => void;
  title?: string;
  subtitle?: string;
}

export const SignIn: React.FC<SignInProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onNavigateToRegistration,
  title = 'Delegate Portal Sign In',
  subtitle = 'Enter your registered credentials to access your committee allocation and conference status.',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('resetToken'));
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { signIn, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await signIn(email, password);
      await onSuccess?.(user);
      setIsSignedIn(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!resetToken) return;
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('The passwords entered do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.auth.resetPassword(resetToken, newPassword);
      setResetToken(null);
      setStatusMessage('Your password has been updated. Sign in with your new password.');
      const url = new URL(window.location.href);
      const hashParams = new URLSearchParams(url.hash.slice(1));
      hashParams.delete('resetToken');
      url.hash = hashParams.toString();
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Password reset failed. Request a new link and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetToken) {
    return (
      <div className="signin-container">
        <div className="signin-card">
          <h2 className="signin-title">Reset Your Password</h2>
          <p className="signin-subtitle">Choose a new password for your delegate account.</p>
          {errorMessage && <div className="signin-alert" role="alert">{errorMessage}</div>}
          <form onSubmit={handlePasswordReset} className="signin-form">
            <div className="signin-field-group">
              <label htmlFor="reset-password" className="signin-label">New password</label>
              <input
                id="reset-password"
                className="signin-input"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </div>
            <div className="signin-field-group">
              <label htmlFor="reset-password-confirm" className="signin-label">Confirm new password</label>
              <input
                id="reset-password-confirm"
                className="signin-input"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                required
              />
            </div>
            <button type="submit" className="signin-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Updating password…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="signin-container">
        <div className="signin-card">
          <h2 className="signin-title">Access Granted</h2>
          <p className="signin-message">
            Welcome back to the NITRRMUN Delegate Portal. Your credentials have been authenticated.
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
                void signOut();
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
        <h2 className="signin-title">{title}</h2>
        <p className="signin-subtitle">{subtitle}</p>

        {errorMessage && (
          <div className="signin-alert" role="alert">
            {errorMessage}
          </div>
        )}
        {statusMessage && <p className="signin-message" role="status">{statusMessage}</p>}

        <form onSubmit={handleSubmit} noValidate className="signin-form">
          <div className="signin-field-group">
            <label htmlFor="signin-email" className="signin-label">
              Email Address
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
                onClick={() => {
                  setErrorMessage(null);
                  setStatusMessage(null);
                  if (!email.trim()) {
                    setErrorMessage('Enter your email address first to request a password reset.');
                    return;
                  }
                  void api.auth.forgotPassword(email)
                    .then(() => setStatusMessage('If an account exists for this email, reset instructions will be sent when email delivery is configured.'))
                    .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Unable to request a password reset.'));
                }}
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
