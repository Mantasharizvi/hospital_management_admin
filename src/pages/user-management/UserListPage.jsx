import { UserPlus, Eye } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import FormModal from '../../components/common/FormModal';
import UserProfileModal from '../../components/common/UserProfileModal';
import { useUserManagement } from '../../context/UserManagementContext';

export default function UserListPage() {
  const {
    usersList,
    showAddUserModal, setShowAddUserModal,
    newUserForm, setNewUserForm, newUserErrors,
    showProfileModal, setShowProfileModal,
    selectedUser,
    handleOpenUserProfile, handleSaveProfile,
    handleOpenAddUser, handleAddUser,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <PageHeader
        title="User List"
        description="All system users. Add new staff accounts here."
        action={<Button icon={UserPlus} onClick={handleOpenAddUser}>Add User</Button>}
      />

      <Table
        columns={[
          { key: 'id', header: 'User ID' },
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'role', header: 'Role' },
          { key: 'status', header: 'Status' },
          {
            key: 'action',
            header: 'Action',
            render: (row) => (
              <Button size="sm" variant="secondary" icon={Eye} onClick={() => handleOpenUserProfile(row)}>
                Profile
              </Button>
            ),
          },
        ]}
        data={usersList}
      />

      {/* Add New User popup */}
      <FormModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        title="Add New User"
        submitLabel="Add User"
      >
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={newUserForm.name}
          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
          error={newUserErrors.name}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="user@medicore.com"
          value={newUserForm.email}
          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
          error={newUserErrors.email}
        />
        <Input
          label="Department"
          placeholder="e.g. Cardiology"
          value={newUserForm.department}
          onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
          error={newUserErrors.department}
        />
        <Input
          label="Role"
          placeholder="e.g. Doctor, Nurse"
          value={newUserForm.role}
          onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
          error={newUserErrors.role}
        />
        <Input
          label="Contact Number"
          placeholder="+91 XXXXXXXXXX"
          value={newUserForm.phone}
          onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
          error={newUserErrors.phone}
        />
        <Input
          label="License Number"
          placeholder="If applicable"
          value={newUserForm.license}
          onChange={(e) => setNewUserForm({ ...newUserForm, license: e.target.value })}
        />
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Permissions</label>
          <div className="grid grid-cols-2 gap-3">
            {['View Patients', 'Add Patients', 'View Prescriptions', 'Issue Prescriptions'].map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-line" />
                <span className="text-sm text-ink-700">{p}</span>
              </label>
            ))}
          </div>
        </div>
      </FormModal>

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={selectedUser}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
