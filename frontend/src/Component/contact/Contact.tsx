import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Camera, Mail, Send } from 'lucide-react';
import './Contact.css';

type SubmitState = 'idle' | 'opening-email' | 'error';

const subjectLabels: Record<string, string> = {
  registration: 'Delegate Registration',
  committee: 'Committee & Agendas',
  itinerary: 'Event Itinerary',
  sponsorship: 'Sponsorship & Collaborations',
  other: 'Other Inquiries',
};

export const Contact: React.FC = () => {
  const reduceMotion = useReducedMotion() === true;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.message.trim().length < 20) {
      setSubmitState('error');
      setStatusMessage('Please enter at least 20 non-whitespace characters in your message.');
      return;
    }

    const body = [
      `Name: ${formData.fullName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Subject: ${subjectLabels[formData.subject] ?? formData.subject}`,
      '',
      formData.message.trim(),
    ].join('\n');
    const mailto = `mailto:litfest@nitrr.ac.in?subject=${encodeURIComponent(
      `[LIT-MUN] ${subjectLabels[formData.subject] ?? 'General inquiry'}`,
    )}&body=${encodeURIComponent(body)}`;

    setSubmitState('opening-email');
    setStatusMessage('Opening your email app. Review the message there and select Send; this website cannot confirm delivery.');
    window.location.href = mailto;
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const lettersOnly = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData((previous) => ({ ...previous, fullName: lettersOnly }));
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((previous) => ({ ...previous, phone: digitsOnly }));
  };

  const handleFormChange = () => {
    if (submitState !== 'idle') {
      setSubmitState('idle');
      setStatusMessage('');
    }
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading" data-contact-section>
      <div className="contact-layout">
        <div className="contact-copy">
          <p className="contact-kicker" data-contact-intro>
            <span aria-hidden="true" />
            Get in touch
          </p>
          <h2 className="contact-heading" id="contact-heading" data-contact-intro>
            Have a question?
            <span>We&apos;re here to help.</span>
          </h2>
          <p className="contact-description" data-contact-intro>
            For registrations, committee queries, or general inquiries, reach out to us. We&apos;d love to hear from you.
          </p>

          <div className="contact-links" data-contact-intro>
            <a className="contact-link" href="mailto:litfest@nitrr.ac.in">
              <Mail size={20} aria-hidden="true" />
              <span>
                <small>Email the secretariat</small>
                <strong>litfest@nitrr.ac.in</strong>
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a
              className="contact-link"
              href="https://instagram.com/literary.nitrr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Camera size={20} aria-hidden="true" />
              <span>
                <small>Follow Literati</small>
                <strong>@literati_nitrr</strong>
              </span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="contact-form-panel" data-contact-form>
          <div className="contact-form-heading">
            <p>Write to us</p>
            <span>Fields marked * are required</span>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} onChange={handleFormChange}>
            <div className="contact-fields">
              <div className="contact-field">
                <label htmlFor="contact-name">Full name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleNameChange}
                  pattern="[a-zA-Z\s]+"
                  title="Name should only contain letters and spaces"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email address *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address (e.g. you@example.com)"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-phone">Phone number *</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-subject">Subject *</label>
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(event) => setFormData((previous) => ({ ...previous, subject: event.target.value }))}
                >
                  <option value="" disabled>Select a subject</option>
                  {Object.entries(subjectLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-field">
              <div className="contact-message-heading">
                <label htmlFor="contact-message">Message *</label>
                <span className={formData.message.trim().length >= 20 ? 'is-valid' : ''}>
                  {formData.message.trim().length} / 20 minimum
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                minLength={20}
                placeholder="Tell us how we can help..."
                value={formData.message}
                onChange={(event) => setFormData((previous) => ({ ...previous, message: event.target.value }))}
              />
            </div>

            <AnimatePresence initial={false}>
              {statusMessage && (
                <motion.p
                  key={submitState}
                  className={`contact-status ${submitState === 'error' ? 'is-error' : 'is-info'}`}
                  role={submitState === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  initial={{ opacity: 0, height: reduceMotion ? 'auto' : 0, y: reduceMotion ? 0 : -5 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: reduceMotion ? 'auto' : 0, y: reduceMotion ? 0 : -3 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  {statusMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <button className="contact-submit" type="submit">
              <span>{submitState === 'opening-email' ? 'Opening email app…' : 'Prepare email'}</span>
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
