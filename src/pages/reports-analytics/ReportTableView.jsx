import { useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import ExportReportModal from '../../components/reports/ExportReportModal';
import { reportColumns, reportDataByTab, reportTitleByTab } from '../../data/reportsData';

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function ReportTableView({ tab, description }) {
  const [showExportModal, setShowExportModal] = useState(false);

  const columns = reportColumns[tab];
  const rows = reportDataByTab[tab];
  const title = reportTitleByTab[tab];

  const tableColumns = useMemo(
    () =>
      columns.map((col) =>
        col.formatCurrency ? { ...col, render: (row) => INR.format(row[col.key]) } : col
      ),
    [columns]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          <>
            <Button size="sm" variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
            <Button size="sm" icon={Download} onClick={() => setShowExportModal(true)}>Export Report</Button>
          </>
        }
      />

      <Table columns={tableColumns} data={rows} />

      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={title}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
