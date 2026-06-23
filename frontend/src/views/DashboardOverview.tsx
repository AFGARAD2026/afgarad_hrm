import React from 'react';
import { useHR } from '../context/HRContext';
import { 
  Users, 
  UserCheck, 
  CalendarClock, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Briefcase,
  FileText,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
  openLeaveModal: () => void;
  openEmployeeModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onNavigate, 
  openLeaveModal, 
  openEmployeeModal 
}) => {
  const { employees, leaveRequests, goals, departments, attendances, payrolls, overtimes } = useHR();

  // 1. Calculate Core 8 Metrics for Cards
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalDepartmentsCount = departments.length;
  
  // Attendance Today
  const totalAttendancesToday = attendances.length;
  const presentToday = attendances.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attendancePercentage = totalAttendancesToday > 0 
    ? Math.round((presentToday / totalAttendancesToday) * 100) 
    : 100;

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  // Payroll This Month (Sum of June Net Salary)
  const currentMonthPayroll = payrolls.reduce((acc, p) => acc + p.netSalary, 0);

  // Overtime Hours
  const totalOvertimeHours = overtimes.reduce((acc, o) => acc + o.hours, 0);

  // Performance Reviews
  const completedReviewsCount = goals.filter(g => g.status === 'Achieved').length;

  // 2. Headcount by Department (data for donut)
  const deptCount: { [key: string]: number } = {};
  employees.forEach(emp => {
    deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
  });
  
  const DONUT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
  const departmentData = Object.keys(deptCount).map((dept, index) => ({
    name: dept,
    value: deptCount[dept],
    color: DONUT_COLORS[index % DONUT_COLORS.length]
  }));

  // Emulate data for other charts
  // - Employee Growth over past 6 months
  const employeeGrowthData = [
    { month: 'Jan', Employees: Math.max(2, totalEmployees - 5) },
    { month: 'Feb', Employees: Math.max(3, totalEmployees - 4) },
    { month: 'Mar', Employees: Math.max(4, totalEmployees - 3) },
    { month: 'Apr', Employees: Math.max(6, totalEmployees - 2) },
    { month: 'May', Employees: Math.max(7, totalEmployees - 1) },
    { month: 'Jun', Employees: totalEmployees }
  ];

  // - Attendance rate over past 6 months
  const attendanceTrendData = [
    { month: 'Jan', rate: 96.5 },
    { month: 'Feb', rate: 95.8 },
    { month: 'Mar', rate: 98.2 },
    { month: 'Apr', rate: 97.4 },
    { month: 'May', rate: 96.0 },
    { month: 'Jun', rate: attendancePercentage }
  ];

  // - Payroll Summary over past 6 months (June has actual totals from state, rest is relative)
  const payrollSummaryData = [
    { month: 'Jan', Payroll: Math.round(currentMonthPayroll * 0.82) },
    { month: 'Feb', Payroll: Math.round(currentMonthPayroll * 0.85) },
    { month: 'Mar', Payroll: Math.round(currentMonthPayroll * 0.90) },
    { month: 'Apr', Payroll: Math.round(currentMonthPayroll * 0.94) },
    { month: 'May', Payroll: Math.round(currentMonthPayroll * 0.98) },
    { month: 'Jun', Payroll: currentMonthPayroll }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants} 
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-xl p-6 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Enterprise HR Command Overview</h1>
            <p className="text-slate-400 mt-1 max-w-xl text-xs leading-relaxed">
              System active. You currently manage <span className="text-indigo-400 font-semibold">{totalEmployees} employees</span> in <span className="text-indigo-400 font-semibold">{totalDepartmentsCount} departments</span>. There are {pendingLeaves} absence requests awaiting operational audit.
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <button 
              onClick={openLeaveModal}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg px-3.5 py-2.5 cursor-pointer transition-all active:scale-98 shadow-sm shadow-indigo-900/40"
            >
              <CalendarClock size={14} />
              Book Time-off
            </button>
            <button 
              onClick={openEmployeeModal}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-lg px-3.5 py-2.5 cursor-pointer transition-all active:scale-98 border border-slate-200"
            >
              <Plus size={14} />
              Onboard Employee
            </button>
          </div>
        </div>
      </motion.div>

      {/* 8 Metric Cards Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Total Headcount</span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{totalEmployees}</p>
            <p className="text-[10px] text-slate-500 font-medium">Registered profiles</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/30">
            <Users size={16} />
          </div>
        </div>

        {/* Card 2: Active Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Active Staff</span>
            <p className="text-2xl font-black text-emerald-600 tracking-tight">{activeEmployees}</p>
            <p className="text-[10px] text-slate-500 font-medium">Duty status active</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/30">
            <UserCheck size={16} />
          </div>
        </div>

        {/* Card 3: Departments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Departments</span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{totalDepartmentsCount}</p>
            <p className="text-[10px] text-slate-500 font-medium">Business units</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/30">
            <Building2 size={16} />
          </div>
        </div>

        {/* Card 4: Attendance Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Attendance Today</span>
            <p className="text-2xl font-black text-indigo-600 tracking-tight">{attendancePercentage}%</p>
            <p className="text-[10px] text-slate-500 font-medium">{presentToday} present today</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100/30">
            <Clock size={16} />
          </div>
        </div>

        {/* Card 5: Pending Leaves */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Pending Leaves</span>
            <p className={`text-2xl font-black tracking-tight ${pendingLeaves > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>{pendingLeaves}</p>
            <p className="text-[10px] text-slate-500 font-medium">Requires assessment</p>
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${pendingLeaves > 0 ? 'bg-amber-50 text-amber-600 border-amber-100/30' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            <CalendarClock size={16} />
          </div>
        </div>

        {/* Card 6: Payroll This Month */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Payroll Expense</span>
            <p className="text-2xl font-black text-rose-600 tracking-tight">${currentMonthPayroll.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium">This month payments</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100/30">
            <DollarSign size={16} />
          </div>
        </div>

        {/* Card 7: Overtime Hours */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Overtime Logged</span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{totalOvertimeHours} Hrs</p>
            <p className="text-[10px] text-slate-500 font-medium">Aggregated excess</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/30">
            <Plus size={16} />
          </div>
        </div>

        {/* Card 8: Performance Reviews */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Completed Targets</span>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{completedReviewsCount}</p>
            <p className="text-[10px] text-slate-500 font-medium">Satisfied KPI goals</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100/30">
            <ShieldCheck size={16} />
          </div>
        </div>
      </motion.div>

      {/* Charts Grid: Row 1 */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Chart 1: Employee Growth */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Employee Growth</h3>
              <p className="text-[11px] text-slate-400">Total verified personnel strength index over last 6 months</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
              <span className="px-2 py-0.5 text-[9px] bg-white rounded shadow-2xs font-extrabold text-slate-700 font-mono">2026</span>
            </div>
          </div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employeeGrowthData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="Employees" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Department Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">Department Distribution</h3>
            <p className="text-[11px] text-slate-400">Headcount spread segmenting core operations</p>
          </div>

          <div className="h-44 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Members`, 'Headcount']} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute text-center">
              <p className="text-xl font-extrabold text-slate-800">{totalEmployees}</p>
              <p className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Total Staff</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {departmentData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="text-[10px] text-slate-600 truncate font-semibold">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts Grid: Row 2 */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Chart 3: Attendance Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Attendance Trend</h3>
            <p className="text-[11px] text-slate-400">Company-wide mean attendance percentages month-over-month</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[90, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Payroll Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Payroll Summary</h3>
            <p className="text-[11px] text-slate-400">Aggregated operating costs for staff payroll (base + overtime)</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Total Paid']} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="Payroll" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Widgets & Quick Actions Grid Row */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {/* Widget 1: Recent Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Employees</h3>
            <p className="text-[10px] text-slate-400">Latest onboarded personnel records</p>
          </div>
          <div className="space-y-3.5 mt-4 flex-1">
            {employees.slice(0, 3).map((emp) => (
              <div key={emp.id} className="flex items-center gap-2.5">
                <img 
                  src={emp.avatar} 
                  alt={emp.name} 
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{emp.name}</p>
                  <p className="text-[9.5px] text-slate-500 truncate">{emp.role} • {emp.department}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('Directory')}
            className="w-full text-center mt-4 text-[10.5px] text-slate-500 hover:text-indigo-600 font-bold py-1.5 border-t border-slate-100 transition-all cursor-pointer"
          >
            Review Directory →
          </button>
        </div>

        {/* Widget 2: Recent Leave Requests */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Leave Requests</h3>
            <p className="text-[10px] text-slate-400">Absence requests awaiting approval</p>
          </div>
          <div className="space-y-3 mt-4 flex-1">
            {leaveRequests.filter(l => l.status === 'Pending').length === 0 ? (
              <div className="h-full py-8 flex flex-col items-center justify-center text-center text-slate-400">
                <CheckCircle className="text-emerald-500 mb-1" size={20} />
                <p className="text-[10px] font-bold text-slate-700">All Sorted Out</p>
                <p className="text-[9px] mt-0.5">No pending leaves.</p>
              </div>
            ) : (
              leaveRequests.filter(l => l.status === 'Pending').slice(0, 2).map((l) => (
                <div key={l.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <img src={l.employeeAvatar} className="w-5 h-5 rounded-full object-cover" alt={l.employeeName} referrerPolicy="no-referrer" />
                    <p className="text-[10.5px] font-bold text-slate-800 truncate">{l.employeeName}</p>
                  </div>
                  <p className="text-[9.5px] text-slate-500">{l.type} • {l.days} days</p>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => onNavigate('Leave')}
            className="w-full text-center mt-4 text-[10.5px] text-slate-500 hover:text-indigo-600 font-bold py-1.5 border-t border-slate-100 transition-all cursor-pointer"
          >
            Manage Requests →
          </button>
        </div>

        {/* Widget 3: Upcoming Reviews */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upcoming Reviews</h3>
            <p className="text-[10px] text-slate-400">Assigned KPI benchmarks trackers</p>
          </div>
          <div className="space-y-3.5 mt-4 flex-1">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="space-y-1 leading-none">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{goal.employeeName}</p>
                  <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-extrabold">{goal.progress}%</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{goal.title}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('Performance')}
            className="w-full text-center mt-4 text-[10.5px] text-slate-500 hover:text-indigo-600 font-bold py-1.5 border-t border-slate-100 transition-all cursor-pointer"
          >
            Review Performance →
          </button>
        </div>

        {/* Widget 4: Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
            <p className="text-[10px] text-slate-400">Direct shortcuts to enterprise nodes</p>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4 flex-1 justify-center">
            <button 
              onClick={() => onNavigate('Attendance')}
              className="flex items-center justify-between p-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/40 text-indigo-700 rounded-lg text-left text-2xs font-extrabold transition-all duration-150 cursor-pointer"
            >
              <span>Verify Attendances Today</span>
              <ArrowRight size={12} />
            </button>
            <button 
              onClick={() => onNavigate('Payroll')}
              className="flex items-center justify-between p-2.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/40 text-emerald-700 rounded-lg text-left text-2xs font-extrabold transition-all duration-150 cursor-pointer"
            >
              <span>Calculate Salaries / Payroll</span>
              <ArrowRight size={12} />
            </button>
            <button 
              onClick={() => onNavigate('Departments')}
              className="flex items-center justify-between p-2.5 bg-amber-50/50 hover:bg-amber-50 border border-amber-100/40 text-amber-700 rounded-lg text-left text-2xs font-extrabold transition-all duration-150 cursor-pointer"
            >
              <span>Configure Corporate Units</span>
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="pt-2 text-[9px] text-slate-400 font-medium text-center italic border-t border-slate-100 mt-2">
            Secure admin operational session
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
