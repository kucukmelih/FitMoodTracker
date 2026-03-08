import { getMoodLabel, moodOptions } from '../constants/moods';
import type { RecordFilters } from '../interfaces/HealthRecord';

interface FilterBarProps {
  filters: RecordFilters;
  onChange: (next: RecordFilters) => void;
  onReset: () => void;
}

export const FilterBar = ({ filters, onChange, onReset }: FilterBarProps) => {
  return (
    <div className="card border-0 shadow-sm glass-card">
      <div className="card-body p-3 p-md-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label" htmlFor="filterMood">
              Ruh Hali
            </label>
            <select
              id="filterMood"
              className="form-select"
              value={filters.mood}
              onChange={(event) =>
                onChange({
                  ...filters,
                  mood: event.target.value as RecordFilters['mood'],
                })
              }
            >
              <option value="All">Tüm ruh halleri</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {getMoodLabel(mood)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="fromDate">
              Başlangıç
            </label>
            <input
              id="fromDate"
              type="date"
              className="form-control"
              value={filters.fromDate}
              onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="toDate">
              Bitiş
            </label>
            <input
              id="toDate"
              type="date"
              className="form-control"
              value={filters.toDate}
              onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
            />
          </div>

          <div className="col-md-2 d-grid">
            <button type="button" className="btn btn-outline-dark" onClick={onReset}>
              Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
