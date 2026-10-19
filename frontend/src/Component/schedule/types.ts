export type ScheduleCategory = 'ceremony' | 'committee' | 'break';

export interface ScheduleEvent {
  id: string;
  title: string;
  /** Display times in the conference's local timezone. Null means unconfirmed. */
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  description: string;
  category: ScheduleCategory;
}

export interface ScheduleDay {
  id: string;
  label: string;
  subtitle: string;
  /** Keep true until the programme has been approved by the organizers. */
  isPreview: boolean;
  events: readonly ScheduleEvent[];
}

export interface ScheduleProps {
  days?: readonly ScheduleDay[];
}
