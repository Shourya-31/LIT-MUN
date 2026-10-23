import React, { useEffect, useState } from 'react';
import { api, type Announcement } from '../../lib/api';
import './AnnouncementsPage.css';

function formatAnnouncementDate(value: string | null): string {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

function renderAnnouncementContent(content: string): React.ReactNode {
  return content.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
    <p className="announcement-paragraph" key={`paragraph-${paragraphIndex}`}>
      {paragraph.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`line-${paragraphIndex}-${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {line || '\u00A0'}
        </React.Fragment>
      ))}
    </p>
  ));
}

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void api.announcements.list()
      .then((items) => {
        if (!active) return;
        setAnnouncements(items);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load announcements');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleHashFocus = () => {
      const scheduledId = window.location.hash.replace(/^#/, '');
      if (!scheduledId) return;

      const timer = window.setTimeout(() => {
        const target = document.getElementById(scheduledId);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('announcement-targeted');
        window.setTimeout(() => target.classList.remove('announcement-targeted'), 1200);
      }, 150);

      return () => window.clearTimeout(timer);
    };

    const cleanup = handleHashFocus();
    window.addEventListener('hashchange', handleHashFocus);
    return () => {
      cleanup?.();
      window.removeEventListener('hashchange', handleHashFocus);
    };
  }, [announcements]);

  return (
    <main className="announcements-page-shell">
      <section className="announcements-page" aria-labelledby="announcements-page-title">
        <header className="announcements-page-header">
          <p className="announcements-kicker">Official notices</p>
          <h1 id="announcements-page-title">Announcements</h1>
          <p className="announcements-intro">
            Updates from the NITRRMUN Secretariat and conference organizing team.
          </p>
        </header>

        {isLoading && (
          <div className="announcements-state" role="status">Loading announcements…</div>
        )}

        {!isLoading && error && (
          <div className="announcements-state announcements-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && announcements.length === 0 && (
          <div className="announcements-state announcements-empty">
            No official announcements have been published yet.
          </div>
        )}

        {!isLoading && !error && announcements.length > 0 && (
          <div className="announcement-feed" aria-live="polite">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                id={announcement.id}
                className="announcement-card"
                aria-labelledby={`${announcement.id}-heading`}
              >
                <div className="announcement-meta">
                  <span>{formatAnnouncementDate(announcement.publishedAt ?? announcement.createdAt)}</span>
                </div>
                <h2 id={`${announcement.id}-heading`}>{announcement.heading}</h2>
                {announcement.subheading && <p className="announcement-subheading">{announcement.subheading}</p>}
                <div className="announcement-content">{renderAnnouncementContent(announcement.content)}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AnnouncementsPage;
