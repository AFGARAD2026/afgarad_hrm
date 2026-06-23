import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Employee, EmployeeStatus } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Star,
  UserX,
  X,
  ChevronDown,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  department: z.enum(['Engineering', 'Design', 'Product', 'Marketing', 'HR & Operations', 'Sales']),
  status: z.enum(['Active', 'On Leave', 'Suspended']),
  location: z.string().min(3, 'Location is required'),
  salary: z.coerce.number().min(20000, 'Salary must be at least $20,000'),
  phone: z.string().min(6, 'Valid phone number is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  performanceRating: z.coerce.number().min(1).max(5),
});

type EmployeeFormInput = z.infer<typeof employeeSchema>;

interface EmployeeDirectoryProps {
  isAddModalOpenFromApp: boolean;
  closeAddModalFromApp: () => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  isAddModalOpenFromApp,
  closeAddModalFromApp
}) => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmployeeFormInput>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      status: 'Active',
      performanceRating: 5.0,
      gender: 'Female'
    }
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    reset({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      status: 'Active',
      location: '',
      salary: 85000,
      phone: '',
      gender: 'Female',
      performanceRating: 5.0
    });
    setIsNewModalOpen(true);
  };

  const handleEditClick = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    reset({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department as any,
      status: employee.status as any,
      location: employee.location,
      salary: employee.salary,
      phone: employee.phone,
      gender: employee.gender as any,
      performanceRating: employee.performanceRating
    });
    setSelectedEmployee(employee);
    setIsNewModalOpen(true);
  };

  const onSubmit = (data: EmployeeFormInput) => {
    if (isEditing && selectedEmployee) {
      updateEmployee(selectedEmployee.id, data);
      setIsNewModalOpen(false);
      setSelectedEmployee(null);
    } else {
      addEmployee({
        ...data,
        avatar: `https://images.unsplash.com/photo-${
          data.gender === 'Female' 
            ? '1494790108377-be9c29b29330' 
            : data.gender === 'Male'
              ? '1507003211169-0a1dd7228f2d'
              : '1534528741775-53994a69daeb'
        }?w=150`
      });
      setIsNewModalOpen(false);
    }
    reset();
    closeAddModalFromApp();
  };

  // Watch for external modal open requests from dashboard
  React.useEffect(() => {
    if (isAddModalOpenFromApp) {
      handleOpenAddModal();
    }
  }, [isAddModalOpenFromApp]);

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
    closeAddModalFromApp();
  };

  // Filter lists
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'HR & Operations', 'Sales'];
  const STATUSES = ['All', 'Active', 'On Leave', 'Suspended'];

  return (
    <div className="space-y-6">
      {/* Search and control panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search by name, role description, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dept Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <SlidersHorizontal size={13} className="text-slate-400" />
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={15} />
            </button>
          </div>

          {/* Add Employee button */}
          <button 
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-sm shadow-indigo-200 hover:scale-101 active:scale-99 transition-all"
          >
            <Plus size={14} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Grid or List dynamic layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredEmployees.map((emp) => {
            const statusColors = 
              emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' :
              'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <motion.div 
                key={emp.id}
                layout
                whileHover={{ y: -4, shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between hover:border-slate-300 relative group overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => handleEditClick(emp, e)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{emp.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{emp.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Briefcase size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">{emp.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">{emp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50">
                  <span className={`text-[9px] px-2 py-0.5 border rounded-lg font-medium leading-normal ${statusColors}`}>
                    {emp.status}
                  </span>
                  
                  <div className="flex items-center gap-0.5 text-xs font-extrabold text-amber-500">
                    <Star size={11} fill="currentColor" />
                    <span>{emp.performanceRating}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55/40 border-b border-slate-100">
                  <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Name & Contact</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Department</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Job Title</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Compensation</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Rating</th>
                  <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Status</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const statusColors = 
                    emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr 
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-slate-50 cursor-pointer transition-all"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={emp.avatar} 
                            alt={emp.name} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">{emp.department}</td>
                      <td className="p-4 text-xs text-slate-600">{emp.role}</td>
                      <td className="p-4 text-xs font-semibold text-slate-700">
                        ${emp.salary?.toLocaleString()}/yr
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                          <Star size={11} fill="currentColor" />
                          <span>{emp.performanceRating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[9.5px] px-2 py-0.5 border rounded-md font-semibold ${statusColors}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => handleEditClick(emp, e)}
                          className="p-1 px-2 text-xs border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-lg bg-white cursor-pointer transition-all mr-1.5"
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide Drawer Profile View */}
      <AnimatePresence>
        {selectedEmployee && (
          <>
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="fixed inset-0 bg-slate-950 z-40"
            ></motion.div>

            {/* Main right-side card */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white border-l border-slate-100 z-50 flex flex-col justify-between shadow-2xl"
            >
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                {/* Header controls */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900">Personnel Dossier</h3>
                  <button 
                    onClick={() => setSelectedEmployee(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Cover profile frame */}
                <div className="text-center space-y-3 pb-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <img 
                      src={selectedEmployee.avatar} 
                      alt={selectedEmployee.name} 
                      className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                      selectedEmployee.status === 'Active' ? 'bg-emerald-500' :
                      selectedEmployee.status === 'On Leave' ? 'bg-amber-500' :
                      'bg-slate-400'
                    }`}></span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-base font-extrabold text-slate-900">{selectedEmployee.name}</h4>
                    <p className="text-xs font-medium text-indigo-600">{selectedEmployee.role}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{selectedEmployee.id}</p>
                  </div>
                </div>

                {/* Information cards */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Assignment details</h5>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-medium">Department</p>
                      <p className="text-xs font-bold text-slate-800">{selectedEmployee.department}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-medium">Base Compensation</p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-0.5">
                        <DollarSign size={13} className="text-slate-500" />
                        {selectedEmployee.salary?.toLocaleString()}/yr
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-medium">Office Location</p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-0.5">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="truncate">{selectedEmployee.location}</span>
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-medium">Onboarding Date</p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-0.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{selectedEmployee.startDate}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contacts */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Communication lines</h5>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-slate-700">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <span className="font-mono">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-700">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      <span className="font-mono">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Score scale */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Performance Assessment</h5>
                    <div className="flex items-center gap-0.5 text-xs font-extrabold text-amber-500">
                      <Star size={11} fill="currentColor" />
                      <span>{selectedEmployee.performanceRating}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(selectedEmployee.performanceRating / 5) * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Evaluated score out of 5.0 scale indicator.</p>
                </div>
              </div>

              {/* Administrative offboarding triggers */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={(e) => {
                    handleEditClick(selectedEmployee, e);
                    setSelectedEmployee(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl py-3 cursor-pointer transition-all"
                >
                  <Edit2 size={13} />
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Are you sure you want to offboard ${selectedEmployee.name}? This removes their active payroll details.`)) {
                      deleteEmployee(selectedEmployee.id);
                      setSelectedEmployee(null);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl px-4 cursor-pointer transition-all"
                >
                  <UserX size={14} />
                  Offboard
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide Drawer: New Employee/Edit Form Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-slate-950 z-40"
            ></motion.div>

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white border-l border-slate-100 z-50 flex flex-col justify-between shadow-2xl"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                <div className="overflow-y-auto flex-1 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {isEditing ? 'Modify Personnel Profile' : 'Enterprise Talent Intake Form'}
                    </h3>
                    <button 
                      type="button"
                      onClick={handleCloseModal}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Complete all compliant regulatory information below to register the profile onto local databases.
                  </p>

                  <div className="space-y-4">
                    {/* General Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Legal Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Jean Dupont"
                        {...register('name')}
                        className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.name && <p className="text-[10px] text-rose-500">{errors.name.message}</p>}
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Corporate Email</label>
                      <input 
                        type="email" 
                        placeholder="e.g. j.dupont@enterprise.co"
                        {...register('email')}
                        className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.email && <p className="text-[10px] text-rose-500">{errors.email.message}</p>}
                    </div>

                    {/* Role Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Job Title / Role</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Principal Architect"
                        {...register('role')}
                        className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.role && <p className="text-[10px] text-rose-500">{errors.role.message}</p>}
                    </div>

                    {/* Phone details */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Contact Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +33 6 4455 9090"
                        {...register('phone')}
                        className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone.message}</p>}
                    </div>

                    {/* Selector Dept & Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Department</label>
                        <select 
                          {...register('department')}
                          className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Product">Product</option>
                          <option value="Marketing">Marketing</option>
                          <option value="HR & Operations">HR & Operations</option>
                          <option value="Sales">Sales</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">State Guard</label>
                        <select 
                          {...register('status')}
                          className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    {/* Gender details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Identified Gender</label>
                        <select 
                          {...register('gender')}
                          className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Performance Rating</label>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="1" 
                          max="5"
                          {...register('performanceRating')}
                          className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Location Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Operational Base Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Paris, France (Hybrid)"
                        {...register('location')}
                        className="w-full text-xs font-medium px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.location && <p className="text-[10px] text-rose-500">{errors.location.message}</p>}
                    </div>

                    {/* Compensation details */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Base Compensation Year Salary ($USD)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">$</span>
                        <input 
                          type="number" 
                          placeholder="e.g. 95000"
                          {...register('salary')}
                          className="w-full text-xs font-medium pl-6 pr-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                        />
                      </div>
                      {errors.salary && <p className="text-[10px] text-rose-500">{errors.salary.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Foot submit bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 text-xs text-slate-600 hover:text-slate-800 font-bold border border-slate-200 hover:bg-slate-100 rounded-xl py-3 cursor-pointer bg-white transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 text-xs text-white font-bold bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 cursor-pointer shadow-indigo-100 shadow-sm hover:scale-101 active:scale-99 transition-all text-center"
                  >
                    {isEditing ? 'Save Profile' : 'Complete Intake'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
