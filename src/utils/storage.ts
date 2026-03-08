import { moodOptions, type HealthRecord } from '../interfaces/HealthRecord';

const STORAGE_KEY = 'fitmood_records_v1';

const isMood = (value: string): value is HealthRecord['mood'] => {
  return moodOptions.includes(value as HealthRecord['mood']);
};

const isHealthRecord = (value: unknown): value is HealthRecord => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as HealthRecord;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.weight === 'number' &&
    Number.isFinite(candidate.weight) &&
    typeof candidate.calories === 'number' &&
    Number.isFinite(candidate.calories) &&
    typeof candidate.mood === 'string' &&
    isMood(candidate.mood) &&
    typeof candidate.note === 'string'
  );
};

export const loadRecords = (): HealthRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHealthRecord);
  } catch {
    return [];
  }
};

export const saveRecords = (records: HealthRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export { STORAGE_KEY };
