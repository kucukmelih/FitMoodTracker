import { useEffect, useMemo, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { HealthForm } from '../components/HealthForm';
import { RecordsTable } from '../components/RecordsTable';
import { SummaryCards } from '../components/SummaryCards';
import type { HealthRecord, HealthRecordInput, RecordFilters } from '../interfaces/HealthRecord';
import { loadRecords, saveRecords } from '../utils/storage';

const defaultFormValues: HealthRecordInput = {
  date: new Date().toISOString().slice(0, 10),
  weight: 0,
  calories: 0,
  mood: 'Happy',
  note: '',
};

const defaultFilters: RecordFilters = {
  mood: 'All',
  fromDate: '',
  toDate: '',
};

const makeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const DashboardPage = () => {
  const [records, setRecords] = useState<HealthRecord[]>(() => loadRecords());
  const [filters, setFilters] = useState<RecordFilters>(defaultFilters);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const editingRecord = useMemo(
    () => records.find((record) => record.id === editingId) ?? null,
    [records, editingId],
  );

  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => {
        const matchesMood = filters.mood === 'All' ? true : record.mood === filters.mood;
        const matchesFromDate = filters.fromDate ? record.date >= filters.fromDate : true;
        const matchesToDate = filters.toDate ? record.date <= filters.toDate : true;

        return matchesMood && matchesFromDate && matchesToDate;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records, filters]);

  const handleSubmit = (input: HealthRecordInput) => {
    if (editingRecord) {
      setRecords((prev) =>
        prev.map((record) => (record.id === editingRecord.id ? { ...record, ...input } : record)),
      );
      setEditingId(null);
      return;
    }

    const newRecord: HealthRecord = {
      id: makeId(),
      ...input,
    };

    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Bu kayıt silinsin mi? Bu işlem geri alınamaz.');
    if (!confirmed) {
      return;
    }

    setRecords((prev) => prev.filter((record) => record.id !== id));

    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const formValues = editingRecord
    ? {
        date: editingRecord.date,
        weight: editingRecord.weight,
        calories: editingRecord.calories,
        mood: editingRecord.mood,
        note: editingRecord.note,
      }
    : defaultFormValues;

  return (
    <main className="app-shell py-4 py-md-5">
      <div className="container">
        <section className="hero-card mb-4 mb-md-5">
          <p className="text-uppercase small fw-semibold mb-2 hero-kicker">Kişisel Sağlık Takibi</p>
          <h1 className="display-6 fw-bold mb-2">FitMood Tracker</h1>
          <p className="mb-0 text-secondary-emphasis">
            Kilo, kalori ve ruh halini günlük takip et. Tüm veriler tarayıcında localStorage ile saklanır.
          </p>
        </section>

        <section className="mb-4">
          <SummaryCards records={records} />
        </section>

        <section className="mb-4">
          <HealthForm
            initialValues={formValues}
            isEditing={Boolean(editingRecord)}
            onSubmit={handleSubmit}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        <section className="mb-4">
          <FilterBar filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
        </section>

        <section>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="h5 mb-0">Kayıtlar</h2>
            <span className="text-muted small">
              {records.length} kayıttan {filteredRecords.length} tanesi gösteriliyor
            </span>
          </div>

          <RecordsTable records={filteredRecords} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      </div>
    </main>
  );
};
