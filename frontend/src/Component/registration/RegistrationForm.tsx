import React, { useState } from 'react';
import {
  Globe,
  Shield,
  Users,
  Search,
  X,
  CheckCircle2,
  ListFilter,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import {
  AVAILABLE_COMMITTEES,
  COMMITTEE_PORTFOLIOS,
} from './portfoliosData';
import './RegistrationForm.css';

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  academicLevel: string;
  city: string;
  country: string;

  committeeChoice1: string;
  committee1Pref1: string;
  committee1Pref2: string;
  committee1Pref3: string;

  committeeChoice2: string;
  committee2Pref1: string;
  committee2Pref2: string;
  committee2Pref3: string;

  committeeChoice3: string;
  committee3Pref1: string;
  committee3Pref2: string;
  committee3Pref3: string;

  experienceLevel: string;
  pastConferences: string;
  statementOfIntent: string;

  agreedToTerms: boolean;

  // Backward compatibility alias keys
  primaryCommittee?: string;
  primaryCountries?: string;
  secondaryCommittee?: string;
  secondaryCountries?: string;
  tertiaryCommittee?: string;
  tertiaryCountries?: string;
}

export interface RegistrationFormProps {
  onSuccess?: (data: RegistrationFormData) => void;
  onNavigateToSignIn?: () => void;
}

const EXPERIENCE_OPTIONS = [
  '0 (First Conference)',
  '1+',
  '5+',
  '10+',
  '15+',
  '50+',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onNavigateToSignIn,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    academicLevel: 'Undergraduate',
    city: '',
    country: 'India',

    committeeChoice1: 'UNSC',
    committee1Pref1: '',
    committee1Pref2: '',
    committee1Pref3: '',

    committeeChoice2: 'UNHRC',
    committee2Pref1: '',
    committee2Pref2: '',
    committee2Pref3: '',

    committeeChoice3: 'AIPPM',
    committee3Pref1: '',
    committee3Pref2: '',
    committee3Pref3: '',

    experienceLevel: '1+',
    pastConferences: '',
    statementOfIntent: '',
    agreedToTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal state for "View Available Countries & Portfolios"
  const [isPortfoliosModalOpen, setIsPortfoliosModalOpen] = useState<boolean>(false);
  const [modalActiveTab, setModalActiveTab] = useState<string>('UNSC');
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');

  const updateField = (
    field: keyof RegistrationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommitteeChange = (
    choiceIndex: 1 | 2 | 3,
    newCommitteeCode: string
  ) => {
    if (choiceIndex === 1) {
      setFormData((prev) => ({
        ...prev,
        committeeChoice1: newCommitteeCode,
        committee1Pref1: '',
        committee1Pref2: '',
        committee1Pref3: '',
      }));
    } else if (choiceIndex === 2) {
      setFormData((prev) => ({
        ...prev,
        committeeChoice2: newCommitteeCode,
        committee2Pref1: '',
        committee2Pref2: '',
        committee2Pref3: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        committeeChoice3: newCommitteeCode,
        committee3Pref1: '',
        committee3Pref2: '',
        committee3Pref3: '',
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMessage('Please enter your full legal name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please provide a valid official email address.');
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMessage('Please provide your active contact phone number.');
        return false;
      }
      if (!formData.institution.trim()) {
        setErrorMessage('Please state your educational institution or college.');
        return false;
      }
      if (!formData.city.trim() || !formData.country.trim()) {
        setErrorMessage('Please specify your city and country of residence.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.committeeChoice1) {
        setErrorMessage('Please select Committee Choice 1.');
        return false;
      }
      if (
        !formData.committee1Pref1 ||
        !formData.committee1Pref2 ||
        !formData.committee1Pref3
      ) {
        setErrorMessage(
          'Please select all 3 preferred countries/portfolios for Committee Choice 1.'
        );
        return false;
      }
      if (
        formData.committee1Pref1 === formData.committee1Pref2 ||
        formData.committee1Pref1 === formData.committee1Pref3 ||
        formData.committee1Pref2 === formData.committee1Pref3
      ) {
        setErrorMessage(
          'Please choose three different country/portfolio preferences for Committee Choice 1.'
        );
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
      const nextStep = Math.min(currentStep + 1, 3);
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepJump = (targetStep: number) => {
    // Only allow navigating to steps that have already been activated
    if (targetStep <= maxStepReached) {
      setErrorMessage(null);
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      const finalData: RegistrationFormData = {
        ...formData,
        primaryCommittee: formData.committeeChoice1,
        primaryCountries: `${formData.committee1Pref1}, ${formData.committee1Pref2}, ${formData.committee1Pref3}`,
        secondaryCommittee: formData.committeeChoice2,
        secondaryCountries: [formData.committee2Pref1, formData.committee2Pref2, formData.committee2Pref3]
          .filter(Boolean)
          .join(', '),
        tertiaryCommittee: formData.committeeChoice3,
        tertiaryCountries: [formData.committee3Pref1, formData.committee3Pref2, formData.committee3Pref3]
          .filter(Boolean)
          .join(', '),
      };

      if (onSuccess) {
        onSuccess(finalData);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Helper for committee icon
  const getCommitteeIcon = (code: string) => {
    switch (code) {
      case 'UNSC':
        return <Shield size={16} aria-hidden="true" />;
      case 'UNHRC':
        return <Globe size={16} aria-hidden="true" />;
      case 'AIPPM':
        return <Users size={16} aria-hidden="true" />;
      default:
        return <Shield size={16} aria-hidden="true" />;
    }
  };

  // Render post-submit confirmation screen
  if (isSubmitted) {
    return (
      <div className="registration-container">
        <div className="registration-card submission-success-card">
          <div className="submission-success-header">
            <div className="success-icon-badge">
              <CheckCircle2 size={44} className="success-check-icon" />
            </div>
            <h2 className="registration-title">Registration Submitted</h2>
            <div className="success-alert-banner" role="status">
              <p className="success-banner-text">
                Your registration has been accepted and you will be notified soon through email.
              </p>
            </div>
          </div>

          <div className="registration-summary-box">
            <div className="reg-summary-row">
              <span className="reg-summary-key">Application ID</span>
              <span className="reg-summary-val highlight-id">LIT-MUN-2026-8941</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Delegate Name</span>
              <span className="reg-summary-val">{formData.fullName}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Delegate Email</span>
              <span className="reg-summary-val">{formData.email}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Contact Phone</span>
              <span className="reg-summary-val">{formData.phone}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Institution</span>
              <span className="reg-summary-val">{formData.institution}</span>
            </div>
            <div className="reg-summary-row">
              <span className="reg-summary-key">Committee Choice 1</span>
              <span className="reg-summary-val">
                {formData.committeeChoice1} : {COMMITTEE_PORTFOLIOS[formData.committeeChoice1]?.name}
              </span>
            </div>
            <div className="reg-summary-row sub-row">
              <span className="reg-summary-key">Preferred Portfolios (Choice 1)</span>
              <span className="reg-summary-val">
                1. {formData.committee1Pref1} | 2. {formData.committee1Pref2} | 3. {formData.committee1Pref3}
              </span>
            </div>
            {formData.committeeChoice2 && (
              <div className="reg-summary-row">
                <span className="reg-summary-key">Committee Choice 2</span>
                <span className="reg-summary-val">
                  {formData.committeeChoice2} : {COMMITTEE_PORTFOLIOS[formData.committeeChoice2]?.name}
                </span>
              </div>
            )}
            {formData.committeeChoice3 && (
              <div className="reg-summary-row">
                <span className="reg-summary-key">Committee Choice 3</span>
                <span className="reg-summary-val">
                  {formData.committeeChoice3} : {COMMITTEE_PORTFOLIOS[formData.committeeChoice3]?.name}
                </span>
              </div>
            )}
            <div className="reg-summary-row total-row">
              <span className="reg-summary-key">Registration Fee</span>
              <span className="reg-summary-val free-badge">No Cost / Free</span>
            </div>
          </div>

          <p className="registration-note">
            The Executive Board reviews preferences in order of submission and verified credentials. You will receive official portfolio allocation and conference study material at <strong>{formData.email}</strong>.
          </p>

          <div className="registration-actions">
            {onSuccess && (
              <button
                type="button"
                className="registration-submit-btn"
                onClick={() => onSuccess(formData)}
              >
                Go to Dashboard
              </button>
            )}
            {onNavigateToSignIn && (
              <button
                type="button"
                className="registration-secondary-btn"
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
                setMaxStepReached(1);
              }}
            >
              Submit Another Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active committee portfolio list for current modal tab
  const activeModalCommittee = COMMITTEE_PORTFOLIOS[modalActiveTab] || COMMITTEE_PORTFOLIOS.UNSC;
  const filteredModalPortfolios = activeModalCommittee.portfolios.filter((p) =>
    p.toLowerCase().includes(modalSearchQuery.toLowerCase())
  );

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header-block">
          <h2 className="registration-title">Delegate Registration</h2>
          <p className="registration-subtitle">
            Complete the official conference application to secure your committee and portfolio preferences.
          </p>
        </div>

        {/* 3 Step Navigation Bar: Once activated, steps remain activated so user can move back and forth */}
        <div className="registration-steps-bar" role="tablist" aria-label="Registration Progress">
          <button
            type="button"
            className={`reg-step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''} ${1 <= maxStepReached ? 'activated' : ''}`}
            onClick={() => handleStepJump(1)}
            aria-selected={currentStep === 1}
            title="Step 1: Delegate Identity"
          >
            <span className="step-num">1</span>
            <span className="step-text">Identity</span>
          </button>
          <button
            type="button"
            className={`reg-step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''} ${2 <= maxStepReached ? 'activated' : ''}`}
            onClick={() => handleStepJump(2)}
            disabled={maxStepReached < 2}
            aria-selected={currentStep === 2}
            title={maxStepReached >= 2 ? 'Step 2: Committees' : 'Complete Step 1 to unlock'}
          >
            <span className="step-num">2</span>
            <span className="step-text">Committees</span>
          </button>
          <button
            type="button"
            className={`reg-step-item ${currentStep === 3 ? 'active' : ''} ${3 <= maxStepReached ? 'activated' : ''}`}
            onClick={() => handleStepJump(3)}
            disabled={maxStepReached < 3}
            aria-selected={currentStep === 3}
            title={maxStepReached >= 3 ? 'Step 3: Review' : 'Complete Step 2 to unlock'}
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
          {/* STEP 1: INDIVIDUAL DELEGATE IDENTITY */}
          {currentStep === 1 && (
            <div className="reg-step-section">
              <div className="section-title-wrap">
                <h3 className="reg-section-title">Section 1: Delegate Identity</h3>
                <span className="section-tag">Individual Delegate</span>
              </div>

              <div className="reg-row">
                <div className="reg-field-group">
                  <label htmlFor="reg-fullname" className="reg-label">
                    Legal Name <span className="req-star">*</span>
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    className="reg-input"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Full legal name as per ID"
                    required
                  />
                </div>
                <div className="reg-field-group">
                  <label htmlFor="reg-email" className="reg-label">
                    Official Email <span className="req-star">*</span>
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
                    Phone Number <span className="req-star">*</span>
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
                    Educational Institution / College <span className="req-star">*</span>
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
                    City & Country <span className="req-star">*</span>
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

          {/* STEP 2: COMMITTEES & PREFERRED COUNTRIES / PORTFOLIOS */}
          {currentStep === 2 && (
            <div className="reg-step-section">
              <div className="section-title-wrap committee-section-header">
                <div>
                  <h3 className="reg-section-title">Section 2: Committee & Portfolio Choices</h3>
                  <p className="reg-section-desc">
                    Choose from our 3 official committees and select 3 country or portfolio preferences for each choice.
                  </p>
                </div>

                {/* View Available Countries & Portfolios button */}
                <button
                  type="button"
                  id="btn-view-available-portfolios"
                  className="btn-view-portfolios"
                  onClick={() => setIsPortfoliosModalOpen(true)}
                  title="Explore all countries and portfolios across UNSC, UNHRC, and AIPPM"
                >
                  <ListFilter size={15} className="btn-icon" />
                  <span>View Available Countries & Portfolios</span>
                </button>
              </div>

              {/* Committee Choice 1 */}
              <div className="committee-choice-card">
                <div className="choice-header">
                  <div className="choice-title-pill">
                    <span className="choice-badge">1</span>
                    <span className="choice-heading">Committee Choice 1 (Primary)</span>
                  </div>
                </div>

                <div className="reg-field-group">
                  <label htmlFor="reg-comm-choice-1" className="reg-label">
                    Select Committee <span className="req-star">*</span>
                  </label>
                  <select
                    id="reg-comm-choice-1"
                    className="reg-select comm-select"
                    value={formData.committeeChoice1}
                    onChange={(e) => handleCommitteeChange(1, e.target.value)}
                  >
                    {AVAILABLE_COMMITTEES.map((comm) => (
                      <option key={comm.code} value={comm.code}>
                        {comm.code} — {comm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="portfolio-preferences-box">
                  <div className="pref-box-title">
                    <span>
                      Select 3 Preferred {formData.committeeChoice1 === 'AIPPM' ? 'Portfolios' : 'Countries'} for {formData.committeeChoice1}
                    </span>
                    <span className="pref-note">(Top 3 Choices)</span>
                  </div>

                  <div className="pref-dropdown-grid">
                    <div className="reg-field-group">
                      <label htmlFor="reg-comm1-p1" className="reg-label-sub">
                        Preference 1 <span className="req-star">*</span>
                      </label>
                      <select
                        id="reg-comm1-p1"
                        className="reg-select"
                        value={formData.committee1Pref1}
                        onChange={(e) => updateField('committee1Pref1', e.target.value)}
                        required
                      >
                        <option value="">-- Select Preference 1 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice1]?.portfolios.map((item) => (
                          <option
                            key={item}
                            value={item}
                            disabled={item === formData.committee1Pref2 || item === formData.committee1Pref3}
                          >
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-comm1-p2" className="reg-label-sub">
                        Preference 2 <span className="req-star">*</span>
                      </label>
                      <select
                        id="reg-comm1-p2"
                        className="reg-select"
                        value={formData.committee1Pref2}
                        onChange={(e) => updateField('committee1Pref2', e.target.value)}
                        required
                      >
                        <option value="">-- Select Preference 2 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice1]?.portfolios.map((item) => (
                          <option
                            key={item}
                            value={item}
                            disabled={item === formData.committee1Pref1 || item === formData.committee1Pref3}
                          >
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-comm1-p3" className="reg-label-sub">
                        Preference 3 <span className="req-star">*</span>
                      </label>
                      <select
                        id="reg-comm1-p3"
                        className="reg-select"
                        value={formData.committee1Pref3}
                        onChange={(e) => updateField('committee1Pref3', e.target.value)}
                        required
                      >
                        <option value="">-- Select Preference 3 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice1]?.portfolios.map((item) => (
                          <option
                            key={item}
                            value={item}
                            disabled={item === formData.committee1Pref1 || item === formData.committee1Pref2}
                          >
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Committee Choice 2 */}
              <div className="committee-choice-card">
                <div className="choice-header">
                  <div className="choice-title-pill">
                    <span className="choice-badge">2</span>
                    <span className="choice-heading">Committee Choice 2 (Alternative)</span>
                  </div>
                </div>

                <div className="reg-field-group">
                  <label htmlFor="reg-comm-choice-2" className="reg-label">
                    Select Committee
                  </label>
                  <select
                    id="reg-comm-choice-2"
                    className="reg-select comm-select"
                    value={formData.committeeChoice2}
                    onChange={(e) => handleCommitteeChange(2, e.target.value)}
                  >
                    {AVAILABLE_COMMITTEES.map((comm) => (
                      <option key={comm.code} value={comm.code}>
                        {comm.code} — {comm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="portfolio-preferences-box">
                  <div className="pref-box-title">
                    <span>
                      Select Preferred {formData.committeeChoice2 === 'AIPPM' ? 'Portfolios' : 'Countries'} for {formData.committeeChoice2}
                    </span>
                    <span className="pref-note">(Optional Backup)</span>
                  </div>

                  <div className="pref-dropdown-grid">
                    <div className="reg-field-group">
                      <label htmlFor="reg-comm2-p1" className="reg-label-sub">Preference 1</label>
                      <select
                        id="reg-comm2-p1"
                        className="reg-select"
                        value={formData.committee2Pref1}
                        onChange={(e) => updateField('committee2Pref1', e.target.value)}
                      >
                        <option value="">-- Select Preference 1 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice2]?.portfolios.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-comm2-p2" className="reg-label-sub">Preference 2</label>
                      <select
                        id="reg-comm2-p2"
                        className="reg-select"
                        value={formData.committee2Pref2}
                        onChange={(e) => updateField('committee2Pref2', e.target.value)}
                      >
                        <option value="">-- Select Preference 2 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice2]?.portfolios.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-comm2-p3" className="reg-label-sub">Preference 3</label>
                      <select
                        id="reg-comm2-p3"
                        className="reg-select"
                        value={formData.committee2Pref3}
                        onChange={(e) => updateField('committee2Pref3', e.target.value)}
                      >
                        <option value="">-- Select Preference 3 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice2]?.portfolios.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Committee Choice 3 */}
              <div className="committee-choice-card">
                <div className="choice-header">
                  <div className="choice-title-pill">
                    <span className="choice-badge">3</span>
                    <span className="choice-heading">Committee Choice 3 (Alternative)</span>
                  </div>
                </div>

                <div className="reg-field-group">
                  <label htmlFor="reg-comm-choice-3" className="reg-label">
                    Select Committee
                  </label>
                  <select
                    id="reg-comm-choice-3"
                    className="reg-select comm-select"
                    value={formData.committeeChoice3}
                    onChange={(e) => handleCommitteeChange(3, e.target.value)}
                  >
                    {AVAILABLE_COMMITTEES.map((comm) => (
                      <option key={comm.code} value={comm.code}>
                        {comm.code} — {comm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="portfolio-preferences-box">
                  <div className="pref-box-title">
                    <span>
                      Select Preferred {formData.committeeChoice3 === 'AIPPM' ? 'Portfolios' : 'Countries'} for {formData.committeeChoice3}
                    </span>
                    <span className="pref-note">(Optional Backup)</span>
                  </div>

                  <div className="pref-dropdown-grid">
                    <div className="reg-field-group">
                      <label htmlFor="reg-comm3-p1" className="reg-label-sub">Preference 1</label>
                      <select
                        id="reg-comm3-p1"
                        className="reg-select"
                        value={formData.committee3Pref1}
                        onChange={(e) => updateField('committee3Pref1', e.target.value)}
                      >
                        <option value="">-- Select Preference 1 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice3]?.portfolios.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-comm3-p2" className="reg-label-sub">Preference 2</label>
                      <select
                        id="reg-comm3-p2"
                        className="reg-select"
                        value={formData.committee3Pref2}
                        onChange={(e) => updateField('committee3Pref2', e.target.value)}
                      >
                        <option value="">-- Select Preference 2 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice3]?.portfolios.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-comm3-p3" className="reg-label-sub">Preference 3</label>
                      <select
                        id="reg-comm3-p3"
                        className="reg-select"
                        value={formData.committee3Pref3}
                        onChange={(e) => updateField('committee3Pref3', e.target.value)}
                      >
                        <option value="">-- Select Preference 3 --</option>
                        {COMMITTEE_PORTFOLIOS[formData.committeeChoice3]?.portfolios.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prior Experience: 1+, 5+, 10+, 15+, 50+ */}
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
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="reg-field-group">
                  <label htmlFor="reg-past-awards" className="reg-label">
                    Past Recognitions or MUNs Attended (Optional)
                  </label>
                  <input
                    id="reg-past-awards"
                    type="text"
                    className="reg-input"
                    value={formData.pastConferences}
                    onChange={(e) => updateField('pastConferences', e.target.value)}
                    placeholder="e.g. Best Delegate at IIT MUN, Verbal Mention at Delhi MUN"
                  />
                </div>
              </div>

              {/* Statement of Intent: non-compulsory, no minimum limit */}
              <div className="reg-field-group">
                <div className="label-with-hint">
                  <label htmlFor="reg-statement" className="reg-label">
                    Statement of Intent / Motivation (Optional)
                  </label>
                  <span className="field-hint">Non-compulsory (10-20 words is fine)</span>
                </div>
                <textarea
                  id="reg-statement"
                  className="reg-textarea"
                  rows={3}
                  value={formData.statementOfIntent}
                  onChange={(e) => updateField('statementOfIntent', e.target.value)}
                  placeholder="Briefly state your interest in the selected committee or topics (optional)."
                />
              </div>
            </div>
          )}

          {/* STEP 3: FINAL REVIEW PAGE */}
          {currentStep === 3 && (
            <div className="reg-step-section">
              <h3 className="reg-section-title">Section 3: Review Application</h3>
              <p className="reg-section-desc">
                Please verify your details and preferred committee allocations prior to final submission.
              </p>

              <div className="reg-review-table">
                <div className="reg-review-row">
                  <span className="reg-review-label">Delegate Name</span>
                  <span className="reg-review-value">{formData.fullName}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Delegate Email</span>
                  <span className="reg-review-value">{formData.email}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Contact</span>
                  <span className="reg-review-value">{formData.phone}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Institution</span>
                  <span className="reg-review-value">{formData.institution}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">Academic Level</span>
                  <span className="reg-review-value">{formData.academicLevel}</span>
                </div>
                <div className="reg-review-row">
                  <span className="reg-review-label">City & Country</span>
                  <span className="reg-review-value">
                    {formData.city}, {formData.country}
                  </span>
                </div>

                <div className="reg-review-divider" />

                {/* Committee Choice 1, 2, 3 - not Primary/Secondary/Tertiary */}
                <div className="reg-review-row">
                  <span className="reg-review-label">Committee Choice 1</span>
                  <span className="reg-review-value">
                    <strong>{formData.committeeChoice1}</strong> (
                    {[formData.committee1Pref1, formData.committee1Pref2, formData.committee1Pref3]
                      .filter(Boolean)
                      .join(' | ') || 'None selected'}
                    )
                  </span>
                </div>

                <div className="reg-review-row">
                  <span className="reg-review-label">Committee Choice 2</span>
                  <span className="reg-review-value">
                    <strong>{formData.committeeChoice2}</strong>
                    {[formData.committee2Pref1, formData.committee2Pref2, formData.committee2Pref3].some(Boolean)
                      ? ` (${[formData.committee2Pref1, formData.committee2Pref2, formData.committee2Pref3].filter(Boolean).join(' | ')})`
                      : ' (No preferences specified)'}
                  </span>
                </div>

                <div className="reg-review-row">
                  <span className="reg-review-label">Committee Choice 3</span>
                  <span className="reg-review-value">
                    <strong>{formData.committeeChoice3}</strong>
                    {[formData.committee3Pref1, formData.committee3Pref2, formData.committee3Pref3].some(Boolean)
                      ? ` (${[formData.committee3Pref1, formData.committee3Pref2, formData.committee3Pref3].filter(Boolean).join(' | ')})`
                      : ' (No preferences specified)'}
                  </span>
                </div>

                <div className="reg-review-row">
                  <span className="reg-review-label">Prior MUNs Attended</span>
                  <span className="reg-review-value">{formData.experienceLevel}</span>
                </div>

                {formData.pastConferences && (
                  <div className="reg-review-row">
                    <span className="reg-review-label">Past Recognitions</span>
                    <span className="reg-review-value">{formData.pastConferences}</span>
                  </div>
                )}

                {formData.statementOfIntent && (
                  <div className="reg-review-row">
                    <span className="reg-review-label">Statement of Intent</span>
                    <span className="reg-review-value quote-text">{formData.statementOfIntent}</span>
                  </div>
                )}

                <div className="reg-review-row total-row">
                  <span className="reg-review-label">Registration Fee</span>
                  <span className="reg-review-value free-badge">No Cost / Free</span>
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
                <ArrowLeft size={16} />
                <span>Previous Section</span>
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                id="reg-next-button"
                className="reg-submit-btn"
                onClick={handleNext}
              >
                <span>Continue to Next Section</span>
                <ArrowRight size={16} />
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

      {/* Available Countries & Portfolios Modal */}
      {isPortfoliosModalOpen && (
        <div
          className="portfolios-modal-backdrop"
          onClick={() => setIsPortfoliosModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-portfolios-title"
        >
          <div
            className="portfolios-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <ListFilter size={20} className="modal-title-icon" />
                <div>
                  <h3 id="modal-portfolios-title" className="modal-title">
                    Available Countries & Portfolios Matrix
                  </h3>
                  <p className="modal-sub">
                    Reference list of countries and political portfolios available for LIT-MUN 2026.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPortfoliosModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Committee Tabs */}
            <div className="modal-committee-tabs" role="tablist">
              {AVAILABLE_COMMITTEES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  role="tab"
                  aria-selected={modalActiveTab === c.code}
                  className={`modal-tab-btn ${modalActiveTab === c.code ? 'active' : ''}`}
                  onClick={() => setModalActiveTab(c.code)}
                >
                  {getCommitteeIcon(c.code)}
                  <span className="tab-code">{c.code}</span>
                  <span className="tab-count">({c.portfolios.length})</span>
                </button>
              ))}
            </div>

            {/* Committee Info & Search */}
            <div className="modal-committee-meta">
              <div className="comm-meta-text">
                <span className="comm-meta-name">{activeModalCommittee.name}</span>
                <span className="comm-meta-cat">{activeModalCommittee.category}</span>
                <p className="comm-meta-desc">{activeModalCommittee.description}</p>
              </div>

              <div className="modal-search-bar">
                <Search size={16} className="modal-search-icon" />
                <input
                  type="text"
                  className="modal-search-input"
                  placeholder={`Search in ${modalActiveTab} (${activeModalCommittee.portfolios.length} items)...`}
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  autoFocus
                />
                {modalSearchQuery && (
                  <button
                    type="button"
                    className="modal-clear-search"
                    onClick={() => setModalSearchQuery('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Portfolios List */}
            <div className="modal-portfolios-grid" role="list">
              {filteredModalPortfolios.length > 0 ? (
                filteredModalPortfolios.map((item, index) => (
                  <div key={item} className="portfolio-item-card" role="listitem">
                    <span className="item-index">{index + 1}</span>
                    <span className="item-name">{item}</span>
                  </div>
                ))
              ) : (
                <div className="modal-empty-state">
                  <p>No countries or portfolios found matching "{modalSearchQuery}".</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <span className="modal-footer-hint">
                Showing {filteredModalPortfolios.length} of {activeModalCommittee.portfolios.length} positions in {modalActiveTab}
              </span>
              <button
                type="button"
                className="modal-done-btn"
                onClick={() => setIsPortfoliosModalOpen(false)}
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
