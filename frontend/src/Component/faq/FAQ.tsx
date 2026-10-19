import React, { useState } from 'react';
import { faqData, type FAQItem } from './faqData';
import './FAQ.css';

export interface FAQProps {
  items?: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items = faqData }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-main-heading">
      <div className="faq-container">
        <h2 id="faq-main-heading" className="faq-title">
          FAQS
        </h2>

        <div className="faq-list" role="presentation">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  id={buttonId}
                  className="faq-question-btn"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <div className="faq-header-content">
                    <span className="faq-number" aria-hidden="true">
                      {item.number}
                    </span>
                    <span className="faq-question-text">{item.question}</span>
                  </div>

                  <span className="faq-icon-wrapper" aria-hidden="true">
                    <svg
                      className={`faq-chevron ${isOpen ? 'is-open' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`faq-answer-panel ${isOpen ? 'is-open' : ''}`}
                >
                  <div className="faq-answer-inner">
                    <p className="faq-answer-content">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
