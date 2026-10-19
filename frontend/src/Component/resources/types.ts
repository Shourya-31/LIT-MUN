export const resourceCategories = [
  { id: 'background-guides', label: 'Committee Background Guides', shortLabel: 'Background guides' },
  { id: 'procedure', label: 'Rules of Procedure', shortLabel: 'Rules of procedure' },
  { id: 'position-papers', label: 'Position Paper Guidelines', shortLabel: 'Position papers' },
  { id: 'resolutions', label: 'Resolution Writing Guides', shortLabel: 'Resolutions' },
  { id: 'handbook', label: 'Delegate Handbook', shortLabel: 'Delegate handbook' },
  { id: 'conference', label: 'Conference Guidelines', shortLabel: 'Conference guidelines' },
  { id: 'additional', label: 'Additional Resources', shortLabel: 'Additional resources' },
] as const;

export type ResourceCategory = typeof resourceCategories[number]['id'];

interface ResourceDetails {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  fileType?: string;
}

// An available resource must have a real file URL. Unpublished resources cannot have one.
export type Resource = ResourceDetails & (
  | { available: true; fileUrl: string; downloadName?: string }
  | { available: false; fileUrl?: never; downloadName?: never }
);

export interface ResourcesProps {
  resources?: readonly Resource[];
}
