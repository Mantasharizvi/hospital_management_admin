import { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';
import { validateForm, rules, isValid } from '../utils/validators';

const UserManagementContext = createContext(null);

const initialUsers = [
  { id: 'USR-001', name: 'Dr. Rajesh Sharma', email: 'rajesh@medicore.com', role: 'Admin', status: 'Active', department: 'Administration', lastLogin: 'Today 02:45 PM', memberSince: '01 Jan 2025' },
  { id: 'USR-002', name: 'Dr. Priya Nair', email: 'priya@medicore.com', role: 'Doctor', status: 'Active', department: 'Cardiology', lastLogin: 'Today 10:30 AM', memberSince: '15 Feb 2025' },
  { id: 'USR-003', name: 'Arjun Menon', email: 'arjun@medicore.com', role: 'Nurse', status: 'Active', department: 'ICU', lastLogin: 'Today 08:15 AM', memberSince: '20 Mar 2025' },
  { id: 'USR-004', name: 'Sneha Verma', email: 'sneha@medicore.com', role: 'Receptionist', status: 'Inactive', department: 'Front Desk', lastLogin: 'Yesterday 06:30 PM', memberSince: '10 Apr 2025' },
];

const initialRoles = [
  { id: 'ROLE-01', name: 'Admin', users: 3, permissions: 'All' },
  { id: 'ROLE-02', name: 'Doctor', users: 8, permissions: '15' },
  { id: 'ROLE-03', name: 'Nurse', users: 12, permissions: '12' },
  { id: 'ROLE-04', name: 'Receptionist', users: 6, permissions: '8' },
  { id: 'ROLE-05', name: 'Lab Technician', users: 5, permissions: '6' },
];

export const permissions = [
  { id: 'PERM-001', name: 'View Patients', category: 'Patient Management', enabled: true },
  { id: 'PERM-002', name: 'Add Patients', category: 'Patient Management', enabled: true },
  { id: 'PERM-003', name: 'Edit Patients', category: 'Patient Management', enabled: false },
  { id: 'PERM-004', name: 'Delete Patients', category: 'Patient Management', enabled: false },
  { id: 'PERM-005', name: 'View Prescriptions', category: 'Prescription', enabled: true },
  { id: 'PERM-006', name: 'Issue Prescriptions', category: 'Prescription', enabled: false },
];

const emptyNewUser = { name: '', email: '', department: '', role: '', phone: '', license: '' };
const newUserSchema = {
  name: [rules.required('Full name is required')],
  email: [rules.required('Email is required'), rules.email()],
  department: [rules.required('Department is required')],
  role: [rules.required('Role is required')],
  phone: [rules.phone('Enter a valid contact number')],
};

export function UserManagementProvider({ children }) {
  const toast = useToast();
  const [usersList, setUsersList] = useState(initialUsers);
  const [rolesList, setRolesList] = useState(initialRoles);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState(emptyNewUser);
  const [newUserErrors, setNewUserErrors] = useState({});

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRoleForm, setNewRoleForm] = useState({ name: '', description: '', permissions: [] });

  const handleOpenUserProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (updated) => {
    setUsersList((current) => current.map((u) => (u.id === updated.id ? updated : u)));
    setSelectedUser(updated);
  };

  const handleOpenAddUser = () => {
    setNewUserForm(emptyNewUser);
    setNewUserErrors({});
    setShowAddUserModal(true);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const errors = validateForm(newUserForm, newUserSchema);
    setNewUserErrors(errors);
    if (!isValid(errors)) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const newUser = {
      id: `USR-${String(usersList.length + 1).padStart(3, '0')}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'Active',
      department: newUserForm.department,
      lastLogin: '—',
      memberSince: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setUsersList((current) => [...current, newUser]);
    setShowAddUserModal(false);
    toast.success(`User "${newUser.name}" added successfully`);
  };

  const handleCreateRoleClick = () => {
    setNewRoleForm({ name: '', description: '', permissions: [] });
    setShowCreateRoleModal(true);
  };

  const handleEditRoleClick = () => setShowEditRoleModal(true);

  const handleCreateRole = () => {
    if (!newRoleForm.name.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    const newRole = {
      id: `ROLE-${String(rolesList.length + 1).padStart(2, '0')}`,
      name: newRoleForm.name,
      users: 0,
      permissions: newRoleForm.permissions.length.toString(),
    };
    setRolesList([...rolesList, newRole]);
    setShowCreateRoleModal(false);
    setNewRoleForm({ name: '', description: '', permissions: [] });
    toast.success(`Role "${newRole.name}" created successfully`);
  };

  const handleSelectRole = (role) => setEditingRole(role);

  const handleSaveEditRole = () => {
    if (!editingRole.name.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    setRolesList(rolesList.map((role) => (role.id === editingRole.id ? editingRole : role)));
    setShowEditRoleModal(false);
    setEditingRole(null);
    toast.success(`Role "${editingRole.name}" updated successfully`);
  };

  const value = {
    usersList, rolesList,
    showAddUserModal, setShowAddUserModal,
    newUserForm, setNewUserForm, newUserErrors,
    showCreateRoleModal, setShowCreateRoleModal,
    showEditRoleModal, setShowEditRoleModal,
    editingRole, setEditingRole,
    showProfileModal, setShowProfileModal,
    selectedUser, setSelectedUser,
    newRoleForm, setNewRoleForm,
    handleOpenUserProfile, handleSaveProfile,
    handleOpenAddUser, handleAddUser,
    handleCreateRoleClick, handleEditRoleClick,
    handleCreateRole, handleSelectRole, handleSaveEditRole,
  };

  return <UserManagementContext.Provider value={value}>{children}</UserManagementContext.Provider>;
}

export function useUserManagement() {
  const ctx = useContext(UserManagementContext);
  if (!ctx) throw new Error('useUserManagement must be used within UserManagementProvider');
  return ctx;
}
