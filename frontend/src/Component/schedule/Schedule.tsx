import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUpRight, CalendarDays, ChevronDown, Coffee, Gavel, MapPin, Sparkles } from 'lucide-react';
import SectionHeading from '../conference/SectionHeading';
import ScrollReveal from '../animations/ScrollReveal';
import { scheduleDays } from './scheduleData';
import type { ScheduleCategory, ScheduleProps } from './types';
import './Schedule.css';

const categories = {
  ceremony: { label: 'Ceremony', icon: Sparkles },
  committee: { label: 'Committee session', icon: Gavel },
  break: { label: 'Break', icon: Coffee },
} satisfies Record<ScheduleCategory, { label: string; icon: typeof Gavel }>;

const filters: readonly { value: ScheduleCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All sessions' },
  { value: 'ceremony', label: 'Ceremonies' },
  { value: 'committee', label: 'Committee' },
  { value: 'break', label: 'Breaks' },
];

export default function Schedule({ days = scheduleDays }: ScheduleProps) {
  const uid = useId();
  const [selectedId, setSelectedId] = useState(days[0]?.id ?? '');
  const [category, setCategory] = useState<ScheduleCategory | 'all'>('all');
  const [expandedByDay, setExpandedByDay] = useState<Record<string, Record<string, boolean>>>({});
  const day = days.find((item) => item.id === selectedId) ?? days[0];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasUnconfirmedDetails = day?.events.some((event) => !event.startTime || !event.endTime || !event.venue);
  const visibleEvents = day?.events.filter((event) => category === 'all' || event.category === category) ?? [];

  function isExpanded(eventId: string) {
    if (!day) return false;
    return expandedByDay[day.id]?.[eventId] ?? eventId === day.events[0]?.id;
  }

  const allExpanded = visibleEvents.length > 0 && visibleEvents.every((event) => isExpanded(event.id));

  function toggleEvent(eventId: string) {
    if (!day) return;
    const expanded = isExpanded(eventId);
    setExpandedByDay((previous) => ({
      ...previous,
      [day.id]: { ...previous[day.id], [eventId]: !expanded },
    }));
  }

  function toggleAll() {
    if (!day) return;
    setExpandedByDay((previous) => ({
      ...previous,
      [day.id]: {
        ...previous[day.id],
        ...Object.fromEntries(visibleEvents.map((event) => [event.id, !allExpanded])),
      },
    }));
  }

  function navigateDays(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % days.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + days.length) % days.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = days.length - 1;
    else return;
    event.preventDefault();
    setSelectedId(days[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="schedule" className="conference-section schedule-section" aria-labelledby={`${uid}-heading`}>
      <div className="conference-container">
        <ScrollReveal className="conference-reveal">
          <SectionHeading id={`${uid}-heading`} number="01" eyebrow="The conference programme"
            title={<>Conference <em>Schedule</em></>}
            description="From the first exchange of ideas to a shared resolution. Explore the rhythm of the conference." />
        </ScrollReveal>

        {day ? (
          <div className="schedule-programme">
            <div className="schedule-days" role="tablist" aria-label="Conference days" aria-orientation="horizontal">
              {days.map((item, index) => (
                <button key={item.id} ref={(node) => { tabRefs.current[index] = node; }} type="button"
                  role="tab" id={`${uid}-tab-${item.id}`} aria-selected={day.id === item.id}
                  aria-controls={`${uid}-panel`} tabIndex={day.id === item.id ? 0 : -1}
                  onClick={() => setSelectedId(item.id)} onKeyDown={(event) => navigateDays(event, index)}
                  className={`schedule-day ${day.id === item.id ? 'is-selected' : ''}`}>
                  <span className="schedule-day-label">{item.label}</span>
                  <span className="schedule-day-subtitle">{item.subtitle}</span>
                </button>
              ))}
            </div>

            <div key={day.id} id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${day.id}`} tabIndex={0} className="schedule-panel">
              <div className="schedule-panel-heading">
                <h3>{day.subtitle}</h3>
                <p role="status" aria-live="polite" aria-atomic="true">{category === 'all' ? day.events.length : `${visibleEvents.length} of ${day.events.length}`} {day.isPreview ? 'proposed ' : ''}{day.events.length === 1 ? 'session' : 'sessions'}</p>
              </div>

              {(day.isPreview || hasUnconfirmedDetails) && (
                <div className="schedule-note">
                  <CalendarDays size={16} aria-hidden="true" />
                  <p>{day.isPreview ? 'Illustrative programme. Dates and sessions await confirmation. ' : ''}TBA means details are still to be announced.</p>
                </div>
              )}

              {day.events.length > 0 && <div className="schedule-controls">
                <div className="schedule-filters" role="group" aria-label="Filter sessions by category">
                  {filters.map((filter) => {
                    const count = filter.value === 'all' ? day.events.length : day.events.filter((event) => event.category === filter.value).length;
                    return <button key={filter.value} type="button" data-category={filter.value}
                      aria-pressed={category === filter.value} onClick={() => setCategory(filter.value)}
                      aria-label={`${filter.label}: ${count} ${count === 1 ? 'session' : 'sessions'}`}>
                      {filter.label}<span className="schedule-filter-count" aria-hidden="true">{count}</span>
                    </button>;
                  })}
                </div>
                {visibleEvents.length > 1 && <button type="button" className="schedule-expand-all"
                  aria-controls={`${uid}-timeline`} onClick={toggleAll}>
                  {allExpanded ? 'Collapse all' : 'Expand all'}<ChevronDown size={15} className={allExpanded ? 'is-open' : ''} aria-hidden="true" />
                </button>}
              </div>}

              {visibleEvents.length ? <>
                <div className="schedule-column-headings" aria-hidden="true"><span>Time</span><span>Sessions & venues</span></div>
                <ol id={`${uid}-timeline`} className="schedule-timeline">
                  {visibleEvents.map((event) => {
                    const { icon: Icon, label } = categories[event.category];
                    const expanded = isExpanded(event.id);
                    const triggerId = `${uid}-${day.id}-${event.id}-trigger`;
                    const detailsId = `${uid}-${day.id}-${event.id}-details`;
                    return (
                      <li key={event.id} className={`schedule-event schedule-event--${event.category}${expanded ? ' is-expanded' : ''}`}>
                        <div className="schedule-event-time" data-unconfirmed={!event.startTime} role="group" aria-label={`${event.title} timing`}>
                          <span className="schedule-start-time">{event.startTime || 'TBA'}</span>
                          {(event.startTime || event.endTime) && <span className="schedule-end-time">to {event.endTime || 'TBA'}</span>}
                        </div>
                        <span className="schedule-marker" aria-hidden="true"><Icon size={15} /></span>
                        <article className="schedule-event-content">
                          <p className="schedule-category">{label}</p>
                          <h4 className="schedule-event-title">
                            <button type="button" id={triggerId} className="schedule-session-toggle" aria-expanded={expanded}
                              aria-controls={detailsId} aria-label={`${expanded ? 'Hide' : 'Show'} details for ${event.title}`} onClick={() => toggleEvent(event.id)}>
                              <span className="schedule-session-title-text">{event.title}</span>
                              <span className="schedule-session-action" aria-hidden="true"><span>{expanded ? 'Hide details' : 'View details'}</span><ChevronDown size={18} className={expanded ? 'is-open' : ''} /></span>
                            </button>
                          </h4>
                          <p className="schedule-event-venue"><MapPin size={14} aria-hidden="true" /><span className="conference-sr-only">Venue: </span>{event.venue || 'TBA'}</p>
                          <div id={detailsId} className="schedule-event-details" role="region" aria-labelledby={triggerId} hidden={!expanded}>
                            <p className="schedule-event-description">{event.description}</p>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ol>
              </> : day.events.length ? (
                <div className="conference-empty"><CalendarDays size={32} aria-hidden="true" /><h4>No sessions in this category</h4><p>Choose another category to explore the rest of this day.</p><button type="button" className="conference-text-button" onClick={() => setCategory('all')}>Show all sessions <ArrowUpRight size={16} aria-hidden="true" /></button></div>
              ) : <div className="conference-empty"><CalendarDays size={32} aria-hidden="true" /><h4>Sessions to be announced</h4><p>The programme for this day will appear here once it is available.</p></div>}
            </div>

            <div className="schedule-footer"><a className="conference-text-button" href="#resources">Explore delegate resources <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          </div>
        ) : <div className="conference-empty"><CalendarDays size={32} aria-hidden="true" /><h3>Programme to be announced</h3><p>The conference schedule will be shared here once confirmed.</p></div>}
      </div>
    </section>
  );
}
