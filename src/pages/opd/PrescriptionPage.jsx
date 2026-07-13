import PageHeader from '../../components/common/PageHeader';
import { useOpd } from '../../context/OpdContext';

export default function PrescriptionPage() {
  const { prescriptions } = useOpd();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescription"
        description="Medicines prescribed during the current consultation."
      />

      <div className="space-y-3">
        {prescriptions.map((item) => (
          <div key={item.medicine} className="rounded-lg border border-line p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink-900">{item.medicine}</p>
                <p className="text-sm text-ink-600">Dosage: {item.dosage}</p>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{item.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
