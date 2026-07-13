import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import { usePharmacy } from '../../context/PharmacyContext';

export default function SalesBillingPage() {
  const { sales } = usePharmacy();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Billing"
        description="Medicine sales billed to patients."
      />

      <Table
        columns={[
          { key: 'id', header: 'Sales ID' },
          { key: 'patient', header: 'Patient' },
          { key: 'medicine', header: 'Medicine' },
          { key: 'qty', header: 'Qty' },
          { key: 'amount', header: 'Amount' },
        ]}
        data={sales}
      />
    </div>
  );
}
