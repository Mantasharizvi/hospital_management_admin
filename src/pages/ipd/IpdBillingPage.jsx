import { Receipt } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useIpd } from '../../context/IpdContext';

export default function IpdBillingPage() {
  const { handleGenerateIpdBill } = useIpd();

  return (
    <div className="space-y-6">
      <PageHeader
        title="IPD Billing"
        description="Generate the consolidated inpatient bill."
      />

      <div className="rounded-lg border border-line bg-surface p-4 space-y-3 max-w-md">
        <div className="flex items-center justify-between text-sm text-ink-700">
          <span>Room Charges</span>
          <span>₹4,800</span>
        </div>
        <div className="flex items-center justify-between text-sm text-ink-700">
          <span>Medicine & Supplies</span>
          <span>₹2,150</span>
        </div>
        <div className="flex items-center justify-between text-sm text-ink-700">
          <span>Procedure Fee</span>
          <span>₹1,250</span>
        </div>
        <div className="border-t border-line pt-3 flex items-center justify-between font-semibold text-ink-900">
          <span>Total</span>
          <span>₹8,200</span>
        </div>
        <Button icon={Receipt} fullWidth onClick={handleGenerateIpdBill}>Generate IPD Bill</Button>
      </div>
    </div>
  );
}
