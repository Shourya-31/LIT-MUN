import { useId } from 'react';
import { ArrowUpRight, FileText, UsersRound } from 'lucide-react';
import SectionHeading from '../conference/SectionHeading';
import ScrollReveal from '../animations/ScrollReveal';
import './Secretariat.css';

const offices = [
  { id: 'director-general', title: 'Director General' },
  { id: 'secretary-general', title: 'Secretary General' },
  { id: 'eb-affairs', title: 'Head of EB Affairs' },
  { id: 'oc-affairs', title: 'Head of OC Affairs' },
  { id: 'delegate-affairs', title: 'Head of Delegate Affairs' },
];

export default function Secretariat({ resourcesHref }: { resourcesHref?: string }) {
  const uid = useId();

  return (
    <section id="secretariat" className="conference-section secretariat-section" aria-labelledby={`${uid}-heading`}>
      <div className="conference-container">
        <ScrollReveal className={`conference-reveal${resourcesHref ? ' secretariat-heading' : ''}`}>
          <SectionHeading id={`${uid}-heading`} number="03" eyebrow="The people behind the conference"
            title={<>The <em>Secretariat</em></>}
            description="Letters from the conference leadership, and the organising committee and teams bringing the conference together." />
          {resourcesHref && <a className="conference-text-button secretariat-resources-link" href={resourcesHref}>Explore Resources <ArrowUpRight size={16} aria-hidden="true" /></a>}
        </ScrollReveal>

        <div className="secretariat-letters">
          {offices.map((office, index) => (
            <article key={office.id} id={`secretariat-${office.id}`} className="secretariat-letter" aria-labelledby={`${uid}-${office.id}`}>
              <div className="secretariat-letter-top" aria-hidden="true">
                <FileText size={24} strokeWidth={1.3} />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p className="secretariat-letter-label">Letter from</p>
              <h3 id={`${uid}-${office.id}`}>{office.title}</h3>
              <p className="secretariat-coming-soon"><span aria-hidden="true" />Coming soon</p>
            </article>
          ))}
        </div>

        <article id="secretariat-team" className="secretariat-team" aria-labelledby={`${uid}-team-heading`}>
          <div className="secretariat-team-icon" aria-hidden="true"><UsersRound size={30} strokeWidth={1.3} /></div>
          <div className="secretariat-team-copy">
            <p className="secretariat-letter-label">The organising team</p>
            <h3 id={`${uid}-team-heading`}>Organising Committee &amp; Team</h3>
            <p>The full list of OC members and teams will be announced here.</p>
          </div>
          <p className="secretariat-coming-soon"><span aria-hidden="true" />Coming soon</p>
        </article>
      </div>
    </section>
  );
}
