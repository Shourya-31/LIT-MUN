import type { Resource } from './types';

// Preparation content from the supplied MUN Website Content document.
// On-page guidance is readable now; no downloadable files have been supplied.
export const delegateResources: readonly Resource[] = [
  { id: 'background-guides', title: 'Committee Background Guides', description: 'Understand your committee’s mandate, agenda, and procedural framework before beginning substantive research.', category: 'background-guides', available: false, guidance: [
    { heading: 'Start with the committee mandate', text: 'Every committee is a specialised forum with its own mandate, agenda, and procedural framework. Research the scope of your committee and the stakeholders or countries represented in it.' },
    { heading: 'Use official briefing materials', text: 'Committee-specific background guides and briefing materials should form the foundation of preparation. Final committee names, agendas, and portfolio allocations will be published once confirmed.' },
  ] },
  { id: 'rules', title: 'Protocol of Deliberation', description: 'Prepare for orderly debate, fair participation, and the procedural responsibilities of every delegate.', category: 'procedure', available: false, guidance: [
    { heading: 'Understand the framework', text: 'Committee proceedings follow established rules designed to ensure fairness, order, and productive discussion. Familiarise yourself with the applicable procedure before the conference and follow the directions of the presiding officers.' },
    { heading: 'Follow committee-specific procedure', text: 'Procedure may vary according to a committee’s mandate. Official materials will specify the rules governing debate, motions, points, voting, documentation, and consideration of resolutions.' },
    { heading: 'Respect the floor', text: 'Observe the authority of the Chair, respect the speaking order, remain relevant to the agenda, and conduct yourself professionally so every representative has a fair opportunity to be heard.' },
  ] },
  { id: 'position-papers', title: 'Research and Representation', description: 'Build an evidence-based understanding of your assigned country or portfolio and represent its position faithfully.', category: 'position-papers', available: false, guidance: [
    { heading: 'Know your portfolio', text: 'Develop a comprehensive understanding of your assigned country or portfolio, its policy priorities, historical context, and position on the agenda. Defend your position with credible evidence.' },
    { heading: 'Prepare for substantive debate', text: 'Study the committee agenda and relevant background material. Prepare evidence-based arguments, identify possible approaches, and assess competing proposals rather than relying on rhetoric.' },
    { heading: 'Maintain research integrity', text: 'Use credible sources, acknowledge relevant evidence, and avoid knowingly presenting fabricated or misleading information. Represent your assigned portfolio while maintaining academic integrity.' },
  ] },
  { id: 'resolutions', title: 'Drafting and Resolution', description: 'Turn deliberation into coherent, feasible proposals through collaboration, review, and constructive negotiation.', category: 'resolutions', available: false, guidance: [
    { heading: 'Build common ground', text: 'Identify shared interests, address differences, build coalitions, and negotiate mutually acceptable provisions. Uphold your principles while remaining open to common ground.' },
    { heading: 'Draft with purpose', text: 'Translate discussions into coherent proposals and collaboratively develop resolutions that address the agenda. Evaluate whether proposed solutions are feasible, balanced, and actionable.' },
    { heading: 'Review the outcome', text: 'Contribute to drafting, reviewing, and refining proposed resolutions. Consider the clarity, feasibility, and relevance of operative clauses before supporting a final outcome.' },
  ] },
  { id: 'handbook', title: 'The Delegate Journey', description: 'Follow the progression from registration and allocation to research, debate, resolution, and reflection.', category: 'handbook', available: false, guidance: [
    { heading: 'Register and prepare', text: 'Complete registration, review committee options, and await official allocation details. Study your agenda, portfolio, policy positions, and relevant background material.' },
    { heading: 'Deliberate and negotiate', text: 'Introduce your portfolio’s position, participate in formal debate, exchange perspectives, build alliances, and collaborate respectfully on proposals.' },
    { heading: 'Draft and reflect', text: 'Review and refine proposed resolutions, then reflect on the policy questions and collaborative process. The Schedule section presents all six stages of this journey.' },
  ] },
  { id: 'conference-guidelines', title: 'Code of Conduct', description: 'Uphold respect, integrity, inclusivity, and responsible representation throughout the conference.', category: 'conference', available: false, guidance: [
    { heading: 'Respectful engagement', text: 'Address differences through reasoned argument. Personal attacks, discriminatory remarks, intimidation, and disruptive conduct have no place in formal deliberation.' },
    { heading: 'Responsible representation', text: 'Represent your assigned portfolio faithfully, maintain academic integrity, and follow the conference’s procedural framework.' },
    { heading: 'Research integrity', text: 'Use credible sources, acknowledge relevant evidence, and avoid knowingly presenting fabricated or misleading information.' },
    { heading: 'Procedural discipline', text: 'Follow the Chair’s directions, respect speaking time, observe committee rules, and participate in good faith.' },
    { heading: 'Inclusive participation', text: 'Respect every delegate’s right to contribute. Help maintain an environment where diverse perspectives can be expressed without harassment or humiliation.' },
    { heading: 'Professional conduct', text: 'Comply with official conference policies, instructions, and applicable institutional regulations. Violations may be addressed in accordance with published policies and institutional procedures.' },
  ] },
  { id: 'research', title: 'Recognition and Awards', description: 'Understand the principles of thoughtful participation and how confirmed assessment criteria will be communicated.', category: 'additional', available: false, guidance: [
    { heading: 'What diplomacy demonstrates', text: 'Outstanding diplomacy reflects preparation, depth of research, integrity of representation, and the ability to advance constructive outcomes.' },
    { heading: 'How recognition may be assessed', text: 'Where awards are offered, evaluation may consider substantive debate, procedural understanding, negotiation, collaboration, policy consistency, and the quality of resolution drafting.' },
    { heading: 'Await confirmed criteria', text: 'The organising committee will publish award categories, assessment criteria, certificates, prizes, and eligibility conditions only after official confirmation. No specific award or prize is promised here.' },
  ] },
];
