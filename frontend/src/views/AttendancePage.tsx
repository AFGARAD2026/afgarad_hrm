import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Attendance } from '../types';
import { 
  Clock, 
  Search, 
  CalendarCheck, 
  UserPlus, 
  Filter, 
  UserX, 
  Activity, 
  MapPin, 
  ArrowUpRight,
  Plus,
  BarChart as BarChartIcon,
  List as ListIcon,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
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
  Cell, 
  LineChart, 
  Line 
} from 'recharts';

interface AttendancePageProps {
  initialSubView?: 'records' | 'reports';
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ initialSubView = 'records' }) => {
  const { attendances, employees, addAttendanceRecord } = useHR();
  const [activeTab, setActiveTab] = useState<'records' | 'reports'>(initialSubView);
  
  // Sync state if sidebar navigation triggers change
  React.useEffect(() => {
    setActiveTab(initialSubView);
  }, [initialSubView]);

  // Filtering states
  const [selectedDate, setSelectedDate] = useState('2026-06-21');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchEmployee, setSearchEmployee] = useState('');
  
  // Quick Clock-in states
  const [clockInEmployeeId, setClockInEmployeeId] = useState('');
  const [clockStatus, setClockStatus] = useState<'Present' | 'Late'>('Present');
  const [clockCheckIn, setClockCheckIn] = useState('09:00 AM');
  const [clockCheckOut, setClockCheckOut] = useState('05:30 PM');

  // Math conversions
  const handleClockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === clockInEmployeeId);
    if (!employee) return;

    // Parse worked hours
    const parsedHrs = 8.5; // Mock standard hours worked

    addAttendanceRecord({
      employeeId: employee.id,
      employeeName: employee.name,
      date: new Date().toISOString().split('T')[0],
      checkIn: clockCheckIn,
      checkOut: clockCheckOut === '' ? '--:--' : clockCheckOut,
      hoursWorked: clockCheckOut === '' ? 0 : parsedHrs,
      status: clockStatus,
      department: employee.department
    });

    setClockInEmployeeId('');
  };

  // 1. Calculate stats based on selected date
  const selectedDateRecords = attendances.filter(rec => rec.date === selectedDate);
  const totalInScope = employees.filter(e => e.status !== 'Terminated');
  
  const presentToday = selectedDateRecords.filter(rec => rec.status === 'Present').length;
  const lateToday = selectedDateRecords.filter(rec => rec.status === 'Late').length;
  const absentToday = totalInScope.length - (presentToday + lateToday);
  
  // Calculate average worked hours of present people
  const recordsWithHours = selectedDateRecords.filter(rec => rec.hoursWorked > 0);
  const averageHours = recordsWithHours.length > 0
    ? (recordsWithHours.reduce((sum, rec) => sum + rec.hoursWorked, 0) / recordsWithHours.length).toFixed(1)
    : '8.0';

  // Apply visual lists filters
  const filteredRecords = attendances.filter(rec => {
    const matchesDate = selectedDate === '' || rec.date === selectedDate;
    const matchesDept = selectedDept === 'All' || rec.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesEmp = rec.employeeName.toLowerCase().includes(searchEmployee.toLowerCase());
    return matchesDate && matchesDept && matchesEmp;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and statistics panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Attendance Dashboard</h2>
          <p className="text-xs text-slate-500">Corporate tracking node for timesheets, present tallies, and clock deviations</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:ring-1 focus:ring-indigo-500 font-mono font-semibold"
          />
        </div>
      </div>

      {/* Corporate Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Present Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Present Today</span>
            <p className="text-2xl font-black text-slate-900">{presentToday} Staff</p>
            <p className="text-[10px] text-slate-500 font-medium">Checked in on schedule</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/30">
            <CalendarCheck size={18} />
          </div>
        </div>

        {/* Absent Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Absent Today</span>
            <p className="text-2xl font-black text-slate-900">{absentToday} Staff</p>
            <p className="text-[10px] text-slate-500 font-medium">Out of office / Unnotified</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100/30">
            <UserX size={18} />
          </div>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Late Arrivals</span>
            <p className="text-2xl font-black text-amber-600">{lateToday} Staff</p>
            <p className="text-[10px] text-slate-500 font-medium">Lateness logs compiled</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/30">
            <Clock size={18} />
          </div>
        </div>

        {/* Average Working Hours */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Mean Shift length</span>
            <p className="text-2xl font-black text-rose-600">{averageHours} Hours</p>
            <p className="text-[10px] text-slate-500 font-medium">Aggregate shift duration</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100/30">
            <Activity size={18} />
          </div>
        </div>
      </div>

      {/* Modern Sub Tabs toggle */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold px-1">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-2.5 border-b-2 px-1 flex items-center gap-1.5 transition-all outline-hidden cursor-pointer ${
            activeTab === 'records' 
            ? 'border-indigo-650 text-indigo-650 font-bold' 
            : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ListIcon size={14} />
          Timesheet Logs & Records
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-2.5 border-b-2 px-1 flex items-center gap-1.5 transition-all outline-hidden cursor-pointer ${
            activeTab === 'reports' 
            ? 'border-indigo-650 text-indigo-650 font-bold' 
            : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChartIcon size={14} />
          Analytical Reports & Trends
        </button>
      </div>

      {activeTab === 'records' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Manual Terminal Block */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin size={16} className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Timesheet Regulator</h3>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Manually log check-in indices for active personnel or correct scheduled timesheets.
            </p>

            <form onSubmit={handleClockInSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">Employee Profile</label>
                <select 
                  required
                  value={clockInEmployeeId}
                  onChange={(e) => setClockInEmployeeId(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select an employee...</option>
                  {employees.filter(emp => emp.status !== 'Terminated').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">Arrival Quality</label>
                <select 
                  value={clockStatus}
                  onChange={(e) => setClockStatus(e.target.value as 'Present' | 'Late')}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="Present">Present (On Schedule)</option>
                  <option value="Late">Late Arrival Alert</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Check In</label>
                  <input 
                    type="text" 
                    value={clockCheckIn}
                    onChange={(e) => setClockCheckIn(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-hidden text-center font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Check Out</label>
                  <input 
                    type="text" 
                    value={clockCheckOut}
                    onChange={(e) => setClockCheckOut(e.target.value)}
                    placeholder="05:30 PM"
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-hidden text-center font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!clockInEmployeeId}
                className="w-full mt-2 inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 hover:shadow-sm text-white font-semibold text-2xs rounded-lg py-2 cursor-pointer transition-all active:scale-98"
              >
                <Plus size={12} />
                Commit Log Record
              </button>
            </form>
          </div>

          {/* Attendance Records Table */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
            
            {/* Filters Bar */}
            <div className="p-4 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 rounded-t-xl">
              <div className="relative flex-1 max-w-xs">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search size={14} />
                </span>
                <input 
                  type="text"
                  placeholder="Search by personnel..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-500">
                  <Filter size={12} />
                  <span>Dept Filter:</span>
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="border-none focus:outline-hidden font-bold text-slate-700 bg-transparent text-xs p-0 cursor-pointer"
                  >
                    <option value="All">All Departments</option>
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="HR & Operations">HR & Operations</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table proper */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Hours Worked</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                        No matching daily attendance timesheets found.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => {
                      const statusStyles = 
                        rec.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        rec.status === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100';

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{rec.employeeName}</div>
                            <div className="text-[9.5px] text-slate-400 uppercase tracking-wide font-mono mt-0.5">{rec.department}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[10.5px] font-semibold text-slate-650">{rec.date}</td>
                          <td className="py-3 px-4 font-mono text-[10.5px] font-medium text-slate-600">{rec.checkIn}</td>
                          <td className="py-3 px-4 font-mono text-[10.5px] font-medium text-slate-600">{rec.checkOut}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {rec.hoursWorked > 0 ? `${rec.hoursWorked} Hrs` : '--'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 border rounded-md font-bold text-[9px] uppercase tracking-wider ${statusStyles}`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer info */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-[10px] text-slate-500">
              <span>Corporate tracking operational</span>
              <span className="font-bold text-indigo-150">Total processed logs: {attendances.length}</span>
            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status Breakdown Pie Chart Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Status Breakdown Report</h3>
                <p className="text-[11px] text-slate-500">Distribution of shift present, late, and absent metrics for {selectedDate}</p>
              </div>
              <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present On-Time', value: presentToday, fill: '#10b981' },
                        { name: 'Late Arrivals', value: lateToday, fill: '#f59e0b' },
                        { name: 'Absent / Dynamic', value: absentToday > 0 ? absentToday : 0, fill: '#f43f5e' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconSize={8} 
                      formatter={(value) => <span className="text-2xs font-semibold text-slate-600">{value}</span>} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for metric value layout */}
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider leading-none">In Office</span>
                  <p className="text-lg font-black text-slate-800 leading-none mt-1">{presentToday + lateToday}</p>
                </div>
              </div>
            </div>

            {/* Department Attendance Rates Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Department Compliance Rates</h3>
                <p className="text-[11px] text-slate-500">Scheduled headcount vs actual checked-in counts by team unit</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={['Engineering', 'Design', 'Product', 'Marketing', 'HR & Operations', 'Sales'].map(dept => {
                      const totalInDept = employees.filter(e => e.department === dept && e.status !== 'Terminated').length;
                      const presentInDept = selectedDateRecords.filter(r => r.department === dept && (r.status === 'Present' || r.status === 'Late')).length;
                      return {
                        name: dept.split(' ')[0], // truncate name for space
                        'Total Scheduled': totalInDept,
                        'Checked In': presentInDept
                      };
                    })}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 650, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fontWeight: 650, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <ChartTooltip 
                      contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
                      labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                      itemStyle={{ fontSize: '10px' }}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                    <Bar dataKey="Total Scheduled" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="Checked In" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Overarching Daily Trends Line Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">7-Day Attendance Trend Registry</h3>
                <p className="text-[11px] text-slate-500">Historical chart mapping aggregate volume of checked-in staff over time</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <TrendingUp size={12} className="text-emerald-500" />
                <span>Standard Variance Index: OK</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Array.from(new Set(attendances.map(r => r.date))).sort().slice(-7).map((d: any) => {
                    const records = attendances.filter(r => r.date === d);
                    const present = records.filter(r => r.status === 'Present').length;
                    const late = records.filter(r => r.status === 'Late').length;
                    return {
                      date: String(d).slice(5), // truncate '2026-'
                      'On Time': present,
                      'Late': late
                    };
                  })}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 650, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 650, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <ChartTooltip 
                    contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff' }}
                    labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="On Time" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Late" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
