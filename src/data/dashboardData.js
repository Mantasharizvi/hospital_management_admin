// Mock data for the Dashboard module.
// Swap these for real API calls (see src/services/api.js) once the backend is ready.

export const statCards = [
  { id: 'patients', label: 'Total Patients', value: '2,481', change: '+4.2%', trend: 'up', icon: 'Users', accent: '#0B5566' },
  { id: 'beds', label: 'Occupied Beds', value: '186 / 240', change: '-1.8%', trend: 'down', icon: 'BedDouble', accent: '#218A5D' },
  { id: 'appointments', label: "Today's Appointments", value: '58', change: '+12.5%', trend: 'up', icon: 'CalendarCheck', accent: '#B87A17' },
  { id: 'revenue', label: 'Pending Bills', value: '₹1,24,300', change: '-6.1%', trend: 'down', icon: 'ReceiptIndianRupee', accent: '#C7423C' },
];

export const revenueSeries = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  opd: [420000, 460000, 441000, 512000, 498000, 534000, 561000],
  ipd: [610000, 590000, 655000, 640000, 702000, 688000, 725000],
  pharmacy: [180000, 195000, 172000, 210000, 205000, 223000, 240000],
};

export const appointmentStatusData = {
  labels: ['Completed', 'Scheduled', 'In Progress', 'Cancelled'],
  values: [32, 16, 6, 4],
  colors: ['#218A5D', '#14899E', '#B87A17', '#C7423C'],
};

export const departmentLoadData = {
  labels: ['General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'ENT'],
  values: [48, 27, 19, 34, 12, 15],
};

export const recentPatients = [
  { id: 1, name: 'Ravi Kumar', doctor: 'Dr. Sen', department: 'Cardiology', ward: 'ICU - 3', date: '2026-07-07', status: 'success' },
  { id: 2, name: 'Meena Shah', doctor: 'Dr. Verma', department: 'General', ward: 'General - 12', date: '2026-07-07', status: 'warning' },
  { id: 3, name: 'Arjun Nair', doctor: 'Dr. Rao', department: 'Orthopedics', ward: 'General - 4', date: '2026-07-06', status: 'success' },
  { id: 4, name: 'Sunita Roy', doctor: 'Dr. Sen', department: 'Cardiology', ward: 'ICU - 1', date: '2026-07-06', status: 'danger' },
  { id: 5, name: 'Aditya Verma', doctor: 'Dr. Iyer', department: 'Neurology', ward: 'General - 7', date: '2026-07-05', status: 'success' },
  { id: 6, name: 'Kavita Joshi', doctor: 'Dr. Rao', department: 'Pediatrics', ward: 'General - 9', date: '2026-07-05', status: 'warning' },
  { id: 7, name: 'Farhan Sheikh', doctor: 'Dr. Verma', department: 'ENT', ward: 'General - 2', date: '2026-07-04', status: 'success' },
];

export const notifications = [
  { id: 1, type: 'warning', title: 'Low stock alert', message: 'Paracetamol 500mg — only 42 units left.', time: '10 min ago' },
  { id: 2, type: 'info', title: 'New appointment', message: 'Dr. Rao booked for 3:30 PM with Kavita Joshi.', time: '32 min ago' },
  { id: 3, type: 'danger', title: 'Bed capacity', message: 'ICU is at 92% occupancy.', time: '1 hr ago' },
  { id: 4, type: 'success', title: 'Discharge completed', title2: '', message: 'Farhan Sheikh discharged from General - 2.', time: '2 hr ago' },
  { id: 5, type: 'info', title: 'Lab report ready', message: 'Blood panel results ready for Sunita Roy.', time: '3 hr ago' },
];

export const quickWidgets = {
  upcomingAppointments: [
    { id: 1, time: '2:00 PM', patient: 'Neha Kapoor', doctor: 'Dr. Sen' },
    { id: 2, time: '2:30 PM', patient: 'Vikram Malhotra', doctor: 'Dr. Verma' },
    { id: 3, time: '3:15 PM', patient: 'Priya Das', doctor: 'Dr. Rao' },
  ],
  expiringMedicines: [
    { id: 1, name: 'Amoxicillin 250mg', batch: 'B-2291', expiry: '2026-08-12' },
    { id: 2, name: 'Insulin Glargine', batch: 'B-1187', expiry: '2026-07-28' },
  ],
};

export const departments = ['All Departments', 'General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'ENT'];
export const dateRanges = ['Today', 'Last 7 days', 'Last 30 days', 'This year'];
