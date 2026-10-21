import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Calendar, FileText } from 'lucide-react';
import { committeesData, type Committee } from './committeesData';
import './Committees.css';

export interface CommitteesProps {
  committees?: Committee[];
}

export const Committees: React.FC<CommitteesProps> = ({ committees = committeesData }) => {
  const [openAgendas, setOpenAgendas] = useState<Record<string, boolean>>({});
  const reduceMotion = useReducedMotion() === true;

  const toggleAgenda = (id: string) => {
    setOpenAgendas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="committees-section" id="committees" aria-labelledby="committees-main-title">
      <div className="committees-container">
        {/* Section Header */}
        <header className="committees-header" data-reveal>
          <h2 id="committees-main-title" className="committees-title">
            Committees
          </h2>
        </header>

        {/* Committees Grid */}
        <div className="committees-grid" role="list">
          {committees.map((committee) => {
            const isOpen = Boolean(openAgendas[committee.id]);
            const buttonId = `committee-btn-${committee.id}`;
            const panelId = `committee-agenda-${committee.id}`;

            return (
              <article
                key={committee.id}
                className={`committee-card ${isOpen ? 'is-expanded' : ''}`}
                data-committee-card
                role="listitem"
              >
                {/* Authentic Circular Medallion Emblem Display */}
                <div className="committee-emblem-wrap">
                  <img
                    src={committee.emblemSrc}
                    alt={committee.emblemAlt}
                    className="committee-emblem-img"
                    loading="lazy"
                    width="190"
                    height="190"
                  />
                </div>

                {/* Acronym Badge / Pill */}
                <div className="committee-code-badge" aria-label={`Committee Acronym: ${committee.code}`}>
                  <span className="committee-code-text">{committee.code}</span>
                </div>

                {/* Committee Information */}
                <div className="committee-info">
                  <h3 className="committee-full-name">{committee.name}</h3>
                  <p className="committee-description">{committee.description}</p>
                </div>

                {/* "View Agenda" / "Hide Agenda" Action Button */}
                <button
                  type="button"
                  id={buttonId}
                  className={`committee-agenda-btn ${isOpen ? 'is-active' : ''}`}
                  onClick={() => toggleAgenda(committee.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="btn-label">{isOpen ? 'Hide Agenda' : 'View Agenda'}</span>
                  <ChevronDown
                    size={16}
                    className={`agenda-chevron ${isOpen ? 'is-rotated' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Expandable Agenda Dropdown Panel */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`committee-agenda-panel ${isOpen ? 'is-open' : ''}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? '' : undefined}
                >
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`agenda-${committee.id}`}
                        className="committee-agenda-wrapper"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.28,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <div className="committee-agenda-inner">
                          <div className="agenda-status-pill">
                            <Calendar size={13} aria-hidden="true" />
                            <span>CONFERENCE AGENDA</span>
                          </div>

                          <div className="agenda-text-block">
                            <FileText size={16} className="agenda-icon" aria-hidden="true" />
                            <p className="agenda-highlight">{committee.agenda}</p>
                          </div>

                          {committee.agendaNotice && (
                            <p className="agenda-notice">{committee.agendaNotice}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Committees;
