import { ArrowUpRight, BookOpen, BookText, Download, FilePenLine, FileText, Gavel, LibraryBig, ScrollText } from 'lucide-react';
import { resourceCategories } from './types';
import type { Resource, ResourceCategory } from './types';
import { getResourceFileUrl } from './resourceUtils';

const icons = { 'background-guides': BookOpen, procedure: Gavel, 'position-papers': FilePenLine, resolutions: ScrollText, handbook: BookText, conference: FileText, additional: LibraryBig } satisfies Record<ResourceCategory, typeof BookOpen>;

export default function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const Icon = icons[resource.category];
  const category = resourceCategories.find((item) => item.id === resource.category);
  const fileUrl = getResourceFileUrl(resource);
  const downloadable = fileUrl && !/^https?:\/\//i.test(fileUrl);

  return (
    <article className={`resource-card ${fileUrl ? 'resource-card--available' : ''}`}>
      <div className="resource-card-top"><span className="resource-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><span className="resource-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
      <p className="resource-category">{category?.shortLabel}</p>
      <h3>{resource.title}</h3>
      <p className="resource-description">{resource.description}</p>
      <div className="resource-card-footer">
        {fileUrl ? <>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="resource-view" aria-label={`View ${resource.title} (opens in a new tab)`}>View {resource.fileType || 'resource'}<ArrowUpRight size={16} aria-hidden="true" /></a>
          {downloadable && <a className="resource-download" href={fileUrl} download={resource.downloadName || true} aria-label={`Download ${resource.title}`}><Download size={17} aria-hidden="true" /></a>}
          {resource.fileType && <span className="resource-filetype">{resource.fileType}</span>}
        </> : <><span className="resource-coming-soon"><span aria-hidden="true" />Coming soon</span><span className="resource-unpublished">Not yet published</span></>}
      </div>
    </article>
  );
}
