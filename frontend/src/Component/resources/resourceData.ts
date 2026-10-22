import type { Resource } from './types';
import { committeesData } from '../committees/committeesData';
import codeOfConductPdf from '../../assets/resources/NITRRMUN-Code-of-Conduct.pdf?url';

// Preparation content from the supplied MUN Website Content document.
// The Code of Conduct PDF contains the same guidance shown on the page.
// Committee materials remain unpublished.
export const delegateResources: readonly Resource[] = [
  { id: 'background-guides', title: 'Committee Background Guides', description: 'Understand your committee’s mandate, agenda, and procedural framework before beginning substantive research.', category: 'background-guides', available: false, guidance: [
    { heading: 'Start with the committee mandate', text: 'Every committee is a specialised forum with its own mandate, agenda, and procedural framework. Research the scope of your committee and the stakeholders or countries represented in it.' },
    { heading: 'Use official briefing materials', text: 'Committee-specific background guides and briefing materials should form the foundation of preparation. Final committee names, agendas, and portfolio allocations will be published once confirmed.' },
  ] },
  { id: 'rules', title: 'Rules of Procedure', description: 'Committee-specific rules for debate, motions, points, and voting will be published here once available.', category: 'procedure', available: false,
    committeeRules: committeesData.map(({ code, name }) => ({ code, name })),
  },
  { id: 'conference-guidelines', title: 'Code of Conduct', description: 'Uphold respect, integrity, inclusivity, and responsible representation throughout the conference.', category: 'conference', available: true, fileUrl: codeOfConductPdf, fileType: 'PDF', downloadName: 'NITRRMUN-Code-of-Conduct.pdf', guidance: [
    { heading: 'Respectful engagement', text: 'Address differences through reasoned argument. Personal attacks, discriminatory remarks, intimidation, and disruptive conduct have no place in formal deliberation.' },
    { heading: 'Responsible representation', text: 'Represent your assigned portfolio faithfully, maintain academic integrity, and follow the conference’s procedural framework.' },
    { heading: 'Research integrity', text: 'Use credible sources, acknowledge relevant evidence, and avoid knowingly presenting fabricated or misleading information.' },
    { heading: 'Procedural discipline', text: 'Follow the Chair’s directions, respect speaking time, observe committee rules, and participate in good faith.' },
    { heading: 'Inclusive participation', text: 'Respect every delegate’s right to contribute. Help maintain an environment where diverse perspectives can be expressed without harassment or humiliation.' },
    { heading: 'Professional conduct', text: 'Comply with official conference policies, instructions, and applicable institutional regulations. Violations may be addressed in accordance with published policies and institutional procedures.' },
  ] },
  { id: 'research', title: 'Awards and Recognition', description: 'Understand the principles of thoughtful participation and how confirmed assessment criteria will be communicated.', category: 'additional', available: false, guidance: [
    { heading: 'What diplomacy demonstrates', text: 'Outstanding diplomacy reflects preparation, depth of research, integrity of representation, and the ability to advance constructive outcomes.' },
    { heading: 'How recognition may be assessed', text: 'Where awards are offered, evaluation may consider substantive debate, procedural understanding, negotiation, collaboration, policy consistency, and the quality of resolution drafting.' },
    { heading: 'Await confirmed criteria', text: 'The organising committee will publish award categories, assessment criteria, certificates, prizes, and eligibility conditions only after official confirmation. No specific award or prize is promised here.' },
  ] },
];
