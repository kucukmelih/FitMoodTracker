import { getMoodLabel } from '../constants/moods';
import type { HealthRecord } from '../interfaces/HealthRecord';

interface RecordsTableProps {
  records: HealthRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date: string): string => {
  return new Date(`${date}T00:00:00`).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const RecordsTable = ({ records, onEdit, onDelete }: RecordsTableProps) => {
  if (records.length === 0) {
    return (
      <div className="card border-0 shadow-sm glass-card">
        <div className="card-body p-4 text-center text-muted">
          Kayıt bulunamadı. İlk sağlık kaydını ekleyebilirsin.
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm glass-card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Kilo</th>
                <th>Kalori</th>
                <th>Ruh Hali</th>
                <th>Not</th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.date)}</td>
                  <td>{record.weight.toFixed(1)} kg</td>
                  <td>{record.calories} kcal</td>
                  <td>
                    <span className="badge rounded-pill text-bg-light border">{getMoodLabel(record.mood)}</span>
                  </td>
                  <td className="text-wrap" style={{ maxWidth: 280 }}>
                    {record.note || '-'}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(record.id)}
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(record.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
