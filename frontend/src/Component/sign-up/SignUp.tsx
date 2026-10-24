import React, { useState } from 'react';
import './SignUp.css';
import { useAuth } from '../../contexts/useAuth';

export interface SignUpProps {
  onSuccess?: (account: {
    fullName: string;
    email: string;
    institution: string;
    role: string;
  }) => void;
  onNavigateToSignIn?: () => void;
  onNavigateToRegistration?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({
  onSuccess,
  onNavigateToSignIn,
  onNavigateToRegistration,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    institution: '',
    role: 'Individual Delegate',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [verificationEmailStatus, setVerificationEmailStatus] = useState<'sent' | 'not_configured' | 'delivery_failed'>('not_configured');
  const { signUp } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return 'Please provide both your first and last name.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return 'Please enter a valid academic or personal email address.';
    }
    if (!formData.phone.trim()) {
      return 'Please enter your phone number with country/area code.';
    }
    if (!formData.institution.trim()) {
      return 'Please specify your school, college, or university.';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'The passwords entered do not match.';
    }
    if (!formData.agreeTerms) {
      return 'You must agree to the LIT-MUN Conference Policies and Rules of Procedure.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const emailStatus = await signUp({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        password: formData.password,
      });
      setVerificationEmailStatus(emailStatus);
      setIsAccountCreated(true);
      onSuccess?.({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        institution: formData.institution,
        role: 'DELEGATE',
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Account creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAccountCreated) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Account Created</h2>
          <p className="signup-message">
            Your delegate account has been created. {verificationEmailStatus === 'sent'
              ? `A verification notice was sent to ${formData.email}.`
              : verificationEmailStatus === 'not_configured'
                ? 'Email verification is not configured in this environment.'
                : 'The account is active, but the verification email could not be delivered. You can contact the secretariat if you need assistance.'}
          </p>
          <div className="signup-details-box">
            <div className="signup-detail-row">
              <span className="signup-detail-key">Name:</span>
              <span className="signup-detail-val">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div className="signup-detail-row">
              <span className="signup-detail-key">Institution:</span>
              <span className="signup-detail-val">{formData.institution}</span>
            </div>
            <div className="signup-detail-row">
              <span className="signup-detail-key">Role:</span>
              <span className="signup-detail-val">{formData.role}</span>
            </div>
          </div>
          <div className="signup-actions">
            {onNavigateToRegistration && (
              <button
                type="button"
                className="signup-submit-btn"
                onClick={onNavigateToRegistration}
              >
                Continue to Committee Registration
              </button>
            )}
            {onNavigateToSignIn && (
              <button
                type="button"
                className="signup-secondary-btn"
                onClick={onNavigateToSignIn}
              >
                Sign In to Portal
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Delegate Account</h2>
        <p className="signup-subtitle">
          Register your credentials to submit committee preferences and receive official allocations.
        </p>

        {errorMessage && (
          <div className="signup-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="signup-form">
          <div className="signup-row">
            <div className="signup-field-group">
              <label htmlFor="signup-first-name" className="signup-label">
                First Name
              </label>
              <input
                id="signup-first-name"
                name="firstName"
                type="text"
                className="signup-input"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                required
              />
            </div>
            <div className="signup-field-group">
              <label htmlFor="signup-last-name" className="signup-label">
                Last Name
              </label>
              <input
                id="signup-last-name"
                name="lastName"
                type="text"
                className="signup-input"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-group">
              <label htmlFor="signup-email" className="signup-label">
                Email Address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="signup-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="delegate@institution.edu"
                autoComplete="email"
                required
              />
            </div>
            <div className="signup-field-group">
              <label htmlFor="signup-phone" className="signup-label">
                Phone Number
              </label>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                className="signup-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-group">
              <label htmlFor="signup-institution" className="signup-label">
                Educational Institution
              </label>
              <input
                id="signup-institution"
                name="institution"
                type="text"
                className="signup-input"
                value={formData.institution}
                onChange={handleChange}
                placeholder="University or High School name"
                required
              />
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-group">
              <div className="signup-password-header">
                <label htmlFor="signup-password" className="signup-label">
                  Password
                </label>
                <button
                  type="button"
                  className="signup-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="signup-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="signup-field-group">
              <label htmlFor="signup-confirm-password" className="signup-label">
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="signup-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="signup-terms-box">
            <label className="signup-checkbox-label">
              <input
                id="signup-terms"
                name="agreeTerms"
                type="checkbox"
                className="signup-checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the NITRRMUN Rules of Procedure, conference guidelines, and data processing terms.
              </span>
            </label>
          </div>

          <button
            type="submit"
            id="signup-submit-button"
            className="signup-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Account Registration'}
          </button>
        </form>

        <div className="signup-footer">
          <p className="signup-footer-text">
            Already registered?{' '}
            {onNavigateToSignIn && (
              <button
                type="button"
                className="signup-inline-link"
                onClick={onNavigateToSignIn}
              >
                Sign In
              </button>
            )}
          </p>
          {onNavigateToRegistration && (
            <p className="signup-footer-text">
              Want to review registration details first?{' '}
              <button
                type="button"
                className="signup-inline-link"
                onClick={onNavigateToRegistration}
              >
                View Registration Form
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
