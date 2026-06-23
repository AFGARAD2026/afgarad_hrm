import React, { useState } from 'react';
import { useHR } from '../../../app/providers/HRProvider';
import { Payroll } from '../../../types';
import { 
  DollarSign, 
  Trash2, 
  Search, 
  Plus, 
  Sliders, 
  Briefcase, 
  TrendingUp, 
  Calculator, 
  FileSpreadsheet,
  X,
  FileText,
  Printer,
  CalendarCheck,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface PayrollPageProps {
  initialSubView?: 'dashboard' | 'payslips';
}

export const PayrollPage: React.FC<PayrollPageProps> = ({ initialSubView = 'dashboard' }) => {
  const { payrolls, employees, addPayrollRecord, deletePayrollRecord } = useHR();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payslips'>(initialSubView);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<Payroll | null>(null);

  // Sync state if navigation changes
  React.useEffect(() => {
    setActiveTab(initialSubView);
  }, [initialSubView]);

  // Create payroll states
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState('June 2026');
  const [baseSalary, setBaseSalary] = useState('6500');
  const [overtime, setOvertime] = useState('0');
  const [deductions, setDeductions] = useState('250');
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');

  const handleOpenPay = () => {
    setEmployeeId('');
    setBaseSalary('6500');
    setOvertime('0');
    setDeductions('250');
    setIsPayOpen(true);
  };

  // Auto-fill base salary when employee selection changes
  const handleEmployeeChange = (empId: string) => {
    setEmployeeId(empId);
    const employee = employees.find(emp => emp.id === empId);
    if (employee) {
      setBaseSalary(employee.salary.toString());
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee || Number(baseSalary) <= 0) return;

    addPayrollRecord({
      employeeId: employee.id,
      employeeName: employee.name,
      month,
      baseSalary: Number(baseSalary),
      overtime: Number(overtime),
      deductions: Number(deductions),
      status
    });

    setIsPayOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this payroll disbursement ledger entry?')) {
      deletePayrollRecord(id);
    }
  };

  // Stats calculation
  const totalPayroll = payrolls.reduce((sum, rec) => sum + rec.netSalary, 0);
  const totalOvertimeCompensation = payrolls.reduce((sum, rec) => sum + rec.overtime, 0);
  const totalDeductions = payrolls.reduce((sum, rec) => sum + rec.deductions, 0);
  const averageSalary = payrolls.length > 0
    ? Math.round(payrolls.reduce((sum, rec) => sum + rec.baseSalary, 0) / payrolls.length)
    : 0;

  // Search filter
  const filteredPayrolls = payrolls.filter(rec => 
    rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section with trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payroll Administration</h2>
          <p className="text-xs text-slate-500">Calculate staff compensations, aggregate duty overtime and benefit deductions, and generate payslips</p>
        </div>
        <button 
          onClick={handleOpenPay}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold text-xs rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98"
        >
          <Plus size={14} />
          Generate Payslip Item
        </button>
      </div>

      {/* Sub tabs selector */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 text-xs font-semibold px-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-2.5 border-b-2 px-1 flex items-center gap-1.5 transition-all outline-hidden cursor-pointer ${
            activeTab === 'dashboard' 
            ? 'border-indigo-600 text-indigo-600 font-bold' 
            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase size={14} />
          Payroll Dashboard
        </button>
        <button
          onClick={() => setActiveTab('payslips')}
          className={`pb-2.5 border-b-2 px-1 flex items-center gap-1.5 transition-all outline-hidden cursor-pointer ${
            activeTab === 'payslips' 
            ? 'border-indigo-600 text-indigo-600 font-bold' 
            : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText size={14} />
          Payslips Ledger
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Corporate Payroll Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Total Payroll */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Payroll Cost</span>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400">${totalPayroll.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-medium">Net disbursed this month</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-955/25 text-rose-600 dark:text-rose-450 border border-rose-100/30 flex items-center justify-center shrink-0">
                <DollarSign size={18} />
              </div>
            </div>

            {/* Avg Salary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Average Base Salary</span>
                <p className="text-2xl font-black text-slate-800 dark:text-white">${averageSalary.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-medium">Standard staff package rate</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/25 flex items-center justify-center text-indigo-650 dark:text-indigo-400 border border-indigo-100/30 shrink-0">
                <Briefcase size={18} />
              </div>
            </div>

            {/* Overtime Compensation cost */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Overtime Compensation</span>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${totalOvertimeCompensation.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-medium">Aggregate bonus rewards</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/30 shrink-0">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Total tax deductions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="space-y-1 text-left">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Deductions / Taxes</span>
                <p className="text-2xl font-black text-slate-800 dark:text-white">${totalDeductions.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-medium font-semibold">Aggregated benefits/withholdings</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-100/30 shrink-0">
                <Sliders size={18} />
              </div>
            </div>
          </div>

          {/* Graphical Analytics card grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Disbursed Staff Salaries Overview</h3>
                <p className="text-[11px] text-slate-500">Distribution comparison of core salary package versus dynamic overtime rewards</p>
              </div>
              <div className="h-64 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={payrolls.slice(0, 8).map(p => ({
                      name: p.employeeName.split(' ')[0],
                      Salary: p.baseSalary,
                      Overtime: p.overtime
                    }))}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 650, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fontWeight: 650, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <ChartTooltip 
                      contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
                      labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                      itemStyle={{ fontSize: '10px' }}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                    <Bar dataKey="Salary" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={14} />
                    <Bar dataKey="Overtime" fill="#10b981" radius={[4, 4, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Settle Quality Ratios</h3>
                <p className="text-[11px] text-slate-500">Breakdown index of finalized bank transitions versus pending items</p>
              </div>
              <div className="h-64 flex items-center justify-center relative text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Fully Settled / Paid', value: payrolls.filter(p => p.status === 'Paid').length },
                        { name: 'Pending Items', value: payrolls.filter(p => p.status === 'Pending').length }
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconSize={8} 
                      formatter={(value) => <span className="text-2xs font-semibold text-slate-600 dark:text-slate-350">{value}</span>} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider leading-none">Total Entries</span>
                  <p className="text-lg font-black text-slate-800 dark:text-white leading-none mt-1">{payrolls.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Payslips List Table panel */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Search header controllers */}
          <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-805/30">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search size={14} />
              </span>
              <input 
                type="text"
                placeholder="Search payrolls by employee name or period month..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 dark:text-white rounded-lg focus:outline-hidden"
              />
            </div>
            <div className="text-xs text-slate-550 font-semibold flex items-center gap-1 font-mono dark:text-slate-350 hidden sm:flex">
              <FileSpreadsheet size={13} className="text-slate-400" />
              <span>Count: {filteredPayrolls.length} payroll lines</span>
            </div>
          </div>

          {/* Table proper */}
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Base Package ($)</th>
                  <th className="py-3 px-4">Bonus / Overtime ($)</th>
                  <th className="py-3 px-4">Deductions ($)</th>
                  <th className="py-3 px-4">Net Payout ($)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-left">
                {filteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-450 italic">
                      No payroll payslip lines matched. Click "Generate Payslip Item" to make one.
                    </td>
                  </tr>
                ) : (
                  filteredPayrolls.map((rec) => {
                    const statusStyles = 
                      rec.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' :
                      'bg-amber-50 text-amber-705 border-amber-100 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30';

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{rec.employeeName}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold mt-0.5">ID: {rec.employeeId}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{rec.month}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-600 dark:text-slate-400">${rec.baseSalary.toLocaleString()}</td>
                        <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">+${rec.overtime.toLocaleString()}</td>
                        <td className="py-3 px-4 text-rose-500 font-mono font-bold">-${rec.deductions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-900 dark:text-white font-black text-sm">${rec.netSalary.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 border rounded-md font-bold text-[9px] uppercase tracking-wider ${statusStyles}`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1 justify-end w-full">
                            <button
                              onClick={() => setSelectedPayslip(rec)}
                              title="View Pay Stub receipt details"
                              className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-105 dark:border-slate-800 text-slate-500 hover:text-indigo-600 rounded-lg transition-all cursor-pointer"
                            >
                              <FileText size={12} />
                            </button>
                            <button 
                              onClick={() => handleDelete(rec.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-955 border border-slate-100/40 dark:border-slate-800 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                              title="Delete entry"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer aggregate info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 rounded-b-xl">
            <span>Enterprise compliance ledger active</span>
            <span className="font-semibold text-rose-650 dark:text-rose-450 font-mono">Total sum net pay output: ${totalPayroll.toLocaleString()}</span>
          </div>

        </div>
      )}

      {/* Model Payroll Generator Portal Dialog */}
      <AnimatePresence>
        {isPayOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPayOpen(false)}
              className="absolute inset-0 bg-slate-950" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Calculator size={16} className="text-indigo-650" />
                  <h3 className="font-bold text-sm">Disburse Payroll Pay Stub</h3>
                </div>
                <button onClick={() => setIsPayOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 rounded-lg cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee Profile</label>
                  <select 
                    required
                    value={employeeId}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">Select an employee...</option>
                    {employees.filter(emp => emp.status !== 'Terminated').map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payroll Period</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. June 2026"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-705 bg-transparent dark:text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Base Package ($)</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-705 bg-transparent dark:text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overtime Bonus ($)</label>
                    <input 
                      type="number"
                      required
                      min={0}
                      value={overtime}
                      onChange={(e) => setOvertime(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-705 bg-transparent dark:text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deductions / Taxes ($)</label>
                    <input 
                      type="number"
                      required
                      min={0}
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-705 bg-transparent dark:text-white rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disbursement Quality</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Paid' | 'Pending')}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 dark:text-white rounded-lg focus:outline-hidden cursor-pointer"
                  >
                    <option value="Paid">Disbursed / Paid (Settled)</option>
                    <option value="Pending">Awaiting Bank Settlement</option>
                  </select>
                </div>

                {/* Live math result review */}
                <div className="bg-slate-50 dark:bg-slate-805/50 border border-slate-100 dark:border-slate-800 p-3 rounded-lg flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-450">Calculated Net Payout</span>
                  <span className="font-black text-rose-650 dark:text-rose-400 text-sm">
                    ${(Number(baseSalary) + Number(overtime) - Number(deductions)).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsPayOpen(false)}
                    className="px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350 border border-slate-250 dark:border-slate-700 text-2xs font-bold rounded-lg cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white text-2xs font-extrabold rounded-lg select-none cursor-pointer"
                  >
                    Commit & Issue Payslip
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {selectedPayslip && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPayslip(null)}
              className="absolute inset-0 bg-slate-950" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative z-10"
            >
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
                    <Sliders size={14} />
                    <span>Orbital Global Labs</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Official Earnings Statement</h3>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Ledger Stamp: {selectedPayslip.id.toUpperCase().slice(-8)}</div>
                </div>
                <button onClick={() => setSelectedPayslip(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 rounded-lg cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              {/* Personnel specs grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-805/40 p-3 rounded-lg border border-slate-100 dark:border-slate-805">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Employee Profile</span>
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">{selectedPayslip.employeeName}</div>
                  <div className="font-mono text-[9px] text-slate-450">ID: {selectedPayslip.employeeId}</div>
                </div>
                <div className="space-y-1 border-l border-slate-200 dark:border-slate-750 pl-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Payroll Period</span>
                  <div className="font-extrabold text-slate-855 dark:text-slate-300 flex items-center gap-1 font-sans">
                     <CalendarCheck size={12} className="text-indigo-500 inline mr-1" />
                    {selectedPayslip.month}
                  </div>
                  <div className="font-mono text-[9px] text-slate-400 uppercase">Direct Deposit</div>
                </div>
              </div>

              {/* Earnings Breakdown */}
              <div className="space-y-3">
                <h4 className="text-[9px] uppercase font-black tracking-wider text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-850">Statement breakdown</h4>
                
                <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>Base Contract Salary</span>
                  </div>
                  <span className="font-bold font-mono">${selectedPayslip.baseSalary.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-bold">Overtime Hours Premium</span>
                  </div>
                  <span className="font-extrabold font-mono">+${selectedPayslip.overtime.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-rose-550 dark:text-rose-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="font-bold">Deductions & Benefits Withholdings</span>
                  </div>
                  <span className="font-extrabold font-mono">-${selectedPayslip.deductions.toLocaleString()}</span>
                </div>
              </div>

              {/* Totals panel */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">Net payout</span>
                  <div className="text-2xl font-black text-rose-650 dark:text-rose-400">${selectedPayslip.netSalary.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm border bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-150 dark:border-emerald-900/30 font-mono tracking-wider">
                    {selectedPayslip.status === 'Paid' ? 'Settled / Paid' : 'Awaiting Settlement'}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">Sent to processing node</p>
                </div>
              </div>

              {/* Printable footer triggers */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => alert('Printing pay stub... System generated PDF dispatched to queue.')}
                  className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-2xs font-bold rounded-lg cursor-pointer flex items-center gap-1 bg-transparent"
                >
                  <Printer size={12} />
                  Print Statement
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedPayslip(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white text-2xs font-extrabold rounded-lg select-none cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
