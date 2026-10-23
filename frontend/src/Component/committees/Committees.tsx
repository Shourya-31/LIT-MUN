import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Calendar, FileText, List, X } from 'lucide-react';
import { committeesData, type Committee } from './committeesData';
import './Committees.css';

export interface CommitteesProps {
  committees?: Committee[];
}

const CommitteeListDialog: React.FC<{ committee: Committee; onClose: () => void }> = ({ committee, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isPartyList = committee.code === 'AIPPM';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    window.dispatchEvent(new Event('litmun:dialog-layer-change'));
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      window.dispatchEvent(new Event('litmun:dialog-layer-change'));
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      id={`committee-list-${committee.id}`}
      className="committee-list-dialog"
      aria-labelledby="committee-list-title"
      aria-describedby="committee-list-description"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
          onClose();
        }
      }}
    >
      <header className="committee-list-header">
        <div>
          <h3 id="committee-list-title">{committee.code} {isPartyList ? 'party list' : 'country list'}</h3>
          <p id="committee-list-description">
            {committee.name} · {committee.portfolios.length} {isPartyList ? 'delegate portfolios' : 'countries'}
          </p>
        </div>
        <button type="button" className="committee-list-close" onClick={onClose} aria-label="Close list" autoFocus>
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <ol className="committee-list-entries">
        {committee.portfolios.map((portfolio, index) => (
          <li key={portfolio}>
            <span className="committee-list-number" aria-hidden="true">{index + 1}.</span>
            <span>{portfolio}</span>
          </li>
        ))}
      </ol>
    </dialog>,
    document.body,
  );
};

export const Committees: React.FC<CommitteesProps> = ({ committees = committeesData }) => {
  const [openAgendas, setOpenAgendas] = useState<Record<string, boolean>>({});
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
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
                  ref={(element) => { if (element) element.inert = !isOpen; }}
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
                <button
                  type="button"
                  className="committee-list-btn"
                  aria-haspopup="dialog"
                  onClick={() => setSelectedCommittee(committee)}
                >
                  <List size={14} aria-hidden="true" />
                  Open {committee.code === 'AIPPM' ? 'party' : 'country'} list
                </button>
              </article>
            );
          })}
        </div>
      </div>
      {selectedCommittee && (
        <CommitteeListDialog committee={selectedCommittee} onClose={() => setSelectedCommittee(null)} />
      )}
    </section>
  );
};

export default Committees;
