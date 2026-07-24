import React, { useState, useMemo } from "react";
import { useHR } from "../../../app/providers/HRProvider";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  X,
  CalendarCheck,
  UserX,
  BarChart as BarChartIcon,
  List as ListIcon,
  TrendingUp,
  ChevronDown,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
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
  Line,
} from "recharts";

interface AttendancePageProps {
  initialSubView?: "records" | "reports";
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  initialSubView = "records",
}) => {
  const { attendances, employees, addAttendanceRecord } = useHR();
  const [activeTab, setActiveTab] = useState<"attendance" | "statistics">(
    initialSubView === "reports" ? "statistics" : "attendance",
  );

  // Sync state if initialSubView changes
  React.useEffect(() => {
    setActiveTab(initialSubView === "reports" ? "statistics" : "attendance");
  }, [initialSubView]);

  // Calendar / Matrix states
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(2); // 0 = Jan, 1 = Feb, 2 = March
  const [selectedDay, setSelectedDay] = useState<number>(7); // Highlighted day column 07 as in image

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");

  // Interactive matrix overrides state: key = `${empId}_${day}` -> 'Present' | 'Absent'
  const [cellOverrides, setCellOverrides] = useState<
    Record<string, "Present" | "Absent">
  >({});

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const allMatrixEmployees = useMemo(() => {
    const systemMapped = employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      department: e.department,
    }));

    return systemMapped.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept =
        selectedDeptFilter === "All" || emp.department === selectedDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDeptFilter]);

  // Number of days in selected month (e.g., March = 31)
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
  }, [selectedYear, selectedMonthIndex]);

  const daysList = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Month Navigation
  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonthIndex((prev) => prev + 1);
    }
  };

  // Status helper for matrix cells
  const getCellStatus = (
    empId: string,
    empName: string,
    day: number,
  ): "Present" | "Absent" => {
    const key = `${empId}_${day}`;
    if (cellOverrides[key]) {
      return cellOverrides[key];
    }

    // Check if system attendance record exists
    const dayStr = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const sysRec = attendances.find(
      (a) =>
        (a.employeeId === empId ||
          a.employeeName.toLowerCase() === empName.toLowerCase()) &&
        a.date === dayStr,
    );

    if (sysRec) {
      if (sysRec.status === "Present" || sysRec.status === "Late")
        return "Present";
      if (sysRec.status === "Absent") return "Absent";
    }

    return "Present";
  };

  // Cell click toggle
  const handleCellClick = (empId: string, empName: string, day: number) => {
    const currentStatus = getCellStatus(empId, empName, day);
    const nextStatus: "Present" | "Absent" =
      currentStatus === "Present" ? "Absent" : "Present";

    setCellOverrides((prev) => ({
      ...prev,
      [`${empId}_${day}`]: nextStatus,
    }));
  };

  // Stats calculation for header
  const totalEmployeesCount = allMatrixEmployees.length;
  const presentCountOnSelectedDay = allMatrixEmployees.filter(
    (emp) => getCellStatus(emp.id, emp.name, selectedDay) === "Present",
  ).length;
  const absentCountOnSelectedDay = allMatrixEmployees.filter(
    (emp) => getCellStatus(emp.id, emp.name, selectedDay) === "Absent",
  ).length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Sub-Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Sub-Tabs: Attendance | Statistics */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`relative pb-1 text-sm font-bold transition-all cursor-pointer ${
                activeTab === "attendance"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Attendance
              {activeTab === "attendance" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-3.25 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("statistics")}
              className={`relative pb-1 text-sm font-bold transition-all cursor-pointer ${
                activeTab === "statistics"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Statistics
              {activeTab === "statistics" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-3.25 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Quick Search & Actions on Top Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search personnel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Toolbar: Month Navigation & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          {/* Month Selector: < > March */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-300 transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-300 transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
              {MONTH_NAMES[selectedMonthIndex]} {selectedYear}
            </h3>
          </div>

          {/* Left filters: Names / Dept dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer focus:outline-hidden"
              >
                <option value="All">Names (All Departments)</option>
                <option value="Design">Design</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="HR & Operations">HR & Operations</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            <div className="text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>
                Day {String(selectedDay).padStart(2, "0")}:{" "}
                <strong className="text-slate-700 dark:text-slate-200">
                  {presentCountOnSelectedDay} Present
                </strong>{" "}
                / {absentCountOnSelectedDay} Absent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab View Display */}
      {activeTab === "attendance" ? (
        /* ATTENDANCE RECORDING MATRIX GRID */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-4 relative">
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[237.5] relative">
              {/* Matrix Table Header */}
              <div className="grid grid-cols-[180px_repeat(31,minmax(32px,1fr))] items-center border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-semibold text-slate-400">
                <div className="pl-3 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>Names</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </div>

                {daysList.map((day) => {
                  const dayPadded = String(day).padStart(2, "0");
                  const isHighlighted = day === selectedDay;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`text-center py-1 cursor-pointer transition-all rounded-lg select-none ${
                        isHighlighted
                          ? "text-indigo-600 font-extrabold text-sm"
                          : "hover:text-slate-700 dark:hover:text-slate-200 text-slate-400"
                      }`}
                    >
                      {dayPadded}
                    </div>
                  );
                })}
              </div>

              {/* Matrix Rows Container */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 relative pt-2">
                {allMatrixEmployees.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 italic text-xs">
                    No matching personnel found in this department or filter.
                  </div>
                ) : (
                  allMatrixEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="grid grid-cols-[180px_repeat(31,minmax(32px,1fr))] items-center py-3 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors text-xs font-medium"
                    >
                      {/* Employee Name Column */}
                      <div className="pl-3 truncate font-semibold text-slate-800 dark:text-slate-200 z-20">
                        {emp.name}
                      </div>

                      {/* Days Status Cells */}
                      {daysList.map((day) => {
                        const status = getCellStatus(emp.id, emp.name, day);
                        const isHighlightedColumn = day === selectedDay;

                        return (
                          <div
                            key={day}
                            onClick={() => {
                              setSelectedDay(day);
                              handleCellClick(emp.id, emp.name, day);
                            }}
                            className={`flex items-center justify-center h-7 cursor-pointer transition-all z-20 ${
                              isHighlightedColumn ? "font-bold" : ""
                            }`}
                            title={`Click to toggle status for ${emp.name} on Day ${day}`}
                          >
                            {status === "Present" ? (
                              <Check
                                size={15}
                                strokeWidth={2.8}
                                className={
                                  isHighlightedColumn
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-indigo-500/80 dark:text-indigo-400/80"
                                }
                              />
                            ) : (
                              <X
                                size={15}
                                strokeWidth={2.8}
                                className="text-orange-500 dark:text-orange-400"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Matrix Footer Legend & Quick Controls */}
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 font-bold">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span>Present / On Time</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500 font-bold">
                  <X size={13} strokeWidth={3} />
                </div>
                <span>Absent / Exception</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Click any cell or day column header to highlight or toggle
              attendance logs.
            </div>
          </div>
        </div>
      ) : (
        /* STATISTICS & ANALYTICS REPORT TAB */
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Breakdown Pie Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Attendance Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Monthly breakdown of present shift rates vs absences
                </p>
              </div>

              <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Present",
                          value: presentCountOnSelectedDay || 8,
                          fill: "#6366f1",
                        },
                        {
                          name: "Absent",
                          value: absentCountOnSelectedDay || 2,
                          fill: "#f97316",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#6366f1" />
                      <Cell fill="#f97316" />
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Attendance Rate
                  </span>
                  <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                    {Math.round(
                      (presentCountOnSelectedDay / (totalEmployeesCount || 1)) *
                        100,
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Department Compliance Rates Bar Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Department Compliance Rates
                </h3>
                <p className="text-xs text-slate-400">
                  Scheduled personnel vs actual check-ins per department
                </p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      "Design",
                      "Engineering",
                      "Product",
                      "HR & Operations",
                      "Sales",
                      "Marketing",
                    ].map((dept) => {
                      const deptEmps = allMatrixEmployees.filter(
                        (e) => e.department === dept,
                      );
                      const presentInDept = deptEmps.filter(
                        (e) =>
                          getCellStatus(e.id, e.name, selectedDay) ===
                          "Present",
                      ).length;
                      return {
                        name: dept.split(" ")[0],
                        "Total Headcount": deptEmps.length || 1,
                        "Checked In": presentInDept,
                      };
                    })}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                      className="dark:stroke-slate-800"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip
                      contentStyle={{
                        background: "#0f172a",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    />
                    <Legend
                      iconSize={8}
                      wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
                    />
                    <Bar
                      dataKey="Total Headcount"
                      fill="#cbd5e1"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                    />
                    <Bar
                      dataKey="Checked In"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 7-Day Trend Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Monthly Attendance Velocity
                </h3>
                <p className="text-xs text-slate-400">
                  7-Day moving average of present vs absent personnel
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-xl">
                <TrendingUp size={14} />
                <span>94.2% Month-to-Date On-Time Rate</span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[1, 2, 3, 4, 5, 6, 7].map((day) => ({
                    day: `Day 0${day}`,
                    Present: 8 + (day % 2),
                    Absent: day % 2,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                    className="dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    contentStyle={{
                      background: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Present"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Absent"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
