import { useId, useState } from 'react';
import { ArrowUpRight, Search, SearchX, X } from 'lucide-react';
import SectionHeading from '../conference/SectionHeading';
import ScrollReveal from '../animations/ScrollReveal';
import ResourceCard from './ResourceCard';
import { delegateResources } from './resourceData';
import { resourceCategories } from './types';
import { getResourceFileUrl } from './resourceUtils';
import type { ResourceCategory, ResourcesProps } from './types';
import './Resources.css';

export default function Resources({ resources = delegateResources }: ResourcesProps) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ResourceCategory | 'all'>('all');
  const search = query.trim().toLocaleLowerCase();
  const filtered = resources.filter((resource) => {
    const label = resourceCategories.find((item) => item.id === resource.category)?.label ?? '';
    return (category === 'all' || resource.category === category) && `${resource.title} ${resource.description} ${label}`.toLocaleLowerCase().includes(search);
  });
  const availableCount = resources.filter((resource) => getResourceFileUrl(resource) !== null).length;

  function resetFilters() { setQuery(''); setCategory('all'); }

  return (
    <section id="resources" className="conference-section resources-section" aria-labelledby={`${uid}-heading`}>
      <div className="conference-container">
        <ScrollReveal className="conference-reveal">
          <SectionHeading id={`${uid}-heading`} number="02" eyebrow="The delegate library"
            title={<><span className="conference-sr-only">Delegate Resources: </span>Arrive informed.<br /><em>Debate with purpose.</em></>}
            description="Your preparation starts here. Find committee guides, writing resources, and the essentials for your time at LIT-MUN." />
        </ScrollReveal>
        <div className="resources-toolbar">
          <div className="resource-search">
            <Search size={18} aria-hidden="true" />
            <label className="conference-sr-only" htmlFor={`${uid}-search`}>Search delegate resources</label>
            <input id={`${uid}-search`} type="search" placeholder="Search the delegate library…" value={query} onChange={(event) => setQuery(event.target.value)} />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear resource search"><X size={17} aria-hidden="true" /></button>}
          </div>
          <p className="resource-publication-note">{availableCount ? `${availableCount} ${availableCount === 1 ? 'resource' : 'resources'} available` : 'Official documents will be published here.'}</p>
        </div>
        <div className="resource-filters" role="group" aria-label="Filter resources by category">
          <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All resources <span>{resources.length}</span></button>
          {resourceCategories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.shortLabel}</button>)}
        </div>
        <p className="resource-results" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{search ? ` matching “${query.trim()}”` : category !== 'all' ? ` in ${resourceCategories.find((item) => item.id === category)?.shortLabel}` : ' in the library'}</p>
        {filtered.length ? <div className="resource-grid">{filtered.map((resource, index) => <ResourceCard key={resource.id} resource={resource} index={index} />)}</div> : (
          <div className="conference-empty"><SearchX size={34} strokeWidth={1.5} aria-hidden="true" /><h3>{resources.length ? 'No resources found' : 'The library is being prepared'}</h3><p>{resources.length ? 'Try a different search term or explore another category.' : 'Delegate resources will appear here when they are published.'}</p>{(query || category !== 'all') && <button className="conference-text-button" type="button" onClick={resetFilters}>Reset search & filters <ArrowUpRight size={16} aria-hidden="true" /></button>}</div>
        )}
        <div className="resources-bottom-note"><span aria-hidden="true">i</span><p>Preparing for your first conference? The delegate handbook and rules of procedure are a good place to start once published.</p></div>
      </div>
    </section>
  );
}
