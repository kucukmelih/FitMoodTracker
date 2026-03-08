import { moodOptions } from '../interfaces/HealthRecord';

const moodLabels: Record<(typeof moodOptions)[number], string> = {
  Happy: 'Mutlu',
  Calm: 'Sakin',
  Motivated: 'Motivasyonlu',
  Tired: 'Yorgun',
  Stressed: 'Stresli',
  Sad: 'Üzgün',
};

const getMoodLabel = (mood: (typeof moodOptions)[number]): string => {
  return moodLabels[mood];
};

export { moodOptions, moodLabels, getMoodLabel };
