import { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';
import { validateForm, rules, isValid } from '../utils/validators';
import { printInvoice } from '../utils/printInvoice';

const IpdContext = createContext(null);

const initialAdmissions = [
  { id: 'IPD-401', patient: 'Ananya Roy', ward: 'ICU', bed: 'ICU-02', status: 'Admitted' },
  { id: 'IPD-402', patient: 'Nikhil Rao', ward: 'Ward A', bed: 'A-14', status: 'Monitoring' },
  { id: 'IPD-403', patient: 'Priya Kumar', ward: 'Ward B', bed: 'B-09', status: 'Recovery' },
];

const initialWards = [
  { name: 'ICU', beds: 12, occupied: 10, status: 'Critical Care' },
  { name: 'Ward A', beds: 24, occupied: 17, status: 'General Care' },
  { name: 'Ward B', beds: 18, occupied: 14, status: 'Maternity' },
];

const initialTreatmentRecords = [
  {
    id: 'TRT-501', patientId: 'IPD-401', name: 'IV Antibiotics Started', dateTime: '2026-07-07T09:30',
    doctor: 'Dr. Mehta', details: 'Administered IV ceftriaxone 1g for suspected infection.',
    medicinesGiven: 'Yes', vitals: 'BP 118/76, Pulse 82, Temp 99.1°F, SpO2 97%',
    notes: 'Patient tolerated infusion well, no adverse reaction observed.',
    followUp: 'Repeat vitals in 6 hours, continue antibiotic course.', status: 'Ongoing',
  },
  {
    id: 'TRT-502', patientId: 'IPD-402', name: 'Vitals Reassessed', dateTime: '2026-07-06T20:00',
    doctor: 'Dr. Sinha', details: 'Routine vitals check and neurological assessment.',
    medicinesGiven: 'No', vitals: 'BP 122/80, Pulse 76, Temp 98.6°F, SpO2 98%',
    notes: 'Patient stable, alert and oriented.',
    followUp: 'Continue monitoring, next check in 8 hours.', status: 'Completed',
  },
];

export const treatmentColumns = [
  { key: 'patientId', header: 'Patient ID' },
  { key: 'name', header: 'Treatment' },
  {
    key: 'dateTime',
    header: 'Date & Time',
    render: (row) => {
      if (!row.dateTime) return '';
      const date = new Date(row.dateTime);
      return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    },
  },
  { key: 'doctor', header: 'Doctor' },
  { key: 'details', header: 'Procedure Details' },
  { key: 'medicinesGiven', header: 'Medicines Given' },
  { key: 'vitals', header: 'Vitals (BP / Pulse / Temp / SpO2)' },
  { key: 'notes', header: 'Doctor / Nurse Notes' },
  { key: 'followUp', header: 'Follow-up Plan' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
        {row.status}
      </span>
    ),
  },
];

const emptyAdmission = {
  name: '', admissionDate: '', ward: '', doctor: '', bedNumber: '', roomCharges: '', contact: '', insurance: '', reason: '',
};

const emptyTreatment = {
  patientId: '', name: '', dateTime: '', doctor: '', details: '', medicinesGiven: 'No', vitals: '', notes: '', followUp: '', status: 'Ongoing', medicineSuppliesCost: '', procedureFee: '',
};

const emptyDischarge = {
  admissionId: '', dischargeDate: '', condition: 'Stable', summaryNotes: 'Patient stable, oral intake adequate, vitals normalized and follow-up appointment scheduled.',
};

const admissionSchema = {
  name: [rules.required('Patient name is required')],
  admissionDate: [rules.required('Admission date is required')],
  ward: [rules.required('Ward preference is required')],
  bedNumber: [rules.required('Bed allocation number is required')],
  contact: [rules.required('Emergency contact is required'), rules.phone()],
};

const treatmentSchema = {
  patientId: [rules.required('Patient ID is required')],
  name: [rules.required('Treatment/Procedure name is required')],
  dateTime: [rules.required('Date and time is required')],
  doctor: [rules.required('Attending doctor is required')],
};

const dischargeSchema = {
  admissionId: [rules.required('Please select a patient to discharge')],
  dischargeDate: [rules.required('Discharge date is required')],
};

export function IpdProvider({ children }) {
  const toast = useToast();

  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [treatmentRecords, setTreatmentRecords] = useState(initialTreatmentRecords);
  const [wards, setWards] = useState(initialWards);

  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);

  const [admissionForm, setAdmissionForm] = useState(emptyAdmission);
  const [treatmentForm, setTreatmentForm] = useState(emptyTreatment);
  const [dischargeForm, setDischargeForm] = useState(emptyDischarge);

  const [admissionErrors, setAdmissionErrors] = useState({});
  const [treatmentErrors, setTreatmentErrors] = useState({});
  const [dischargeErrors, setDischargeErrors] = useState({});

  const handleOpenAdmissionModal = () => {
    setAdmissionForm(emptyAdmission);
    setAdmissionErrors({});
    setShowAdmissionModal(true);
  };

  const handleAdmitPatient = (e) => {
    e.preventDefault();
    const errors = validateForm(admissionForm, admissionSchema);
    setAdmissionErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const newAdmission = {
      id: `IPD-${400 + admissions.length + 1}`,
      patient: admissionForm.name,
      ward: admissionForm.ward,
      bed: admissionForm.bedNumber,
      status: 'Admitted',
    };

    setAdmissions((current) => [...current, newAdmission]);
    setWards((currentWards) =>
      currentWards.map((w) =>
        w.name === admissionForm.ward ? { ...w, occupied: Math.min(w.beds, w.occupied + 1) } : w
      )
    );

    setShowAdmissionModal(false);
    toast.success(`${newAdmission.patient} admitted successfully`);
  };

  const handleOpenTreatmentModal = () => {
    setTreatmentForm(emptyTreatment);
    setTreatmentErrors({});
    setShowTreatmentModal(true);
  };

  const handleAddTreatmentRecord = (e) => {
    e.preventDefault();
    const errors = validateForm(treatmentForm, treatmentSchema);
    setTreatmentErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted form errors');
      return;
    }
    const newTreatment = {
      id: `TRT-${500 + treatmentRecords.length + 1}`,
      ...treatmentForm,
    };
    setTreatmentRecords((current) => [...current, newTreatment]);
    setShowTreatmentModal(false);
    toast.success('Treatment record logs updated successfully');
  };

  const handleOpenDischargeModal = () => {
    setDischargeForm(emptyDischarge);
    setDischargeErrors({});
    setShowDischargeModal(true);
  };

  const handleFinalizeDischarge = (e) => {
    e.preventDefault();
    const errors = validateForm(dischargeForm, dischargeSchema);
    setDischargeErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please select a valid admission profile');
      return;
    }

    const targetAdmission = admissions.find((a) => a.id === dischargeForm.admissionId);
    if (!targetAdmission) return;

    setAdmissions((current) =>
      current.map((a) => (a.id === dischargeForm.admissionId ? { ...a, status: 'Discharged' } : a))
    );

    setWards((currentWards) =>
      currentWards.map((w) =>
        w.name === targetAdmission.ward ? { ...w, occupied: Math.max(0, w.occupied - 1) } : w
      )
    );

    setShowDischargeModal(false);
    toast.success(`Discharge Summary finalized for ${targetAdmission.patient}`);
  };

  const handleGenerateIpdBill = () => {
    printInvoice({
      title: 'IPD Invoice',
      invoiceNo: `INV-IPD-${Date.now().toString().slice(-6)}`,
      patientName: admissions.find((a) => a.status === 'Admitted')?.patient || 'Inpatient',
      lineItems: [
        { label: 'Room Charges', amount: 4800 },
        { label: 'Medicine & Supplies', amount: 2150 },
        { label: 'Procedure Fee', amount: 1250 },
      ],
      total: 8200,
    });
    toast.success('Invoice sent to printer');
  };

  const value = {
    admissions, wards, treatmentRecords,
    showAdmissionModal, setShowAdmissionModal,
    showTreatmentModal, setShowTreatmentModal,
    showDischargeModal, setShowDischargeModal,
    admissionForm, setAdmissionForm, admissionErrors,
    treatmentForm, setTreatmentForm, treatmentErrors,
    dischargeForm, setDischargeForm, dischargeErrors,
    handleOpenAdmissionModal, handleAdmitPatient,
    handleOpenTreatmentModal, handleAddTreatmentRecord,
    handleOpenDischargeModal, handleFinalizeDischarge,
    handleGenerateIpdBill,
  };

  return <IpdContext.Provider value={value}>{children}</IpdContext.Provider>;
}

export function useIpd() {
  const ctx = useContext(IpdContext);
  if (!ctx) throw new Error('useIpd must be used within IpdProvider');
  return ctx;
}
