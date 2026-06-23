import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Department } from '../types';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DepartmentsPageProps {
  isAddModalOpenFromApp?: boolean;
  closeAddModalFromApp?: () => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  isAddModalOpenFromApp = false,
  closeAddModalFromApp
}) => {
  const { departments, addDepartment, updateDepartment, deleteDepartment, employees } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // Selected department for actions
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  
  // Form input states
  const [deptName, setDeptName] = useState('');
  const [deptDescription, setDeptDescription] = useState('');

  // Filtering
  const filteredDepts = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Watch for external trigger
  React.useEffect(() => {
    if (isAddModalOpenFromApp) {
      handleOpenCreate();
    }
  }, [isAddModalOpenFromApp]);

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    if (closeAddModalFromApp) {
      closeAddModalFromApp();
    }
  };

  const handleOpenCreate = () => {
    setDeptName('');
    setDeptDescription('');
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || !deptDescription.trim()) return;
    addDepartment({
      name: deptName.trim(),
      description: deptDescription.trim()
    });
    handleCloseCreate();
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    setDeptName(dept.name);
    setDeptDescription(dept.description);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !deptName.trim() || !deptDescription.trim()) return;
    updateDepartment(selectedDept.id, {
      name: deptName.trim(),
      description: deptDescription.trim()
    });
    setIsEditOpen(false);
  };

  const handleOpenView = (dept: Department) => {
    setSelectedDept(dept);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this department? This will remove the organizational category.')) {
      deleteDepartment(id);
    }
  };

  // Get list of employees assigned to a department
  const getDeptEmployees = (deptNameVal: string) => {
    return employees.filter(emp => emp.department.toLowerCase() === deptNameVal.toLowerCase() && emp.status !== 'Terminated');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and statistics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Departments Module</h2>
          <p className="text-xs text-slate-500">Configure organizational structures, departments, and member distributions</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98"
        >
          <Plus size={14} />
          Create Department
        </button>
      </div>

      {/* Controllers: Search */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={15} />
          </span>
          <input 
            type="text"
            placeholder="Search departments by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono font-semibold">
          Showing {filteredDepts.length} of {departments.length} units
        </div>
      </div>

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map(dept => {
          const deptStaff = getDeptEmployees(dept.name);
          return (
            <div key={dept.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 border border-indigo-100/10 rounded-lg flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">{dept.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">ID: {dept.id}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed h-10">{dept.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Headcount</p>
                  <p className="text-sm font-black text-slate-800">{deptStaff.length} Employees</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleOpenView(dept)}
                    title="View details"
                    className="p-1.5 hover:bg-slate-50 border border-slate-100 hover:border-slate-300 text-slate-600 hover:text-indigo-600 rounded-lg transition-all"
                  >
                    <Eye size={13} />
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(dept)}
                    title="Edit description"
                    className="p-1.5 hover:bg-slate-50 border border-slate-100 hover:border-slate-300 text-slate-600 hover:text-emerald-600 rounded-lg transition-all"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    onClick={() => handleDelete(dept.id)}
                    title="Delete unit"
                    className="p-1.5 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals Portal Elements */}
      <AnimatePresence>
        {/* Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
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
                  <Building2 size={16} className="text-indigo-600" />
                  <h3 className="font-bold text-sm">Create New Department</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-slate-100 text-slate-450 rounded-lg">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Sales & Marketing"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Provide a detailed roadmap description of the business operational responsibilities..."
                    value={deptDescription}
                    onChange={(e) => setDeptDescription(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsCreateOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 text-slate-500 border border-slate-250 text-2xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white text-2xs font-extrabold rounded-lg select-none cursor-pointer"
                  >
                    Register Department
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && selectedDept && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
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
                  <Building2 size={16} className="text-indigo-600" />
                  <h3 className="font-bold text-sm">Edit Department Core</h3>
                </div>
                <button onClick={() => setIsEditOpen(false)} className="p-1 hover:bg-slate-100 text-slate-450 rounded-lg">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department Name</label>
                  <input 
                    type="text"
                    required
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={deptDescription}
                    onChange={(e) => setDeptDescription(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsEditOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 text-slate-500 border border-slate-250 text-2xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white text-2xs font-extrabold rounded-lg cursor-pointer"
                  >
                    Update Values
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* View Details Modal */}
        {isViewOpen && selectedDept && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewOpen(false)}
              className="absolute inset-0 bg-slate-950" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <Building2 size={16} className="text-indigo-600" />
                  <h3 className="font-bold text-sm">Department Overview: {selectedDept.name}</h3>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-1 hover:bg-slate-100 text-slate-450 rounded-lg">
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Roadmap Mission</p>
                  <p className="text-xs text-slate-700 leading-normal font-medium">{selectedDept.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Headcount Count</p>
                    <p className="text-sm font-black text-slate-800">{getDeptEmployees(selectedDept.name).length} Active</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration Date</p>
                    <p className="text-sm font-black text-slate-800">{selectedDept.createdDate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Assigned Operations Staff</p>
                  <div className="border border-slate-100 rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {getDeptEmployees(selectedDept.name).length === 0 ? (
                      <div className="p-4 text-center text-slate-400 italic">
                        No employees currently assigned to this unit.
                      </div>
                    ) : (
                      getDeptEmployees(selectedDept.name).map(emp => (
                        <div key={emp.id} className="p-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/50">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate leading-none mb-0.5">{emp.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{emp.role}</p>
                            </div>
                          </div>
                          <span className="text-[9.5px] font-medium font-mono text-slate-500 shrink-0">
                            {emp.location}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsViewOpen(false)}
                  className="px-4 py-2 bg-indigo-600 text-white text-2xs font-bold rounded-lg cursor-pointer"
                >
                  Close Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
