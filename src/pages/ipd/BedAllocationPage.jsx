import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import { useIpd } from '../../context/IpdContext';

export default function BedAllocationPage() {
  const { admissions } = useIpd();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bed Allocation"
        description="Current bed allocation for every admitted inpatient."
      />

      <Table
        columns={[
          { key: 'id', header: 'Admission ID' },
          { key: 'patient', header: 'Patient' },
          { key: 'ward', header: 'Ward' },
          { key: 'bed', header: 'Bed No.' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Admitted' || row.status === 'Monitoring' || row.status === 'Recovery' ? 'bg-teal-50 text-teal-700' : 'bg-ink-100 text-ink-700'}`}>
                {row.status}
              </span>
            ),
          },
        ]}
        data={admissions}
      />
    </div>
  );
}
