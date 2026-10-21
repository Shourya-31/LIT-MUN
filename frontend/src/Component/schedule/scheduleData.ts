import type { ScheduleDay } from './types';

// Delegate Journey in the supplied MUN Website Content document.
// These are participation stages, not confirmed dates or a daily itinerary.
export const scheduleDays: readonly ScheduleDay[] = [
  {
    id: 'delegate-journey', label: 'Delegate journey', subtitle: 'From registration to reflection', kind: 'journey', isPreview: true,
    events: [
      { id: 'registration-allocation', step: 1, title: 'Registration and Allocation', startTime: null, endTime: null, venue: null, category: 'preparation', description: 'Complete registration and review the available committee options. Your assigned committee, portfolio, and participation details will be communicated through official conference channels.' },
      { id: 'research-preparation', step: 2, title: 'Research and Preparation', startTime: null, endTime: null, venue: null, category: 'preparation', description: 'Study your committee agenda, assigned portfolio, applicable policy positions, and relevant background material. Prepare evidence-based arguments and identify potential approaches to the issue under consideration.' },
      { id: 'opening-deliberations', step: 3, title: 'Opening Deliberations', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Introduce your portfolio’s position, establish the principal concerns of your representation, and engage with the initial discussion of the agenda in accordance with committee procedure.' },
      { id: 'debate-negotiation', step: 4, title: 'Debate and Negotiation', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Participate in formal debate, exchange perspectives, develop alliances, and work collaboratively on proposals. Defend your assigned position while engaging respectfully with other delegates.' },
      { id: 'drafting-resolution', step: 5, title: 'Drafting and Resolution', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Contribute to drafting, reviewing, and refining proposed resolutions. Evaluate the clarity, feasibility, and relevance of operative clauses before supporting a final outcome.' },
      { id: 'recognition-reflection', step: 6, title: 'Recognition and Reflection', startTime: null, endTime: null, venue: null, category: 'ceremony', description: 'Reflect on the deliberations, the policy questions explored, and the collaborative process. Any awards or distinctions will be governed by the conference’s published criteria; categories and eligibility will be shared only after official confirmation.' },
    ],
  },
];
