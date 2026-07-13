import { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';
import { validateForm, rules, isValid } from '../utils/validators';
import { printInvoice } from '../utils/printInvoice';

const OpdContext = createContext(null);

const initialPatients = [
  { id: 'OPD-101', name: 'Aarav Sharma', age: 34, doctor: 'Dr. Nair', status: 'Consulted', visit: '09:30 AM' },
  { id: 'OPD-102', name: 'Meera Joseph', age: 28, doctor: 'Dr. Rao', status: 'Waiting', visit: '10:15 AM' },
  { id: 'OPD-103', name: 'Rahul Menon', age: 47, doctor: 'Dr. Shah', status: 'Pending Lab', visit: '11:00 AM' },
];

const initialAppointments = [
  {
    id: 'APT-201', patient: 'Sana Begum', doctor: 'Dr. Nair', department: 'Cardiology',
    date: '07 Jul 2026', time: '09:00 AM', status: 'Confirmed', payment: 'Paid', type: 'Offline',
  },
  {
    id: 'APT-202', patient: 'Kiran Das', doctor: 'Dr. Rao', department: 'ENT',
    date: '08 Jul 2026', time: '10:30 AM', status: 'Pending', payment: 'Unpaid', type: 'Online',
  },
  {
    id: 'APT-203', patient: 'Jaya Pillai', doctor: 'Dr. Shah', department: 'Orthopedic',
    date: '08 Jul 2026', time: '12:00 PM', status: 'Completed', payment: 'Paid', type: 'Offline',
  },
];

const initialPrescriptions = [
  { medicine: 'Paracetamol 500mg', dosage: '1-0-1', duration: '3 days' },
  { medicine: 'Vitamin D3', dosage: '1-0-0', duration: '30 days' },
  { medicine: 'Amoxicillin', dosage: '1-1-1', duration: '5 days' },
];

const initialHistory = [
  'Previous migraine episodes over 6 months',
  'Blood pressure monitored at 128/82',
  'No known allergies to penicillin',
  'Recommended follow-up in 2 weeks',
];

const emptyPatient = { name: '', mobile: '', age: '', gender: '', department: '', doctor: '', complaint: '' };
const patientSchema = {
  name: [rules.required('Patient name is required')],
  mobile: [rules.required('Mobile number is required'), rules.phone()],
  age: [rules.required('Age is required'), rules.numeric(), rules.positive()],
};

const emptyAppointment = { patient: '', doctor: '', department: '', date: '', time: '', reason: '', type: 'offline', status: 'pending' };
const appointmentSchema = {
  patient: [rules.required('Please select a patient')],
  doctor: [rules.required('Please select a doctor')],
  date: [rules.required('Date is required')],
  time: [rules.required('Time slot is required')],
};

const emptyConsultation = {
  patientid: '', notes: '', reviewDate: '', medicine: '', consultationFee: '', labCharges: '', medicineCharges: '',
};

export const appointmentColumns = [
  { key: 'id', header: 'Appointment ID' },
  { key: 'patient', header: 'Patient Name' },
  { key: 'doctor', header: 'Doctor' },
  { key: 'department', header: 'Department' },
  { key: 'date', header: 'Date' },
  { key: 'time', header: 'Time Slot' },
  { key: 'status', header: 'Status' },
  { key: 'payment', header: 'Payment Status' },
];

export function OpdProvider({ children }) {
  const toast = useToast();

  const [patients, setPatients] = useState(initialPatients);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [patientErrors, setPatientErrors] = useState({});

  const [appointments, setAppointments] = useState(initialAppointments);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [appointmentErrors, setAppointmentErrors] = useState({});
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const [viewAppointment, setViewAppointment] = useState(null);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const [prescriptions] = useState(initialPrescriptions);
  const [history] = useState(initialHistory);
  const [consultation, setConsultation] = useState(emptyConsultation);

  // ---------- Patient registration ----------
  const handleOpenPatientModal = () => {
    setPatientForm(emptyPatient);
    setPatientErrors({});
    setShowPatientModal(true);
  };

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    const errors = validateForm(patientForm, patientSchema);
    setPatientErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    const newPatient = {
      id: `OPD-${100 + patients.length + 1}`,
      name: patientForm.name,
      age: patientForm.age,
      doctor: patientForm.doctor || 'Unassigned',
      status: 'Waiting',
      visit: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setPatients((current) => [...current, newPatient]);
    setShowPatientModal(false);
    toast.success(`Patient "${newPatient.name}" registered successfully`);
  };

  // ---------- Appointment management ----------
  const handleOpenNewAppointment = () => {
    setEditingAppointmentId(null);
    setAppointmentForm(emptyAppointment);
    setAppointmentErrors({});
    setIsAppointmentModalOpen(true);
  };

  const handleOpenEditAppointment = (row) => {
    setEditingAppointmentId(row.id);
    setAppointmentForm({
      patient: row.patient, doctor: row.doctor, department: row.department,
      date: row.date, time: row.time, reason: row.reason || '',
      type: row.type?.toLowerCase() || 'offline', status: row.status?.toLowerCase() || 'pending',
    });
    setAppointmentErrors({});
    setIsAppointmentModalOpen(true);
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    const errors = validateForm(appointmentForm, appointmentSchema);
    setAppointmentErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const statusLabel = appointmentForm.status === 'confirmed' ? 'Confirmed' : 'Pending';
    const typeLabel = appointmentForm.type === 'online' ? 'Online' : 'Offline';

    if (editingAppointmentId) {
      setAppointments((current) =>
        current.map((a) =>
          a.id === editingAppointmentId
            ? { ...a, ...appointmentForm, status: statusLabel, type: typeLabel }
            : a
        )
      );
      toast.success('Appointment updated successfully');
    } else {
      const newAppointment = {
        id: `APT-${200 + appointments.length + 1}`,
        ...appointmentForm,
        status: statusLabel,
        type: typeLabel,
        payment: 'Unpaid',
      };
      setAppointments((current) => [...current, newAppointment]);
      toast.success('Appointment created successfully');
    }
    setIsAppointmentModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setAppointments((current) => current.filter((a) => a.id !== deleteAppointmentId));
    toast.success('Appointment deleted');
    setDeleteAppointmentId(null);
  };

  // ---------- Billing ----------
  const handleGenerateInvoice = () => {
    printInvoice({
      title: 'OPD Invoice',
      invoiceNo: `INV-OPD-${Date.now().toString().slice(-6)}`,
      patientName: patients[0]?.name || 'Walk-in Patient',
      lineItems: [
        { label: 'Consultation Fee', amount: Number(consultation.consultationFee) || 500 },
        { label: 'Lab Charges', amount: Number(consultation.labCharges) || 300 },
        { label: 'Medicine Charges', amount: Number(consultation.medicineCharges) || 420 },
      ],
      total:
        (Number(consultation.consultationFee) || 500) +
        (Number(consultation.labCharges) || 300) +
        (Number(consultation.medicineCharges) || 420),
    });
    toast.success('Invoice sent to printer');
  };

  const value = {
    patients, setPatients,
    showPatientModal, setShowPatientModal,
    patientForm, setPatientForm,
    patientErrors,
    handleOpenPatientModal, handleRegisterPatient,

    appointments,
    isAppointmentModalOpen, setIsAppointmentModalOpen,
    appointmentForm, setAppointmentForm,
    appointmentErrors, editingAppointmentId,
    viewAppointment, setViewAppointment,
    deleteAppointmentId, setDeleteAppointmentId,
    showExportModal, setShowExportModal,
    handleOpenNewAppointment, handleOpenEditAppointment,
    handleSaveAppointment, handleConfirmDelete,

    prescriptions,
    history,
    consultation, setConsultation,

    handleGenerateInvoice,
  };

  return <OpdContext.Provider value={value}>{children}</OpdContext.Provider>;
}

export function useOpd() {
  const ctx = useContext(OpdContext);
  if (!ctx) throw new Error('useOpd must be used within OpdProvider');
  return ctx;
}
