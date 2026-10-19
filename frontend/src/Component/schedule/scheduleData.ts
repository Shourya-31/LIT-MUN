import type { ScheduleDay } from './types';

// Illustrative programme only. Replace with an approved schedule before marking isPreview false.
export const scheduleDays: readonly ScheduleDay[] = [
  {
    id: 'day-1', label: 'Day 1', subtitle: 'Dialogue begins', isPreview: true,
    events: [
      { id: 'opening', title: 'Opening Ceremony', startTime: null, endTime: null, venue: null, category: 'ceremony', description: 'A proposed welcome to the conference, its committees, and the conversations ahead.' },
      { id: 'committee-1', title: 'Committee Session I', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Set the agenda, present opening statements, and begin formal deliberations.' },
      { id: 'lunch-1', title: 'Lunch & Conversations', startTime: null, endTime: null, venue: null, category: 'break', description: 'A proposed pause to recharge and connect with fellow delegates.' },
      { id: 'committee-2', title: 'Committee Session II', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Explore perspectives through debate, negotiation, and collaborative discussion.' },
    ],
  },
  {
    id: 'day-2', label: 'Day 2', subtitle: 'Ideas into action', isPreview: true,
    events: [
      { id: 'committee-3', title: 'Committee Session III', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Continue deliberations and bring emerging ideas into working papers.' },
      { id: 'lunch-2', title: 'Lunch & Conversations', startTime: null, endTime: null, venue: null, category: 'break', description: 'Take a break before the proposed final round of committee discussions.' },
      { id: 'committee-4', title: 'Committee Session IV', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Refine draft resolutions and work toward a shared committee outcome.' },
      { id: 'closing', title: 'Closing Ceremony', startTime: null, endTime: null, venue: null, category: 'ceremony', description: 'A proposed gathering to reflect on the dialogue and bring the conference to a close.' },
    ],
  },
];
