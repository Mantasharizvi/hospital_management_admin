import PageHeader from '../../components/common/PageHeader';
import { usePharmacy } from '../../context/PharmacyContext';

export default function StockManagementPage() {
  const { inventory } = usePharmacy();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Management"
        description="Current stock health across all medicines."
      />

      <div className="space-y-3">
        {inventory.map((item) => (
          <div key={item.id} className="rounded-lg border border-line p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink-900">{item.name}</p>
                <p className="text-sm text-ink-600">Current stock: {item.stock} {item.unit}</p>
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{item.stock > 50 ? 'Healthy' : 'Reorder'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
