import React, { useState } from 'react';
import './RegistrationForm.css';

export interface RegistrationFormData {
  registrationType: 'individual' | 'group';
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  academicLevel: string;
  city: string;
  country: string;
  groupName?: string;
  groupSize?: string;

  primaryCommittee: string;
  primaryCountries: string;
  secondaryCommittee: string;
  secondaryCountries: string;
  tertiaryCommittee: string;
  tertiaryCountries: string;
  experienceLevel: string;
  pastConferences: string;
  statementOfIntent: string;

  agreedToTerms: boolean;
}

export interface RegistrationFormProps {
  onSuccess?: (data: RegistrationFormData) => void;
  onNavigateToSignIn?: () => void;
}

const COMMITTEES = [
  {
    code: 'UNSC',
    name: 'United Nations Security Council',
    agenda: 'Mitigating Armed Conflict and Ensuring Humanitarian Corridors in Contested Borderlands',
  },
  {
    code: 'DISEC',
    name: 'Disarmament and International Security Committee',
    agenda: 'Regulating Autonomous Weapon Systems and Artificial Intelligence in Modern Warfare',
  },
  {
    code: 'UNHRC',
    name: 'United Nations Human Rights Council',
    agenda: 'Protection of Displaced Populations and Stateless Persons Across Conflict Zones',
  },
  {
    code: 'ECOSOC',
    name: 'Economic and Social Council',
    agenda: 'Sovereign Debt Restructuring and Climate Resilience Financing in Developing Economies',
  },
  {
    code: 'HCC',
    name: 'Historic Crisis Committee (1962)',
    agenda: 'The Cuban Missile Crisis and De-escalation Protocol Under Nuclear Alert',
  },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onNavigateToSignIn,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    registrationType: 'individual',
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    academicLevel: 'Undergraduate',
    city: '',
    country: 'India',
    groupName: '',
    groupSize: '5',
    primaryCommittee: 'UNSC',
    primaryCountries: '',
    secondaryCommittee: 'DISEC',
    secondaryCountries: '',
    tertiaryCommittee: 'UNHRC',
    tertiaryCountries: '',
    experienceLevel: '1 to 3 Conferences',
    pastConferences: '',
    statementOfIntent: '',
    agreedToTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateField = (
    field: keyof RegistrationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMessage('Please enter your full legal name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please provide a valid contact email address.');
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMessage('Please provide your active contact phone number.');
        return false;
      }
      if (!formData.institution.trim()) {
        setErrorMessage('Please state your educational institution or organization.');
        return false;
      }
      if (!formData.city.trim() || !formData.country.trim()) {
        setErrorMessage('Please specify your city and country of residence.');
        return false;
      }
      if (formData.registrationType === 'group') {
        if (!formData.groupName?.trim()) {
          setErrorMessage('Please enter your group or delegation name.');
          return false;
        }
      }
    } else if (step === 2) {
      if (!formData.primaryCountries.trim()) {
        setErrorMessage('Please enter at least three country preferences for your first committee choice.');
        return false;
      }
      if (!formData.statementOfIntent.trim() || formData.statementOfIntent.trim().length < 40) {
        setErrorMessage('Please write a short statement of intent (at least 40 characters) explaining your committee selection.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.agreedToTerms) {
        setErrorMessage('You must confirm agreement with the LIT-MUN Rules of Procedure.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess(formData);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  if (isSubmitted) {
    return (
      <div className="registration-container">
        <div className="registration-card">
          <h2 className="registration-title">Registration Submitted</h2>
          <p className="registration-subtitle">
            Your registration application for LIT Model United Nations has been logged with the Secretariat.
          </p>

          <div className="registration-summary-box">
            <div className="reg-summary-row">
              <span className="reg-summary-key">Application ID</span>
              <span className="reg-summary-val">LIT-MUN-2026-8941</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Registration Type</span>
              <span className="reg-summary-val">
                {formData.registrationType === 'group'
                  ? `Group Delegation (${formData.groupName})`
                  : 'Individual Delegate'}
              </span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Delegate / Contact Lead</span>
              <span className="reg-summary-val">{formData.fullName}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Institution</span>
              <span className="reg-summary-val">{formData.institution}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Primary Committee Choice</span>
              <span className="reg-summary-val">{formData.primaryCommittee}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Preferred Portfolios</span>
              <span className="reg-summary-val">{formData.primaryCountries}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Registration Fee</span>
              <span className="reg-summary-val">Free (No Cost)</span>
            </div>
          </div>

          <p className="registration-note">
            The Executive Board reviews preferences in order of submission and experience. You will receive portfolio allocation details at {formData.email} within 3 business days.
          </p>

          <div className="registration-actions">
            {onNavigateToSignIn && (
              <button
                type="button"
                className="registration-submit-btn"
                onClick={onNavigateToSignIn}
              >
                Go to Delegate Sign In
              </button>
            )}
            <button
              type="button"
              className="registration-secondary-btn"
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
            >
              Submit Another Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header-block">
          <h2 className="registration-title">Delegate Registration</h2>
          <p className="registration-subtitle">
            Complete the official conference application to secure your committee placement.
          </p>
        </div>

        {/* 3 Step indicator tabs: Identity, Committees, Review */}
        <div className="registration-steps-bar" role="tablist">
          <button
            type="button"
            className={`reg-step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
            onClick={() => currentStep > 1 && setCurrentStep(1)}
            disabled={currentStep < 1}
          >
            <span className="step-num">1</span>
            <span className="step-text">Identity</span>
          </button>
          <button
            type="button"
            className={`reg-step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            disabled={currentStep < 2}
          >
            <span className="step-num">2</span>
            <span className="step-text">Committees</span>
          </button>
          <button
            type="button"
            className={`reg-step-item ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => currentStep > 2 && setCurrentStep(3)}
            disabled={currentStep < 3}
          >
            <span className="step-num">3</span>
            <span className="step-text">Review</span>
          </button>
        </div>

        {errorMessage && (
          <div className="registration-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="registration-form">
          {/* STEP 1: IDENTITY & INSTITUTION */}
          {currentStep === 1 && (
            <div className="reg-step-section">
              <h3 className="reg-section-title">Section 1: Delegate Identity</h3>

              <div className="reg-field-group">
                <label className="reg-label">Registration Type</label>
                <div className="reg-radio-group">
                  <label className="reg-radio-label">
                    <input
                      type="radio"
                      name="registrationType"
                      checked={formData.registrationType === 'individual'}
                      onChange={() => updateField('registrationType', 'individual')}
                    />
                    <span>Individual Delegate</span>
                  </label>
                  <label className="reg-radio-label">
                    <input
                      type="radio"
                      name="registrationType"
                      checked={formData.registrationType === 'group'}
                      onChange={() => updateField('registrationType', 'group')}
                    />
                    <span>Group Delegation</span>
                  </label>
                </div>
              </div>

              {formData.registrationType === 'group' && (
                <div className="reg-subpanel">
                  <h4 className="reg-subpanel-title">Group / Delegation Details</h4>
                  <div className="reg-row">
                    <div className="reg-field-group">
                      <label htmlFor="reg-group-name" className="reg-label">
                        Delegation / Group Name
                      </label>
                      <input
                        id="reg-group-name"
                        type="text"
                        className="reg-input"
                        value={formData.groupName || ''}
                        onChange={(e) => updateField('groupName', e.target.value)}
                        placeholder="e.g. NIT Raipur MUN Society"
                        required
                      />
                    </div>
                    <div className="reg-field-group">
                      <label htmlFor="reg-group-size" className="reg-label">
                        Estimated Number of Delegates
                      </label>
                      <input
                        id="reg-group-size"
                        type="number"
                        min="2"
                        max="50"
                        className="reg-input"
                        value={formData.groupSize || ''}
                        onChange={(e) => updateField('groupSize', e.target.value)}
                        placeholder="e.g. 6"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="reg-row">
                <div className="reg-field-group">
                  <label htmlFor="reg-fullname" className="reg-label">
                    {formData.registrationType === 'group' ? 'Head Delegate / Lead Name' : 'Full Legal Name'}
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    className="reg-input"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="First and last name"
                    required
                  />
                </div>
                <div className="reg-field-group">
                  <label htmlFor="reg-email" className="reg-label">
                    Official Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    className="reg-input"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="delegate@institution.edu"
                    required
                  />
                </div>
              </div>

              <div className="reg-row">
                <div className="reg-field-group">
                  <label htmlFor="reg-phone" className="reg-label">
                    Contact Phone Number
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="reg-input"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="reg-field-group">
                  <label htmlFor="reg-academic" className="reg-label">
                    Academic Level
                  </label>
                  <select
                    id="reg-academic"
                    className="reg-select"
                    value={formData.academicLevel}
                    onChange={(e) => updateField('academicLevel', e.target.value)}
                  >
                    <option value="High School">High School (Grades 9 to 12)</option>
                    <option value="Undergraduate">Undergraduate Degree</option>
                    <option value="Postgraduate">Postgraduate Degree</option>
                    <option value="Independent">Independent Scholar / Observer</option>
                  </select>
                </div>
              </div>

              <div className="reg-row">
                <div className="reg-field-group">
                  <label htmlFor="reg-institution" className="reg-label">
                    Educational Institution or College
                  </label>
                  <input
                    id="reg-institution"
                    type="text"
                    className="reg-input"
                    value={formData.institution}
                    onChange={(e) => updateField('institution', e.target.value)}
                    placeholder="e.g. National Institute of Technology Raipur"
                    required
                  />
                </div>
                <div className="reg-field-group">
                  <label htmlFor="reg-city" className="reg-label">
                    City and Country
                  </label>
                  <div className="reg-split-inputs">
                    <input
                      id="reg-city"
                      type="text"
                      className="reg-input"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="City (e.g. Raipur)"
                      required
                    />
                    <input
                      id="reg-country"
                      type="text"
                      className="reg-input"
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      placeholder="Country (e.g. India)"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COMMITTEE & PORTFOLIO */}
          {currentStep === 2 && (
            <div className="reg-step-section">
              <h3 className="reg-section-title">Section 2: Committee Preferences</h3>

              <div className="reg-committee-block">
                <div className="reg-row">
                  <div className="reg-field-group">
                    <label htmlFor="reg-comm-1" className="reg-label">
                      First Committee Choice
                    </label>
                    <select
                      id="reg-comm-1"
                      className="reg-select"
                      value={formData.primaryCommittee}
                      onChange={(e) => updateField('primaryCommittee', e.target.value)}
                    >
                      {COMMITTEES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} : {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="reg-field-group">
                    <label htmlFor="reg-countries-1" className="reg-label">
                      Preferred Countries or Portfolios (Top 3)
                    </label>
                    <input
                      id="reg-countries-1"
                      type="text"
                      className="reg-input"
                      value={formData.primaryCountries}
                      onChange={(e) => updateField('primaryCountries', e.target.value)}
                      placeholder="e.g. India, France, Japan"
                      required
                    />
                  </div>
                </div>

                <div className="reg-row">
                  <div className="reg-field-group">
                    <label htmlFor="reg-comm-2" className="reg-label">
                      Second Committee Choice
                    </label>
                    <select
                      id="reg-comm-2"
                      className="reg-select"
                      value={formData.secondaryCommittee}
                      onChange={(e) => updateField('secondaryCommittee', e.target.value)}
                    >
                      {COMMITTEES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} : {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="reg-field-group">
                    <label htmlFor="reg-countries-2" className="reg-label">
                      Preferred Countries (Choice 2)
                    </label>
                    <input
                      id="reg-countries-2"
                      type="text"
                      className="reg-input"
                      value={formData.secondaryCountries}
                      onChange={(e) => updateField('secondaryCountries', e.target.value)}
                      placeholder="e.g. United Kingdom, South Africa, Germany"
                    />
                  </div>
                </div>

                <div className="reg-row">
                  <div className="reg-field-group">
                    <label htmlFor="reg-comm-3" className="reg-label">
                      Third Committee Choice
                    </label>
                    <select
                      id="reg-comm-3"
                      className="reg-select"
                      value={formData.tertiaryCommittee}
                      onChange={(e) => updateField('tertiaryCommittee', e.target.value)}
                    >
                      {COMMITTEES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} : {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="reg-field-group">
                    <label htmlFor="reg-countries-3" className="reg-label">
                      Preferred Countries (Choice 3)
                    </label>
                    <input
                      id="reg-countries-3"
                      type="text"
                      className="reg-input"
                      value={formData.tertiaryCountries}
                      onChange={(e) => updateField('tertiaryCountries', e.target.value)}
                      placeholder="e.g. Brazil, Kenya, Mexico"
                    />
                  </div>
                </div>
              </div>

              <div className="reg-row">
                <div className="reg-field-group">
                  <label htmlFor="reg-experience" className="reg-label">
                    Prior MUN Conferences Attended
                  </label>
                  <select
                    id="reg-experience"
                    className="reg-select"
                    value={formData.experienceLevel}
                    onChange={(e) => updateField('experienceLevel', e.target.value)}
                  >
                    <option value="None / First Conference">None (First Conference)</option>
                    <option value="1 to 3 Conferences">1 to 3 Conferences</option>
                    <option value="4 to 7 Conferences">4 to 7 Conferences</option>
                    <option value="8 or more Conferences">8 or more Conferences</option>
                  </select>
                </div>
                <div className="reg-field-group">
                  <label htmlFor="reg-past-awards" className="reg-label">
                    Past Recognitions or Key Committees (Optional)
                  </label>
                  <input
                    id="reg-past-awards"
                    type="text"
                    className="reg-input"
                    value={formData.pastConferences}
                    onChange={(e) => updateField('pastConferences', e.target.value)}
                    placeholder="e.g. Best Delegate at IIT Bombay MUN"
                  />
                </div>
              </div>

              <div className="reg-field-group">
                <label htmlFor="reg-statement" className="reg-label">
                  Statement of Intent and Motivation
                </label>
                <textarea
                  id="reg-statement"
                  className="reg-textarea"
                  rows={4}
                  value={formData.statementOfIntent}
                  onChange={(e) => updateField('statementOfIntent', e.target.value)}
                  placeholder="Outline your substantive interest in your primary committee choice and relevant research background."
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & DECLARATION */}
          {currentStep === 3 && (
            <div className="reg-step-section">
              <h3 className="reg-section-title">Section 3: Review and Declaration</h3>

              <div className="reg-review-table">
                <div className="reg-review-row">
                  <span className="reg-review-label">Registration Type</span>
                  <span className="reg-review-value">
                    {formData.registrationType === 'group'
                      ? `Group Delegation (${formData.groupName || 'Delegation'})`
                      : 'Individual Delegate'}
                  </span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">
                    {formData.registrationType === 'group' ? 'Head Delegate' : 'Delegate'}
                  </span>
                  <span className="reg-review-value">{formData.fullName}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Email</span>
                  <span className="reg-review-value">{formData.email}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Contact Phone</span>
                  <span className="reg-review-value">{formData.phone}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Institution</span>
                  <span className="reg-review-value">{formData.institution}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Primary Committee</span>
                  <span className="reg-review-value">
                    {formData.primaryCommittee} ({formData.primaryCountries})
                  </span>
                </div>
                <div className="reg-review-row total-row">
                  <span className="reg-review-label">Registration Fee</span>
                  <span className="reg-review-value">Free (No Cost)</span>
                </div>
              </div>

              <div className="reg-declaration-box">
                <label className="reg-checkbox-label">
                  <input
                    id="reg-agreed-terms"
                    type="checkbox"
                    className="reg-checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                  />
                  <span>
                    I confirm that the information submitted is accurate and binding. I agree to abide by the LIT-MUN Rules of Procedure, conference decorum, and code of conduct.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="reg-button-row">
            {currentStep > 1 && (
              <button
                type="button"
                className="reg-secondary-btn"
                onClick={handlePrevious}
              >
                Previous Step
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                id="reg-next-button"
                className="reg-submit-btn"
                onClick={handleNext}
              >
                Continue to Next Section
              </button>
            ) : (
              <button
                type="submit"
                id="reg-submit-application-button"
                className="reg-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Application...' : 'Confirm and Submit Application'}
              </button>
            )}
          </div>
        </form>

        <div className="reg-footer-nav">
          <p className="reg-footer-text">
            Already have an active registration or account?{' '}
            {onNavigateToSignIn && (
              <button
                type="button"
                className="reg-inline-link"
                onClick={onNavigateToSignIn}
              >
                Sign In to Delegate Portal
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
