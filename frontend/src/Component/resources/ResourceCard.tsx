import { useId, useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, FileText, Gavel, LibraryBig } from 'lucide-react';
import { resourceCategories } from './types';
import type { Resource, ResourceCategory } from './types';
import { getResourceFileUrl } from './resourceUtils';

const icons = { 'background-guides': BookOpen, procedure: Gavel, conference: FileText, additional: LibraryBig } satisfies Record<ResourceCategory, typeof BookOpen>;

export default function ResourceCard({ resource, index, expanded, onToggle }: { resource: Resource; index: number; expanded: boolean; onToggle: () => void }) {
  const uid = useId();
  const Icon = icons[resource.category];
  const category = resourceCategories.find((item) => item.id === resource.category);
  const fileUrl = getResourceFileUrl(resource);
  const [selectedCommitteeCode, setSelectedCommitteeCode] = useState('');
  const selectedCommittee = resource.committeeRules?.find((committee) => committee.code === selectedCommitteeCode);

  return (
    <article id={`resource-${resource.id}`} className={`resource-card ${fileUrl ? 'resource-card--available' : ''}`}>
      <div className="resource-card-top"><span className="resource-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><span className="resource-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
      <p className="resource-category">{category?.shortLabel}</p>
      <h3 id={`${uid}-title`}>{resource.title}</h3>
      <p className="resource-description">{resource.description}</p>
      {resource.committeeRules?.length ? <div className="resource-committee-rules">
        <div className="resource-committee-tabs" role="group" aria-label={`${resource.title} by committee`}>
          {resource.committeeRules.map((committee) => <button key={committee.code} type="button"
            id={`${uid}-committee-${committee.code}`} aria-expanded={selectedCommittee?.code === committee.code}
            aria-controls={`${uid}-committee-panel`}
            onClick={() => setSelectedCommitteeCode((previous) => previous === committee.code ? '' : committee.code)}>
            {committee.code}
          </button>)}
        </div>
        <div id={`${uid}-committee-panel`} className="resource-committee-panel" role="region" hidden={!selectedCommittee}
          aria-labelledby={selectedCommittee ? `${uid}-committee-${selectedCommittee.code}` : `${uid}-title`}>
          <h4>{selectedCommittee?.name}</h4>
          <p className="resource-coming-soon"><span aria-hidden="true" />Coming soon</p>
        </div>
      </div> : null}
      {(!resource.committeeRules?.length || fileUrl || resource.guidance?.length) ? <div className="resource-card-footer">
        {resource.guidance?.length ? <button type="button" className="resource-read" aria-expanded={expanded} aria-controls={`${uid}-guidance`} onClick={onToggle}>{expanded ? 'Close guidance' : 'Read guidance'}<ChevronDown size={14} aria-hidden="true" /></button> : null}
        {fileUrl ? <>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="resource-view" aria-label={`View ${resource.title} (opens in a new tab)`} title={`View ${resource.fileType || 'resource'} in a new tab`}><ExternalLink size={16} aria-hidden="true" /></a>
          {resource.fileType && <span className="resource-filetype">{resource.fileType}</span>}
        </> : resource.guidance?.length ? <span className="resource-unpublished">On-page guide</span> : <><span className="resource-coming-soon"><span aria-hidden="true" />Coming soon</span><span className="resource-unpublished">Not yet published</span></>}
      </div> : null}
      {resource.guidance?.length ? <div id={`${uid}-guidance`} className="resource-guidance" role="region" aria-labelledby={`${uid}-title`} hidden={!expanded}>
        {resource.guidance.map((section) => <div key={section.heading}><h4>{section.heading}</h4><p>{section.text}</p></div>)}
      </div> : null}
    </article>
  );
}
