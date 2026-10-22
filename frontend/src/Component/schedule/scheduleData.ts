import type { ScheduleDay } from './types';

// Conference itinerary supplied by the organising team.
// Timings and venues remain undisclosed.
export const scheduleDays: readonly ScheduleDay[] = [
  {
    id: 'conference-itinerary', label: 'Conference itinerary', subtitle: 'From opening to closing', kind: 'itinerary', isPreview: false,
    events: [
      { id: 'opening-ceremony', title: 'Opening Ceremony', startTime: null, endTime: null, venue: null, category: 'ceremony', description: 'Welcome to the conference and an introduction to the programme ahead.' },
      { id: 'session-1', title: 'Session 1', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Begin committee deliberations and present opening positions on the agenda.' },
      { id: 'lunch', title: 'Lunch', startTime: null, endTime: null, venue: null, category: 'break', description: 'Pause for lunch before returning to committee deliberations.' },
      { id: 'session-2', title: 'Session 2', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Continue debate, exchange perspectives, and develop proposals with fellow delegates.' },
      { id: 'break', title: 'Break', startTime: null, endTime: null, venue: null, category: 'break', description: 'Take a short pause before the final committee session.' },
      { id: 'session-3', title: 'Session 3', startTime: null, endTime: null, venue: null, category: 'committee', description: 'Resume committee deliberations and work towards the final outcomes of the discussion.' },
      { id: 'closing-ceremony', title: 'Closing Ceremony', startTime: null, endTime: null, venue: null, category: 'ceremony', description: 'Come together to reflect on the deliberations and bring the conference to a close.' },
    ],
  },
];
