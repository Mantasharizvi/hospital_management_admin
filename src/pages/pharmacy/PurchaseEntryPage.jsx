import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import { usePharmacy } from '../../context/PharmacyContext';

export default function PurchaseEntryPage() {
  const { purchaseEntries } = usePharmacy();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Entry"
        description="Recent medicine purchase entries from suppliers."
      />

      <Table
        columns={[
          { key: 'id', header: 'Purchase ID' },
          { key: 'supplier', header: 'Supplier' },
          { key: 'medicine', header: 'Medicine' },
          { key: 'qty', header: 'Qty' },
          { key: 'cost', header: 'Cost' },
        ]}
        data={purchaseEntries}
      />
    </div>
  );
}
