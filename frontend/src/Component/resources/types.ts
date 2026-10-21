export const resourceCategories = [
  { id: 'background-guides', label: 'Committee Background Guides', shortLabel: 'Background guides' },
  { id: 'procedure', label: 'Protocol of Deliberation', shortLabel: 'Procedure' },
  { id: 'position-papers', label: 'Research and Representation', shortLabel: 'Portfolio preparation' },
  { id: 'resolutions', label: 'Drafting and Resolution', shortLabel: 'Resolution drafting' },
  { id: 'handbook', label: 'The Delegate Journey', shortLabel: 'Delegate journey' },
  { id: 'conference', label: 'Code of Conduct', shortLabel: 'Conduct' },
  { id: 'additional', label: 'Recognition and Awards', shortLabel: 'Recognition' },
] as const;

export type ResourceCategory = typeof resourceCategories[number]['id'];

interface ResourceDetails {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileType?: string;
  guidance?: readonly { heading: string; text: string }[];
}

// An available resource must have a real file URL. Unpublished resources cannot have one.
export type Resource = ResourceDetails & (
  | { available: true; fileUrl: string; downloadName?: string }
  | { available: false; fileUrl?: never; downloadName?: never }
);

export interface ResourcesProps {
  resources?: readonly Resource[];
}
