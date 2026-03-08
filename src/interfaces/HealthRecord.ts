export const moodOptions = [
  'Happy',
  'Calm',
  'Motivated',
  'Tired',
  'Stressed',
  'Sad',
] as const;

export type MoodOption = (typeof moodOptions)[number];

export interface HealthRecord {
  id: string;
  date: string;
  weight: number;
  calories: number;
  mood: MoodOption;
  note: string;
}

export interface HealthRecordInput {
  date: string;
  weight: number;
  calories: number;
  mood: MoodOption;
  note: string;
}

export interface RecordFilters {
  mood: MoodOption | 'All';
  fromDate: string;
  toDate: string;
}
