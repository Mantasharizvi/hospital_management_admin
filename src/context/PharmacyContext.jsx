import { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';
import { validateForm, rules, isValid } from '../utils/validators';

const PharmacyContext = createContext(null);

const initialInventory = [
  { id: 'MED-101', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 120, unit: 'Boxes', expiry: '2026-10-10' },
  { id: 'MED-102', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 48, unit: 'Boxes', expiry: '2026-08-15' },
  { id: 'MED-103', name: 'Vitamin D3', category: 'Supplement', stock: 80, unit: 'Strip', expiry: '2027-01-22' },
];

const initialPurchaseEntries = [
  { id: 'PUR-201', supplier: 'MediSupply Co.', medicine: 'Paracetamol', qty: 100, cost: '₹12,500' },
  { id: 'PUR-202', supplier: 'LifeCare Pharma', medicine: 'Amoxicillin', qty: 60, cost: '₹18,000' },
];

const initialSales = [
  { id: 'SAL-301', patient: 'Rahul Menon', medicine: 'Vitamin D3', qty: 10, amount: '₹1,200' },
  { id: 'SAL-302', patient: 'Meera Joseph', medicine: 'Paracetamol', qty: 5, amount: '₹650' },
];

const initialAlerts = [
  { medicine: 'Amoxicillin 250mg', expiry: '2026-08-15', status: 'Expiring soon' },
  { medicine: 'Insulin 100IU', expiry: '2026-07-18', status: 'Critical' },
];

export const inventoryColumns = [
  { key: 'id', header: 'Medicine ID' },
  { key: 'name', header: 'Medicine' },
  { key: 'category', header: 'Category' },
  { key: 'stock', header: 'Stock' },
  { key: 'unit', header: 'Unit' },
  { key: 'expiry', header: 'Expiry' },
];

const emptyMedicine = {
  name: '', category: '', batch: '', expiry: '', purchasePrice: '', sellingPrice: '', stock: '', supplier: '',
};
const medicineSchema = {
  name: [rules.required('Medicine name is required')],
  category: [rules.required('Category is required')],
  expiry: [rules.required('Expiry date is required')],
  stock: [rules.required('Initial stock is required'), rules.numeric(), rules.positive()],
};

export function PharmacyProvider({ children }) {
  const toast = useToast();
  const [inventory, setInventory] = useState(initialInventory);
  const [purchaseEntries] = useState(initialPurchaseEntries);
  const [sales] = useState(initialSales);
  const [alerts] = useState(initialAlerts);

  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [medicineForm, setMedicineForm] = useState(emptyMedicine);
  const [medicineErrors, setMedicineErrors] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);

  const handleOpenMedicineModal = () => {
    setMedicineForm(emptyMedicine);
    setMedicineErrors({});
    setShowMedicineModal(true);
  };

  const handleSaveMedicine = (e) => {
    e.preventDefault();
    const errors = validateForm(medicineForm, medicineSchema);
    setMedicineErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    const newMedicine = {
      id: `MED-${100 + inventory.length + 1}`,
      name: medicineForm.name,
      category: medicineForm.category,
      stock: Number(medicineForm.stock),
      unit: 'Boxes',
      expiry: medicineForm.expiry,
    };
    setInventory((current) => [...current, newMedicine]);
    setShowMedicineModal(false);
    toast.success(`"${newMedicine.name}" added to inventory`);
  };

  const value = {
    inventory, purchaseEntries, sales, alerts,
    showMedicineModal, setShowMedicineModal,
    medicineForm, setMedicineForm, medicineErrors,
    showReportModal, setShowReportModal,
    handleOpenMedicineModal, handleSaveMedicine,
  };

  return <PharmacyContext.Provider value={value}>{children}</PharmacyContext.Provider>;
}

export function usePharmacy() {
  const ctx = useContext(PharmacyContext);
  if (!ctx) throw new Error('usePharmacy must be used within PharmacyProvider');
  return ctx;
}
