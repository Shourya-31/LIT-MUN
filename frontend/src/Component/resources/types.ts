export const resourceCategories = [
  { id: 'background-guides', label: 'Committee Background Guides', shortLabel: 'Background guides' },
  { id: 'procedure', label: 'Rules of Procedure', shortLabel: 'Rules of procedure' },
  { id: 'conference', label: 'Code of Conduct', shortLabel: 'Conduct' },
  { id: 'additional', label: 'Awards and Recognition', shortLabel: 'Awards & recognition' },
] as const;

export type ResourceCategory = typeof resourceCategories[number]['id'];

interface ResourceDetails {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileType?: string;
  guidance?: readonly { heading: string; text: string }[];
  committeeRules?: readonly { code: string; name: string }[];
}

// An available resource must have a real file URL. Unpublished resources cannot have one.
export type Resource = ResourceDetails & (
  | { available: true; fileUrl: string; downloadName?: string }
  | { available: false; fileUrl?: never; downloadName?: never }
);

export interface ResourcesProps {
  resources?: readonly Resource[];
}
