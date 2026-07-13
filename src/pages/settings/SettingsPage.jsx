import { useState } from 'react';
import {
  User,
  Building2,
  Users,
  Bell,
  ShieldCheck,
  Camera,
  Plus,
  X,
  Smartphone,
  Monitor,
  LogOut,
  KeyRound,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Toggle from '../../components/common/Toggle';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'hospital', label: 'Hospital info', icon: Building2 },
  { key: 'users', label: 'Users & roles', icon: Users },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: ShieldCheck },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
      <nav className="bg-white rounded-xl border border-line p-2 lg:sticky lg:top-20">
        <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <li key={tab.key} className="shrink-0">
                <button
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150 whitespace-nowrap
                    ${isActive ? 'bg-teal-700 text-white' : 'text-ink-600 hover:bg-surface'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div>
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'hospital' && <HospitalTab />}
        {activeTab === 'users' && <UsersRolesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}

/* ----------------------------- Profile tab ----------------------------- */

function ProfileTab() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || 'Dr. Aisha Verma',
    email: user?.email || 'aisha.verma@medicore.com',
    phone: '+91 98765 43210',
    role: user?.role || 'Administrator',
    department: 'Administration',
  });
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    // TODO: replace with real endpoint once backend is ready
    // await api.put('/settings/profile', form);
    setSaved(true);
  }

  return (
    <Card title="Your profile">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-display font-semibold text-xl">
              {form.name?.[0] ?? 'A'}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-600"
              aria-label="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-ink-900">{form.name}</p>
            <p className="text-xs text-ink-600">JPG or PNG, up to 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <Input
            label="Email address"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
          <Input label="Phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <Input label="Role" value={form.role} disabled hint="Contact an admin to change your role" />
          <Select
            label="Department"
            value={form.department}
            onChange={(e) => update('department', e.target.value)}
            options={[
              { value: 'Administration', label: 'Administration' },
              { value: 'Cardiology', label: 'Cardiology' },
              { value: 'Orthopedics', label: 'Orthopedics' },
              { value: 'Neurology', label: 'Neurology' },
              { value: 'General', label: 'General' },
            ]}
          />
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-line">
          <Button type="submit" className="mt-4">
            Save changes
          </Button>
          {saved && <span className="text-sm text-success-600 mt-4">Saved</span>}
        </div>
      </form>
    </Card>
  );
}

/* --------------------------- Hospital info tab -------------------------- */

function HospitalTab() {
  const [departments, setDepartments] = useState([
    'General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'ENT',
  ]);
  const [newDept, setNewDept] = useState('');

  function addDept(e) {
    e.preventDefault();
    const name = newDept.trim();
    if (!name || departments.includes(name)) return;
    setDepartments((d) => [...d, name]);
    setNewDept('');
  }

  function removeDept(name) {
    setDepartments((d) => d.filter((x) => x !== name));
  }

  return (
    <div className="space-y-6">
      <Card title="Hospital details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Hospital name" defaultValue="MediCore Multi-speciality Hospital" />
          <Input label="Registration number" defaultValue="HMS-REG-88213" />
          <Input label="Contact email" type="email" defaultValue="contact@medicorehms.com" />
          <Input label="Contact phone" defaultValue="+91 522 456 7890" />
          <div className="sm:col-span-2">
            <Input label="Address" defaultValue="14 MG Road, Hazratganj, Lucknow, UP 226001" />
          </div>
          <Select
            label="Time zone"
            value="Asia/Kolkata"
            options={[{ value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST, UTC+5:30)' }]}
          />
          <Select
            label="Currency"
            value="INR"
            options={[{ value: 'INR', label: '₹ Indian Rupee (INR)' }]}
          />
        </div>
        <div className="pt-4 mt-4 border-t border-line">
          <Button>Save changes</Button>
        </div>
      </Card>

      <Card title="Departments" action={<span className="text-xs text-ink-600">{departments.length} total</span>}>
        <div className="flex flex-wrap gap-2 mb-4">
          {departments.map((d) => (
            <span
              key={d}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-surface text-sm text-ink-900 border border-line"
            >
              {d}
              <button
                onClick={() => removeDept(d)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-ink-400 hover:text-danger-600 hover:bg-danger-50"
                aria-label={`Remove ${d}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={addDept} className="flex gap-2 max-w-sm">
          <Input
            placeholder="e.g. Radiology"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            className="!py-2"
          />
          <Button type="submit" icon={Plus} variant="secondary">
            Add
          </Button>
        </form>
      </Card>
    </div>
  );
}

/* --------------------------- Users & roles tab -------------------------- */

function UsersRolesTab() {
  const roleSummary = [
    { name: 'Admin', users: 3, permissions: 'All modules' },
    { name: 'Doctor', users: 8, permissions: 'Patients, OPD, IPD, Pharmacy (view)' },
    { name: 'Nurse', users: 12, permissions: 'Patients, IPD' },
    { name: 'Receptionist', users: 6, permissions: 'OPD, Billing' },
    { name: 'Lab Technician', users: 5, permissions: 'Lab reports' },
  ];

  return (
    <Card
      title="Users & roles"
      action={
        <a href="/users">
          <Button variant="secondary" size="sm">
            Open full user management
          </Button>
        </a>
      }
    >
      <p className="text-sm text-ink-600 mb-5">
        A quick summary of roles across the hospital. Add, edit, or remove individual users and permissions
        from the full user management page.
      </p>
      <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
        {roleSummary.map((role) => (
          <div key={role.name} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink-900">{role.name}</p>
              <p className="text-xs text-ink-600">{role.permissions}</p>
            </div>
            <StatusBadge status="info">{role.users} users</StatusBadge>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* --------------------------- Notifications tab --------------------------- */

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    lowStock: { email: true, sms: false, push: true },
    appointments: { email: true, sms: true, push: true },
    billing: { email: true, sms: false, push: false },
    critical: { email: true, sms: true, push: true },
  });

  const rows = [
    { key: 'lowStock', label: 'Low medicine stock', hint: 'Alerts when inventory drops below threshold' },
    { key: 'appointments', label: 'Appointment updates', hint: 'New bookings, reschedules, cancellations' },
    { key: 'billing', label: 'Billing & payments', hint: 'Pending bills and payment confirmations' },
    { key: 'critical', label: 'Critical patient alerts', hint: 'ICU occupancy and critical condition changes' },
  ];

  function toggle(rowKey, channel) {
    setPrefs((p) => ({
      ...p,
      [rowKey]: { ...p[rowKey], [channel]: !p[rowKey][channel] },
    }));
  }

  return (
    <Card title="Notification preferences">
      <div className="hidden sm:grid grid-cols-[1fr_70px_70px_70px] gap-4 px-1 pb-3 mb-3 border-b border-line text-xs font-medium text-ink-600">
        <span>Alert type</span>
        <span className="text-center">Email</span>
        <span className="text-center">SMS</span>
        <span className="text-center">Push</span>
      </div>
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.key} className="grid grid-cols-1 sm:grid-cols-[1fr_70px_70px_70px] gap-4 items-center">
            <div>
              <p className="text-sm font-medium text-ink-900">{row.label}</p>
              <p className="text-xs text-ink-600">{row.hint}</p>
            </div>
            {['email', 'sms', 'push'].map((channel) => (
              <div key={channel} className="flex sm:justify-center">
                <Toggle checked={prefs[row.key][channel]} onChange={() => toggle(row.key, channel)} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pt-4 mt-5 border-t border-line">
        <Button>Save preferences</Button>
      </div>
    </Card>
  );
}

/* ------------------------------ Security tab ----------------------------- */

function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false);
  const sessions = [
    { id: 1, device: 'Chrome on Windows', location: 'Lucknow, IN', current: true, icon: Monitor },
    { id: 2, device: 'MediCore mobile app', location: 'Lucknow, IN', current: false, icon: Smartphone },
  ];

  return (
    <div className="space-y-6">
      <Card title="Change password">
        <form className="space-y-4 max-w-sm">
          <Input label="Current password" type="password" placeholder="••••••••" />
          <Input label="New password" type="password" placeholder="••••••••" hint="At least 8 characters" />
          <Input label="Confirm new password" type="password" placeholder="••••••••" />
          <Button type="submit" icon={KeyRound}>
            Update password
          </Button>
        </form>
      </Card>

      <Card title="Two-factor authentication">
        <Toggle
          checked={twoFactor}
          onChange={setTwoFactor}
          label="Require a verification code at login"
          hint="Adds an extra step using an authenticator app or SMS"
        />
      </Card>

      <Card title="Active sessions">
        <div className="divide-y divide-line border border-line rounded-lg overflow-hidden">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-ink-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">
                      {s.device} {s.current && <StatusBadge status="success">This device</StatusBadge>}
                    </p>
                    <p className="text-xs text-ink-600">{s.location}</p>
                  </div>
                </div>
                {!s.current && (
                  <Button variant="danger" size="sm" icon={LogOut}>
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
