import { useState } from 'react';
import { Lock } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Toggle from '../../components/common/Toggle';
import { permissions as initialPermissions } from '../../context/UserManagementContext';
import { useToast } from '../../context/ToastContext';

export default function PermissionsManagementPage() {
  const toast = useToast();
  const [permissionState, setPermissionState] = useState(initialPermissions);

  const categories = [...new Set(permissionState.map((p) => p.category))];

  const togglePermission = (id, enabled) => {
    setPermissionState((current) => current.map((p) => (p.id === id ? { ...p, enabled } : p)));
    const perm = permissionState.find((p) => p.id === id);
    toast.success(`"${perm?.name}" ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissions Management"
        description="Enable or disable system-wide permissions by category."
      />

      <div className="space-y-6 max-w-2xl">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 text-teal-700 mb-3">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-semibold">{category}</span>
            </div>
            <div className="space-y-4 rounded-lg border border-line p-4">
              {permissionState
                .filter((p) => p.category === category)
                .map((perm) => (
                  <Toggle
                    key={perm.id}
                    label={perm.name}
                    hint={perm.id}
                    checked={perm.enabled}
                    onChange={(checked) => togglePermission(perm.id, checked)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
