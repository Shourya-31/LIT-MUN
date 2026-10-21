import { useId } from 'react';
import { ArrowUpRight, BookOpen, BookText, ChevronDown, Download, FilePenLine, FileText, Gavel, LibraryBig, ScrollText } from 'lucide-react';
import { resourceCategories } from './types';
import type { Resource, ResourceCategory } from './types';
import { getResourceFileUrl } from './resourceUtils';

const icons = { 'background-guides': BookOpen, procedure: Gavel, 'position-papers': FilePenLine, resolutions: ScrollText, handbook: BookText, conference: FileText, additional: LibraryBig } satisfies Record<ResourceCategory, typeof BookOpen>;

export default function ResourceCard({ resource, index, expanded, onToggle }: { resource: Resource; index: number; expanded: boolean; onToggle: () => void }) {
  const uid = useId();
  const Icon = icons[resource.category];
  const category = resourceCategories.find((item) => item.id === resource.category);
  const fileUrl = getResourceFileUrl(resource);
  const downloadable = fileUrl && !/^https?:\/\//i.test(fileUrl);

  return (
    <article id={`resource-${resource.id}`} className={`resource-card ${fileUrl ? 'resource-card--available' : ''}`}>
      <div className="resource-card-top"><span className="resource-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><span className="resource-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
      <p className="resource-category">{category?.shortLabel}</p>
      <h3 id={`${uid}-title`}>{resource.title}</h3>
      <p className="resource-description">{resource.description}</p>
      <div className="resource-card-footer">
        {resource.guidance?.length ? <button type="button" className="resource-read" aria-expanded={expanded} aria-controls={`${uid}-guidance`} onClick={onToggle}>{expanded ? 'Close guidance' : 'Read guidance'}<ChevronDown size={16} aria-hidden="true" /></button> : null}
        {fileUrl ? <>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="resource-view" aria-label={`View ${resource.title} (opens in a new tab)`}>View {resource.fileType || 'resource'}<ArrowUpRight size={16} aria-hidden="true" /></a>
          {downloadable && <a className="resource-download" href={fileUrl} download={resource.downloadName || true} aria-label={`Download ${resource.title}`}><Download size={17} aria-hidden="true" /></a>}
          {resource.fileType && <span className="resource-filetype">{resource.fileType}</span>}
        </> : resource.guidance?.length ? <span className="resource-unpublished">On-page guide</span> : <><span className="resource-coming-soon"><span aria-hidden="true" />Coming soon</span><span className="resource-unpublished">Not yet published</span></>}
      </div>
      {resource.guidance?.length ? <div id={`${uid}-guidance`} className="resource-guidance" role="region" aria-labelledby={`${uid}-title`} hidden={!expanded}>
        {resource.guidance.map((section) => <div key={section.heading}><h4>{section.heading}</h4><p>{section.text}</p></div>)}
        {!fileUrl && <p className="resource-guidance-file-note">Downloadable conference materials will be added when published.</p>}
      </div> : null}
    </article>
  );
}
