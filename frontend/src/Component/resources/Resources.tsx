import { useId, useState } from 'react';
import SectionHeading from '../conference/SectionHeading';
import ScrollReveal from '../animations/ScrollReveal';
import ResourceCard from './ResourceCard';
import { delegateResources } from './resourceData';
import type { ResourcesProps } from './types';
import './Resources.css';

export default function Resources({ resources = delegateResources }: ResourcesProps) {
  const uid = useId();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  return (
    <section id="resources" className="conference-section resources-section" aria-labelledby={`${uid}-heading`}>
      <div className="conference-container">
        <ScrollReveal className="conference-reveal">
          <SectionHeading id={`${uid}-heading`} number="01" eyebrow="The delegate library"
            title={<>Delegate <em>Resources</em></>}
            description="Prepare to represent your portfolio with credible research, procedural understanding, and diplomatic courtesy. Read the guidance below before joining the deliberations." />
        </ScrollReveal>
        {resources.length ? <div className="resource-grid">{resources.map((resource, index) => <ResourceCard key={resource.id} resource={resource} index={index} expanded={Boolean(expandedIds[resource.id])} onToggle={() => setExpandedIds((previous) => ({ ...previous, [resource.id]: !previous[resource.id] }))} />)}</div> : (
          <div className="conference-empty"><h3>Resources coming soon</h3><p>Conference materials will appear here when available.</p></div>
        )}
      </div>
    </section>
  );
}
