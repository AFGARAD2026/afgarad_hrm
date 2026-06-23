import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { LeaveType, LeaveRequest } from '../types';
import { 
  Calendar, 
  Check, 
  X, 
  Plus, 
  Clock, 
  Search, 
  CalendarCheck, 
  HeartPulse, 
  Baby, 
  Coins, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const leaveSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  type: z.enum(['Annual Leave', 'Sick Leave', 'Maternity/Paternity', 'Unpaid Leave', 'Study Leave']),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});

type LeaveFormInput = z.infer<typeof leaveSchema>;

interface LeaveTrackerProps {
  isAddModalOpenFromApp: boolean;
  closeAddModalFromApp: () => void;
}

export const LeaveTracker: React.FC<LeaveTrackerProps> = ({
  isAddModalOpenFromApp,
  closeAddModalFromApp
}) => {
  const { employees, leaveRequests, submitLeaveRequest, approveLeaveRequest, rejectLeaveRequest } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveFormInput>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      type: 'Annual Leave'
    }
  });

  const onSubmit = (data: LeaveFormInput) => {
    const matchedEmployee = employees.find(e => e.id === data.employeeId);
    if (!matchedEmployee) return;

    submitLeaveRequest({
      employeeId: data.employeeId,
      employeeName: matchedEmployee.name,
      employeeAvatar: matchedEmployee.avatar,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason
    });

    setIsNewRequestOpen(false);
    closeAddModalFromApp();
    reset();
  };

  // Watch for external modal open requests from dashboard
  React.useEffect(() => {
    if (isAddModalOpenFromApp) {
      setIsNewRequestOpen(true);
    }
  }, [isAddModalOpenFromApp]);

  const handleCloseModal = () => {
    setIsNewRequestOpen(false);
    closeAddModalFromApp();
  };

  // Calculate Metrics
  const activeLeaves = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingRequests = leaveRequests.filter(l => l.status === 'Pending').length;

  // Filter requests
  const filteredRequests = leaveRequests.filter(req => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === 'All' || req.status === selectedFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Leave Balances Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Annual Time-off</span>
            <p className="text-2xl font-bold text-slate-900">25 Days / yr</p>
            <p className="text-[10px] text-slate-500">Standard salaried entitlement</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/30">
            <Compass size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Medical Leave</span>
            <p className="text-2xl font-bold text-slate-900">10 Days / yr</p>
            <p className="text-[10px] text-slate-500">Full base Salary paid sick days</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/30">
            <HeartPulse size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Parental Care</span>
            <p className="text-2xl font-bold text-slate-900">12 Weeks</p>
            <p className="text-[10px] text-slate-500">Maternity & Paternity package</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 border border-pink-100/30">
            <Baby size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Leaves Out today</span>
            <p className="text-2xl font-bold text-indigo-600">{activeLeaves} Active</p>
            <p className="text-[10px] text-slate-500">{pendingRequests} Pending validation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/30">
            <CalendarCheck size={20} />
          </div>
        </div>
      </div>

      {/* Directory controllers and search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search request tracking by employee name, type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map((filt) => (
            <button
              key={filt}
              onClick={() => setSelectedFilter(filt as any)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                selectedFilter === filt 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filt}
            </button>
          ))}

          <button 
            onClick={() => setIsNewRequestOpen(true)}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-sm shadow-indigo-200 hover:scale-101 active:scale-99 transition-all shrink-0 ml-1.5"
          >
            <Plus size={14} />
            File Time-off
          </button>
        </div>
      </div>

      {/* Leave request lists */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-55/40 border-b border-slate-100">
                <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Employee Details</th>
                <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Leave Type</th>
                <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Target Duration</th>
                <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Net Days</th>
                <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Stated Reason</th>
                <th className="p-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Status</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    No compliant leave request tracking files registered on directory filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const statusColors = 
                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-all">
                      {/* Name card */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={req.employeeAvatar} 
                            alt={req.employeeName} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{req.employeeName}</p>
                            <p className="text-[9.5px] text-slate-400 font-mono">ID: {req.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-4 text-xs font-semibold text-slate-700">{req.type}</td>

                      {/* Dates */}
                      <td className="p-4 text-xs font-medium text-slate-500">
                        {req.startDate} <span className="text-slate-300">to</span> {req.endDate}
                      </td>

                      {/* Total Net Days */}
                      <td className="p-4 text-xs font-extrabold text-slate-800">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>

                      {/* Reasons */}
                      <td className="p-4 text-xs text-slate-600 italic max-w-xs truncate" title={req.reason}>
                        "{req.reason}"
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`text-[9.5px] px-2 py-0.5 border rounded-md font-semibold ${statusColors}`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Admin Actions */}
                      <td className="p-4 text-right">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <button 
                              onClick={() => approveLeaveRequest(req.id)}
                              className="w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-xs"
                              title="Approve leave"
                            >
                              <Check size={13} />
                            </button>
                            <button 
                              onClick={() => rejectLeaveRequest(req.id)}
                              className="w-7 h-7 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95"
                              title="Reject request"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide Drawer: Submit Leave Form Modal */}
      <AnimatePresence>
        {isNewRequestOpen && (
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
                    <h3 className="text-sm font-extrabold text-slate-900">Request Time-off Validation</h3>
                    <button 
                      type="button"
                      onClick={handleCloseModal}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Register a formal leave/absence file into pending review status. Absence balances will adapt on approval.
                  </p>

                  <div className="space-y-4">
                    {/* Select Employee */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Employee Profile</label>
                      <select 
                        {...register('employeeId')}
                        className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                      >
                        <option value="">-- Choose Employee --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                      </select>
                      {errors.employeeId && <p className="text-[10px] text-rose-500">{errors.employeeId.message}</p>}
                    </div>

                    {/* Leave Category */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Category of Absence</label>
                      <select 
                        {...register('type')}
                        className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                      >
                        <option value="Annual Leave">Annual Leave (Vacation)</option>
                        <option value="Sick Leave">Sick Leave (Medical Absence)</option>
                        <option value="Maternity/Paternity">Maternity/Paternity</option>
                        <option value="Unpaid Leave">Unpaid Leave</option>
                        <option value="Study Leave">Study Leave / Academic</option>
                      </select>
                    </div>

                    {/* Start & End Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Absence Start Date</label>
                        <input 
                          type="date"
                          {...register('startDate')}
                          className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        />
                        {errors.startDate && <p className="text-[10px] text-rose-500">{errors.startDate.message}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Absence End Date</label>
                        <input 
                          type="date"
                          {...register('endDate')}
                          className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        />
                        {errors.endDate && <p className="text-[10px] text-rose-500">{errors.endDate.message}</p>}
                      </div>
                    </div>

                    {/* Stated Reason */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Administrative Stated Reason</label>
                      <textarea 
                        rows={3}
                        placeholder="e.g. Booking flights for summer break. Confirm coverage with team lead."
                        {...register('reason')}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.reason && <p className="text-[10px] text-rose-500">{errors.reason.message}</p>}
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
                    Submit Leave Files
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
