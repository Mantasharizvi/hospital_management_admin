import { Receipt } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { useOpd } from '../../context/OpdContext';
import { printInvoice } from '../../utils/printInvoice'; // Agar printInvoice useOpd mein nahi hai toh yahan se import hoga

export default function BillingInvoicePage() {
  // Context se consultation, setConsultation aur patients list ko nikala
  const { consultation, setConsultation, patients } = useOpd();

  // Total ab sirf consultationFee ke upar hi based hai
  const total = (Number(consultation.consultationFee) || 500); 

  // Patients ki list ko dropdown options [{ value, label }] ke format mein convert karna
  const patientOptions = (patients || []).map(p => ({
    value: p.id,
    label: `${p.id} - ${p.name}`
  }));

  // Selected Patient ka Name nikalne ke liye helper function
  const getSelectedPatientName = () => {
    const foundPatient = (patients || []).find(p => p.id === consultation.patientid);
    return foundPatient ? foundPatient.name : 'Walk-in Patient';
  };

  // PDF Generate aur Print karne ka dynamic function
  const handlePrintPDFInvoice = () => {
    printInvoice({
      title: 'OPD Invoice',
      invoiceNo: `INV-OPD-${Date.now().toString().slice(-6)}`,
      patientId: consultation.patientid, // Sahi Patient ID pass ki
      patientName: getSelectedPatientName(), // Sahi Patient Name pass kiya
      lineItems: [
        { label: 'Consultation Fee', amount: total }, // Sirf Consultation Fee add kiya
      ],
      total: total, // Total sirf consultation fee par based hai
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing and Invoice"
        description="Generate the OPD invoice for the current consultation."
      />

      <div className="rounded-lg border border-line bg-surface p-4 space-y-3 max-w-md">
        
        {/* Patient ID Dropdown */}
        <div className="mb-4">
          <Select
            label="Invoice For Patient"
            value={consultation.patientid}
            onChange={(e) => setConsultation({ ...consultation, patientid: e.target.value })}
            options={patientOptions}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-ink-700">
          <span>Consultation Fee</span>
          <span>₹{total}</span>
        </div>

        <div className="border-t border-line pt-3 flex items-center justify-between font-semibold text-ink-900">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        
        {/* Updated click handler to print dynamic and filtered invoice */}
        <Button icon={Receipt} fullWidth onClick={handlePrintPDFInvoice}>
          Generate Invoice
        </Button>
      </div>
    </div>
  );
}