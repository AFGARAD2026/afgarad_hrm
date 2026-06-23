import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { User, UserRole } from '../types';
import { 
  ShieldCheck, 
  Trash2, 
  Search, 
  Plus, 
  Users, 
  UserCog, 
  UserCheck, 
  ShieldAlert,
  Sliders,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UsersPage: React.FC = () => {
  const { users, addUser, updateUserRole, deleteUser } = useHR();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setRole('Employee');
    setStatus('Active');
    setIsAddOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
      status
    });

    setIsAddOpen(false);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole(userId, newRole);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this user account? This will revoke all database & dashboard administration access.')) {
      deleteUser(id);
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const hrCount = users.filter(u => u.role === 'HR Manager').length;
  const activeCount = users.filter(u => u.status === 'Active').length;

  // Search filter
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header section with trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management Terminal</h2>
          <p className="text-xs text-slate-500">Configure administrative access, coordinate permission scopes, and audit system users</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98"
        >
          <Plus size={14} />
          Add Access User
        </button>
      </div>

      {/* Corporate Permissions Tally row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Active Users</span>
            <p className="text-2xl font-black text-slate-900">{totalUsers} Users</p>
            <p className="text-[10px] text-slate-500 font-medium">Provisioned workspace credentials</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/30 flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
        </div>

        {/* Admins count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Super Administrators</span>
            <p className="text-2xl font-black text-indigo-700">{adminCount}</p>
            <p className="text-[10px] text-slate-500 font-medium">Full read/write system access</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100/30 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} />
          </div>
        </div>

        {/* HR Operations Officials count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">HR Managers</span>
            <p className="text-2xl font-black text-emerald-600">{hrCount}</p>
            <p className="text-[10px] text-slate-500 font-medium">HR and recruiting workflow managers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/30 flex items-center justify-center shrink-0">
            <UserCog size={18} />
          </div>
        </div>

        {/* Status compliance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Credentials</span>
            <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
            <p className="text-[10px] text-slate-500 font-medium">Status active standard count</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/30 flex items-center justify-center shrink-0">
            <UserCheck size={18} />
          </div>
        </div>
      </div>

      {/* Access User Table list panel */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
        
        {/* Search header controls */}
        <div className="p-4 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-450">
              <Search size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search users by name, email, or custom authority level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white"
            />
          </div>
          <div className="text-xs text-slate-500 font-mono font-bold flex items-center gap-1">
            <ShieldCheck size={13} className="text-indigo-600" />
            <span>Root Authentication Token Active</span>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Workspace Email</th>
                <th className="py-3 px-4">Access Role Level</th>
                <th className="py-3 px-4">Login Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-450 italic">
                    No directory administrator records found. Click "Add Access User" above.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const statusStyles = 
                    user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-slate-55/65 text-slate-500 border-slate-200';

                  const roleStyles = 
                    user.role === 'Admin' ? 'bg-violet-50 text-violet-700 border-violet-100 font-extrabold' :
                    user.role === 'HR Manager' ? 'bg-indigo-50 text-indigo-750 border-indigo-100 font-bold' :
                    'bg-slate-50 text-slate-650 border-slate-100';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold mt-0.5">ID: {user.id}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-650">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 border rounded-md text-[9.5px] tracking-wide ${roleStyles}`}>
                            {user.role}
                          </span>
                          {/* Role update toggle drop downs */}
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className="text-[9.5px] border border-slate-200 rounded-md p-0.5 font-bold text-slate-500 bg-white cursor-pointer"
                          >
                            <option value="Admin">Admin</option>
                            <option value="HR Manager">HR Manager</option>
                            <option value="Employee">Employee</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 border rounded-md font-bold text-[9px] uppercase tracking-wider ${statusStyles}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                          title="Revoke session credentials"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 rounded-b-xl">
          <span>Active security session</span>
          <span className="font-bold text-indigo-600">Administrative count: {adminCount} Administrators</span>
        </div>

      </div>

      {/* Model access user Dialog portal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-slate-950" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <ShieldCheck size={16} className="text-indigo-600" />
                  <h3 className="font-bold text-sm">Add system access credentials</h3>
                </div>
                <button onClick={() => setIsAddOpen(false)} className="p-1 hover:bg-slate-100 text-slate-455 rounded-lg">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">User Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Liam Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corporate Email</label>
                  <input 
                    type="email"
                    required
                    placeholder="e.g. liam.smith@corp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Scope Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden bg-white cursor-pointer font-bold"
                    >
                      <option value="Employee">Employee (Basic view)</option>
                      <option value="HR Manager">HR Manager (Moderate edits)</option>
                      <option value="Admin">Admin (Full override)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Initial Account Status</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden bg-white cursor-pointer font-bold"
                    >
                      <option value="Active">Active Credentials</option>
                      <option value="Inactive">Suspended / Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 text-slate-505 border border-slate-250 text-2xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-2xs font-extrabold rounded-lg select-none cursor-pointer"
                  >
                    Register Access User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
