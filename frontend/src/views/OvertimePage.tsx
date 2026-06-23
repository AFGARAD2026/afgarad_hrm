import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Overtime } from '../types';
import { 
  Clock, 
  Trash2, 
  Search, 
  Plus, 
  DollarSign, 
  Hourglass, 
  Activity, 
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OvertimePage: React.FC = () => {
  const { overtimes, employees, addOvertimeRecord, deleteOvertimeRecord } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create overtimes dialog form states
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('2026-06-21');
  const [hours, setHours] = useState('4');
  const [rate, setRate] = useState('45'); // Standard premium overtime rate USD/hr
  const [purpose, setPurpose] = useState('');

  const handleOpenLog = () => {
    setEmployeeId('');
    setPurpose('');
    setIsLogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee || !purpose.trim() || Number(hours) <= 0 || Number(rate) <= 0) return;

    addOvertimeRecord({
      employeeId: employee.id,
      employeeName: employee.name,
      date,
      hours: Number(hours),
      rate: Number(rate),
      purpose: purpose.trim()
    });

    setIsLogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this overtime entry?')) {
      deleteOvertimeRecord(id);
    }
  };

  // Stats calculation
  const totalOvertimeHours = overtimes.reduce((sum, rec) => sum + rec.hours, 0);
  const totalOvertimeCost = overtimes.reduce((sum, rec) => sum + rec.amount, 0);
  const averageHourlyRate = overtimes.length > 0 
    ? Math.round(totalOvertimeCost / totalOvertimeHours)
    : 45;

  // Search filter
  const filteredOvertimes = overtimes.filter(rec => 
    rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header section with trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Overtime Tracking System</h2>
          <p className="text-xs text-slate-500">Log excessive hours worked, calculate hourly premium costs, and audit special tasks reports</p>
        </div>
        <button 
          onClick={handleOpenLog}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98"
        >
          <Plus size={14} />
          Log Overtime Hours
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Overtime Hours */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Excessive Hours</span>
            <p className="text-2xl font-black text-slate-800 tracking-tight">{totalOvertimeHours} Hrs</p>
            <p className="text-[10px] text-slate-500 font-medium">Aggregated excess periods log</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/30 flex items-center justify-center shrink-0">
            <Hourglass size={18} />
          </div>
        </div>

        {/* Total Overtime Cost */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Excess Labor Cost</span>
            <p className="text-2xl font-black text-slate-800 tracking-tight">${totalOvertimeCost.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium">Accumulated premium payments</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/30 flex items-center justify-center shrink-0">
            <DollarSign size={18} />
          </div>
        </div>

        {/* Average Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Average Premium Hourly Rate</span>
            <p className="text-2xl font-black text-slate-850 tracking-tight">${averageHourlyRate}/Hr</p>
            <p className="text-[10px] text-slate-500 font-medium">Industry operational benchmark</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100/30 flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      {/* Overtime Logs List table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
        
        {/* Search header controllers */}
        <div className="p-4 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Search size={14} />
            </span>
            <input 
              type="text"
              placeholder="Search overtime entries by employee name or project description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white"
            />
          </div>
          <div className="text-xs text-slate-500 font-mono font-semibold">
            Count: {filteredOvertimes.length} entries
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4">Excess Hours</th>
                <th className="py-3 px-4">Hourly Rate</th>
                <th className="py-3 px-4">Sum Amount</th>
                <th className="py-3 px-4">Operating Justification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOvertimes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-450 italic">
                    No overtime records found. Select "Log Overtime Hours" above.
                  </td>
                </tr>
              ) : (
                filteredOvertimes.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{rec.employeeName}</td>
                    <td className="py-3 px-4 font-mono text-[10.5px] text-slate-500">{rec.date}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">{rec.hours} Hrs</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">${rec.rate}/hr</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 text-sm">${rec.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium italic truncate max-w-xs" title={rec.purpose}>
                      "{rec.purpose}"
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span>Enterprise premium calculations</span>
          <span className="font-semibold text-amber-600">Sum total hours logged: {totalOvertimeHours} Hrs</span>
        </div>

      </div>

      {/* Model Log Portal Dialog */}
      <AnimatePresence>
        {isLogOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogOpen(false)}
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
                  <Hourglass size={16} className="text-amber-500" />
                  <h3 className="font-bold text-sm">Log Employee Overtime</h3>
                </div>
                <button onClick={() => setIsLogOpen(false)} className="p-1 hover:bg-slate-100 text-slate-450 rounded-lg">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Profile</label>
                  <select 
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select an employee...</option>
                    {employees.filter(emp => emp.status !== 'Terminated').map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
                    <input 
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Premium Hourly Rate ($)</label>
                    <input 
                      type="number"
                      required
                      min={15}
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours Worked</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      max={24}
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Justification</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Provide details about the special operational task, deployment downtime, or critical campaign..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsLogOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 text-slate-500 border border-slate-250 text-2xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 mt-0 text-white text-2xs font-extrabold rounded-lg select-none cursor-pointer"
                  >
                    Log Overtime Block
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
