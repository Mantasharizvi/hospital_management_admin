import PageHeader from '../../components/common/PageHeader';
import { useIpd } from '../../context/IpdContext';

export default function WardManagementPage() {
  const { wards } = useIpd();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Management"
        description="Live bed occupancy across all wards."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {wards.map((ward) => (
          <div key={ward.name} className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-ink-900">{ward.name}</h4>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{ward.status}</span>
            </div>
            <p className="mt-3 text-sm text-ink-600">Beds: {ward.occupied}/{ward.beds} occupied</p>
            <div className="mt-3 h-2 rounded-full bg-surface">
              <div className="h-2 rounded-full bg-teal-600" style={{ width: `${(ward.occupied / ward.beds) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
