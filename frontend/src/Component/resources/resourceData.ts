import type { Resource } from './types';

// No official files have been supplied. Add verified URLs before setting available to true.
export const delegateResources: readonly Resource[] = [
  { id: 'background-guides', title: 'Committee Background Guides', description: 'Explore committee agendas, the context behind each issue, and starting points for your research.', category: 'background-guides', available: false },
  { id: 'rules', title: 'Rules of Procedure', description: 'Your reference for formal debate, points, motions, caucuses, and the flow of committee.', category: 'procedure', available: false },
  { id: 'position-papers', title: 'Position Paper Guidelines', description: 'Understand the expected structure, research approach, and submission requirements.', category: 'position-papers', available: false },
  { id: 'resolutions', title: 'Resolution Writing Guide', description: 'An introduction to working papers, resolution clauses, amendments, and collaborative drafting.', category: 'resolutions', available: false },
  { id: 'handbook', title: 'Delegate Handbook', description: 'A place for essential delegate information, preparation notes, and conference-day guidance.', category: 'handbook', available: false },
  { id: 'conference-guidelines', title: 'Conference Guidelines', description: 'Find the conference expectations, delegate conduct guidance, and practical arrangements.', category: 'conference', available: false },
  { id: 'research', title: 'Research & Further Reading', description: 'Additional reading and research references to help you explore your committee agenda.', category: 'additional', available: false },
];
