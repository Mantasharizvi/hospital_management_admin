import { useMemo, useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Toggle from '../../components/common/Toggle';
import { permissions as initialPermissions } from '../../context/UserManagementContext';
import { useToast } from '../../context/ToastContext';

// --- Role preset logic -------------------------------------------------
//
// Every permission is classified into a level based on keywords in its
// id/name. Roles are then defined as "which levels they include", so
// presets stay in sync automatically as permissions are added/removed —
// no per-permission role mapping to maintain by hand.

const ROLES = {
  admin: {
    label: 'Admin',
    description: 'Full access to every permission, including delete and system settings.',
  },
  editor: {
    label: 'Editor',
    description: 'Can view, create, and update, but not delete or manage system settings.',
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access. Cannot create, edit, or delete anything.',
  },
};

const ROLE_ORDER = ['admin', 'editor', 'viewer'];

function getPermissionLevel(perm) {
  const text = `${perm.id} ${perm.name}`.toLowerCase();
  if (/delete|remove|manage|admin|config|setting|billing|role|permission/.test(text)) return 'manage';
  if (/edit|update|create|write|approve|assign/.test(text)) return 'edit';
  return 'view';
}

function isEnabledForRole(level, role) {
  if (role === 'admin') return true;
  if (role === 'editor') return level !== 'manage';
  if (role === 'viewer') return level === 'view';
  return false;
}

export default function PermissionsManagementPage() {
  const toast = useToast();
  const [permissionState, setPermissionState] = useState(initialPermissions);

  const categories = [...new Set(permissionState.map((p) => p.category))];

  const togglePermission = (id, enabled) => {
    const perm = permissionState.find((p) => p.id === id);
    setPermissionState((current) => current.map((p) => (p.id === id ? { ...p, enabled } : p)));
    toast.success(`"${perm?.name}" ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Which preset (if any) matches the current permission state exactly.
  const matchedRole = useMemo(() => {
    return (
      ROLE_ORDER.find((role) =>
        permissionState.every((p) => p.enabled === isEnabledForRole(getPermissionLevel(p), role))
      ) ?? null
    );
  }, [permissionState]);

  const applyPreset = (role) => {
    setPermissionState((current) =>
      current.map((p) => ({ ...p, enabled: isEnabledForRole(getPermissionLevel(p), role) }))
    );
    toast.success(`Applied "${ROLES[role].label}" preset`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissions Management"
        description="Enable or disable system-wide permissions by category."
      />

      <div className="max-w-2xl rounded-lg border border-line p-4 space-y-3">
        <div className="flex items-center gap-2 text-teal-700">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-sm font-semibold">Role preset</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 rounded-lg border border-line bg-gray-50 p-1 w-fit">
            {ROLE_ORDER.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => applyPreset(role)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  matchedRole === role
                    ? 'bg-teal-700 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {ROLES[role].label}
              </button>
            ))}
          </div>
          {matchedRole === null && (
            <span className="text-xs text-gray-500 italic">Custom &mdash; doesn&apos;t match any preset</span>
          )}
        </div>

        <p className="text-xs text-gray-500">
          {matchedRole ? ROLES[matchedRole].description : 'Individual permissions have been changed since the last preset was applied.'}
        </p>
      </div>

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
