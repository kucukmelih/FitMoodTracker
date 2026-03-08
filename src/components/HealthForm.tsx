import { useEffect, useMemo, useState } from 'react';
import { getMoodLabel, moodOptions } from '../constants/moods';
import type { HealthRecordInput } from '../interfaces/HealthRecord';

interface HealthFormProps {
  initialValues: HealthRecordInput;
  isEditing: boolean;
  onSubmit: (data: HealthRecordInput) => void;
  onCancelEdit: () => void;
}

interface FormErrors {
  date?: string;
  weight?: string;
  calories?: string;
  mood?: string;
  note?: string;
}

interface FormState {
  date: string;
  weight: string;
  calories: string;
  mood: HealthRecordInput['mood'];
  note: string;
}

const toFormState = (values: HealthRecordInput): FormState => ({
  date: values.date,
  weight: values.weight ? String(values.weight) : '',
  calories: values.calories ? String(values.calories) : '',
  mood: values.mood,
  note: values.note,
});

export const HealthForm = ({
  initialValues,
  isEditing,
  onSubmit,
  onCancelEdit,
}: HealthFormProps) => {
  const [form, setForm] = useState<FormState>(() => toFormState(initialValues));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(toFormState(initialValues));
    setErrors({});
  }, [initialValues]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.date) {
      nextErrors.date = 'Tarih zorunludur.';
    }

    const weight = Number(form.weight);
    if (!form.weight || Number.isNaN(weight) || weight <= 0) {
      nextErrors.weight = 'Kilo pozitif bir sayı olmalıdır.';
    }

    const calories = Number(form.calories);
    if (!form.calories || Number.isNaN(calories) || calories < 0) {
      nextErrors.calories = 'Kalori değeri 0 veya daha yüksek olmalıdır.';
    }

    if (!moodOptions.includes(form.mood)) {
      nextErrors.mood = 'Lütfen geçerli bir ruh hali seçin.';
    }

    if (form.note.length > 300) {
      nextErrors.note = 'Not en fazla 300 karakter olabilir.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      date: form.date,
      weight: Number(form.weight),
      calories: Number(form.calories),
      mood: form.mood,
      note: form.note.trim(),
    });
  };

  return (
    <div className="card border-0 shadow-sm glass-card">
      <div className="card-body p-4">
        <h2 className="h4 fw-semibold mb-3">{isEditing ? 'Kaydı Güncelle' : 'Yeni Sağlık Kaydı'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="date">
                Tarih
              </label>
              <input
                id="date"
                type="date"
                max={today}
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="weight">
                Kilo (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                min="1"
                className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                value={form.weight}
                onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
              />
              {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="calories">
                Kalori
              </label>
              <input
                id="calories"
                type="number"
                min="0"
                step="1"
                className={`form-control ${errors.calories ? 'is-invalid' : ''}`}
                value={form.calories}
                onChange={(event) => setForm((prev) => ({ ...prev, calories: event.target.value }))}
              />
              {errors.calories && <div className="invalid-feedback">{errors.calories}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label" htmlFor="mood">
                Ruh Hali
              </label>
              <select
                id="mood"
                className={`form-select ${errors.mood ? 'is-invalid' : ''}`}
                value={form.mood}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, mood: event.target.value as HealthRecordInput['mood'] }))
                }
              >
                {moodOptions.map((mood) => (
                  <option key={mood} value={mood}>
                    {getMoodLabel(mood)}
                  </option>
                ))}
              </select>
              {errors.mood && <div className="invalid-feedback">{errors.mood}</div>}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="note">
                Not (opsiyonel)
              </label>
              <textarea
                id="note"
                rows={3}
                className={`form-control ${errors.note ? 'is-invalid' : ''}`}
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Bugün nasıl hissediyorsun?"
              />
              {errors.note && <div className="invalid-feedback">{errors.note}</div>}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button type="submit" className="btn btn-primary px-4">
              {isEditing ? 'Değişiklikleri Kaydet' : 'Kayıt Ekle'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelEdit}>
                İptal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
