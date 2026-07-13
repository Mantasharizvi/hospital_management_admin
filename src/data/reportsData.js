// Mock data for the Reports & Analytics module.
// Swap these for real API calls (see src/services/api.js) once the backend is ready.

export const reportStatCards = [
  { id: 'revenue', label: 'Total Revenue', value: '₹8,73,200', change: '+5.2%', trend: 'up', icon: 'IndianRupee', accent: '#0B5566' },
  { id: 'opd', label: 'OPD Patients', value: '567', change: '+8.1%', trend: 'up', icon: 'Activity', accent: '#14899E' },
  { id: 'ipd', label: 'IPD Occupancy', value: '72%', change: '-1.4%', trend: 'down', icon: 'BedDouble', accent: '#B87A17' },
  { id: 'pharmacy', label: 'Pharmacy Items Sold', value: '1,317', change: '+12.3%', trend: 'up', icon: 'Pill', accent: '#218A5D' },
];

// Weekly revenue trend split by department — feeds the Revenue Trend line chart.
export const revenueTrend = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  opd: [58400, 62800, 59600, 68950],
  ipd: [95200, 108800, 101600, 118200],
  pharmacy: [31800, 41200, 37400, 41800],
};

// Revenue split by source — feeds the Service Distribution doughnut chart.
export const serviceDistribution = {
  labels: ['OPD Consultations', 'IPD Services', 'Pharmacy Sales', 'Lab Tests'],
  values: [218500, 482300, 176200, 95800],
  colors: ['#14899E', '#0B5566', '#B87A17', '#218A5D'],
};

export const dateRanges = ['Today', 'Last 7 days', 'Last 30 days', 'This Quarter', 'This Year'];

export const opdReportsData = [
  { id: 'OPD-001', date: '07 Jul 2026', patients: 145, consultations: 142, revenue: 52400, avgWaitTime: '18 min' },
  { id: 'OPD-002', date: '06 Jul 2026', patients: 128, consultations: 125, revenue: 48900, avgWaitTime: '22 min' },
  { id: 'OPD-003', date: '05 Jul 2026', patients: 156, consultations: 152, revenue: 58200, avgWaitTime: '16 min' },
  { id: 'OPD-004', date: '04 Jul 2026', patients: 138, consultations: 135, revenue: 51800, avgWaitTime: '20 min' },
];

export const ipdReportsData = [
  { id: 'IPD-001', date: '07 Jul 2026', admissions: 18, discharges: 12, occupancy: '72%', revenue: 124500 },
  { id: 'IPD-002', date: '06 Jul 2026', admissions: 16, discharges: 10, occupancy: '70%', revenue: 119200 },
  { id: 'IPD-003', date: '05 Jul 2026', admissions: 22, discharges: 15, occupancy: '75%', revenue: 135800 },
  { id: 'IPD-004', date: '04 Jul 2026', admissions: 20, discharges: 14, occupancy: '73%', revenue: 128900 },
];

export const pharmacyReportsData = [
  { id: 'PHR-001', date: '07 Jul 2026', itemsSold: 342, revenue: 45600, topMedicine: 'Paracetamol 500mg', stock: 120 },
  { id: 'PHR-002', date: '06 Jul 2026', itemsSold: 298, revenue: 39800, topMedicine: 'Amoxicillin 250mg', stock: 48 },
  { id: 'PHR-003', date: '05 Jul 2026', itemsSold: 365, revenue: 48900, topMedicine: 'Vitamin D3', stock: 80 },
  { id: 'PHR-004', date: '04 Jul 2026', itemsSold: 312, revenue: 41700, topMedicine: 'Aspirin 100mg', stock: 95 },
];

export const revenueReportsData = [
  { id: 'REV-001', source: 'OPD Consultations', amount: 218500, percentage: '32%', trend: 'up' },
  { id: 'REV-002', source: 'IPD Services', amount: 482300, percentage: '45%', trend: 'up' },
  { id: 'REV-003', source: 'Pharmacy Sales', amount: 176200, percentage: '16%', trend: 'down' },
  { id: 'REV-004', source: 'Lab Tests', amount: 95800, percentage: '7%', trend: 'up' },
];

// Column definitions reused by both the on-screen Table and the PDF/Excel/CSV export,
// so what the user sees is always exactly what gets exported.
export const reportColumns = {
  opd: [
    { key: 'id', header: 'Report ID' },
    { key: 'date', header: 'Date' },
    { key: 'patients', header: 'Patients' },
    { key: 'consultations', header: 'Consultations' },
    { key: 'avgWaitTime', header: 'Avg Wait Time' },
    { key: 'revenue', header: 'Revenue', formatCurrency: true },
  ],
  ipd: [
    { key: 'id', header: 'Report ID' },
    { key: 'date', header: 'Date' },
    { key: 'admissions', header: 'Admissions' },
    { key: 'discharges', header: 'Discharges' },
    { key: 'occupancy', header: 'Occupancy' },
    { key: 'revenue', header: 'Revenue', formatCurrency: true },
  ],
  pharmacy: [
    { key: 'id', header: 'Report ID' },
    { key: 'date', header: 'Date' },
    { key: 'itemsSold', header: 'Items Sold' },
    { key: 'revenue', header: 'Revenue', formatCurrency: true },
    { key: 'topMedicine', header: 'Top Medicine' },
    { key: 'stock', header: 'Current Stock' },
  ],
  revenue: [
    { key: 'id', header: 'ID' },
    { key: 'source', header: 'Revenue Source' },
    { key: 'amount', header: 'Amount', formatCurrency: true },
    { key: 'percentage', header: 'Percentage' },
    { key: 'trend', header: 'Trend' },
  ],
};

export const reportDataByTab = {
  opd: opdReportsData,
  ipd: ipdReportsData,
  pharmacy: pharmacyReportsData,
  revenue: revenueReportsData,
};

export const reportTitleByTab = {
  opd: 'OPD Report',
  ipd: 'IPD Report',
  pharmacy: 'Pharmacy Report',
  revenue: 'Revenue Report',
};
