import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqData, type FAQItem } from './faqData';
import './FAQ.css';

export interface FAQProps {
  items?: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items = faqData }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion() === true;

  const toggleAccordion = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-main-heading">
      <div className="faq-container">
        <header className="faq-heading" data-reveal>
          <p className="faq-kicker">Delegate information</p>
          <h2 id="faq-main-heading" className="faq-title">Frequently asked questions</h2>
        </header>

        <div className="faq-list">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                data-faq-item
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

                  <ChevronDown
                    className={`faq-chevron ${isOpen ? 'is-open' : ''}`}
                    size={20}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`faq-answer-panel ${isOpen ? 'is-open' : ''}`}
                  aria-hidden={!isOpen}
                  ref={(element) => { if (element) element.inert = !isOpen; }}
                >
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={item.id}
                        className="faq-answer-inner"
                        initial={reduceMotion ? false : { height: 0, opacity: 0, y: -4 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: reduceMotion ? 0 : -3 }}
                        transition={{ duration: reduceMotion ? 0 : 0.26, ease: 'easeOut' }}
                      >
                        <p className="faq-answer-content">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
