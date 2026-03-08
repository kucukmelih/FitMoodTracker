import { useMemo } from 'react';
import { getMoodLabel } from '../constants/moods';
import type { HealthRecord, MoodOption } from '../interfaces/HealthRecord';

interface SummaryCardsProps {
  records: HealthRecord[];
}

const getMostCommonMood = (records: HealthRecord[]): MoodOption | null => {
  if (records.length === 0) {
    return null;
  }

  const counts = records.reduce<Record<MoodOption, number>>((acc, record) => {
    acc[record.mood] = (acc[record.mood] ?? 0) + 1;
    return acc;
  }, {} as Record<MoodOption, number>);

  const [mood] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return mood as MoodOption;
};

export const SummaryCards = ({ records }: SummaryCardsProps) => {
  const latestWeight = useMemo(() => {
    if (records.length === 0) {
      return '-';
    }

    const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
    return `${latest.weight.toFixed(1)} kg`;
  }, [records]);

  const averageCalories = useMemo(() => {
    if (records.length === 0) {
      return '-';
    }

    const totalCalories = records.reduce((sum, record) => sum + record.calories, 0);
    return Math.round(totalCalories / records.length).toString();
  }, [records]);

  const mostCommonMood = useMemo(() => getMostCommonMood(records), [records]);

  const cards = [
    { title: 'Son Kilo', value: latestWeight },
    { title: 'Ortalama Kalori', value: averageCalories === '-' ? '-' : `${averageCalories} kcal` },
    { title: 'Toplam Kayıt', value: records.length.toString() },
    { title: 'En Sık Ruh Hali', value: mostCommonMood ? getMoodLabel(mostCommonMood) : '-' },
  ];

  return (
    <div className="row g-3">
      {cards.map((card) => (
        <div className="col-6 col-lg-3" key={card.title}>
          <div className="card border-0 shadow-sm summary-card h-100">
            <div className="card-body">
              <p className="small text-uppercase fw-semibold mb-2 summary-title">{card.title}</p>
              <h3 className="h5 fw-bold mb-0">{card.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
