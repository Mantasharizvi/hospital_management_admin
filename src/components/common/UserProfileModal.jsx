import { useEffect, useState } from 'react';
import { Users, Edit2, Settings } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { useToast } from '../../context/ToastContext';

/**
 * Reusable profile popup: view details, edit profile, or open account settings.
 * Used both for "My Profile" in the header and for viewing other users from
 * the User Management list, so the UX is identical everywhere.
 */
export default function UserProfileModal({ isOpen, onClose, user, onSave, editableRole = true }) {
  const toast = useToast();
  const [mode, setMode] = useState('view'); // view | edit | settings
  const [form, setForm] = useState(user);

  useEffect(() => {
    if (isOpen) {
      setForm(user);
      setMode('view');
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setMode('view');
    onClose?.();
  };

  const handleSave = () => {
    if (!form?.name?.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    onSave?.(form);
    setMode('view');
    toast.success('Profile updated successfully');
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'settings' ? 'Account Settings' : 'User Profile'} size="lg">
      {mode === 'view' && (
        <>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
                <Users className="h-10 w-10 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-lg text-ink-900">{user.name}</p>
                <p className="text-sm text-ink-600">{user.role}</p>
                <p className="text-xs text-ink-500 mt-1">{user.email}</p>
              </div>
            </div>
            <div className="border-t border-line pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-ink-600 uppercase font-semibold">Department</p>
                <p className="text-sm font-medium text-ink-900 mt-1">{user.department}</p>
              </div>
              <div>
                <p className="text-xs text-ink-600 uppercase font-semibold">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
                    {user.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-600 uppercase font-semibold">Last Login</p>
                <p className="text-sm font-medium text-ink-900 mt-1">{user.lastLogin}</p>
              </div>
              <div>
                <p className="text-xs text-ink-600 uppercase font-semibold">Member Since</p>
                <p className="text-sm font-medium text-ink-900 mt-1">{user.memberSince}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
            <Button icon={Edit2} onClick={() => setMode('edit')} fullWidth>
              Edit Profile
            </Button>
            <Button variant="secondary" icon={Settings} onClick={() => setMode('settings')} fullWidth>
              Settings
            </Button>
          </div>
        </>
      )}

      {mode === 'edit' && form && (
        <>
          <div className="px-6 py-4 space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            {editableRole && (
              <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            )}
            <div>
              <label className="block text-sm font-medium text-ink-900 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
            <Button onClick={handleSave} fullWidth>Save Changes</Button>
            <Button variant="secondary" onClick={() => { setForm(user); setMode('view'); }} fullWidth>
              Cancel
            </Button>
          </div>
        </>
      )}

      {mode === 'settings' && (
        <>
          <div className="px-6 py-4 space-y-4">
            <div>
              <h4 className="font-semibold text-ink-900 mb-3">System Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                  <span className="text-sm text-ink-700">Email notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                  <span className="text-sm text-ink-700">SMS alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-line" />
                  <span className="text-sm text-ink-700">Two-factor authentication</span>
                </label>
              </div>
            </div>
            <div className="border-t border-line pt-4">
              <h4 className="font-semibold text-ink-900 mb-3">Privacy Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                  <span className="text-sm text-ink-700">Show profile to other users</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-line" />
                  <span className="text-sm text-ink-700">Allow activity tracking</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-line bg-surface rounded-b-xl">
            <Button onClick={() => { toast.success('Settings saved'); setMode('view'); }} fullWidth>
              Save Settings
            </Button>
            <Button variant="secondary" onClick={() => setMode('view')} fullWidth>
              Back
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
