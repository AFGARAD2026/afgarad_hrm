import React from "react";
import {
  Menu,
  Search,
  X,
  Calendar,
  Zap,
  Users,
  CalendarClock,
  Building2,
  BarChart3,
  Receipt,
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  profileDropdownOpen: boolean;
  setProfileDropdownOpen: (open: boolean) => void;
  quickActionsOpen: boolean;
  setQuickActionsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResultsOpen: boolean;
  setSearchResultsOpen: (open: boolean) => void;
  currentSystemTime: string;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notificationsCount: number;
  leaveRequests: any[];
  employees: any[];
  departments: any[];
  setActiveView: (view: any) => void;
  setAttendanceSubView?: (view: "records" | "reports") => void;
  setPayrollSubView?: (view: "dashboard" | "payslips") => void;
  setIsAddEmployeeOpenFromDashboard?: (open: boolean) => void;
  setIsAddLeaveOpenFromDashboard?: (open: boolean) => void;
  setIsAddDeptOpenFromSidebar?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  setMobileMenuOpen,
  profileDropdownOpen,
  setProfileDropdownOpen,
  quickActionsOpen,
  setQuickActionsOpen,
  searchQuery,
  setSearchQuery,
  searchResultsOpen,
  setSearchResultsOpen,
  currentSystemTime,
  notificationsOpen,
  setNotificationsOpen,
  notificationsCount,
  leaveRequests,
  employees,
  departments,
  setActiveView,
  setAttendanceSubView,
  setPayrollSubView,
  setIsAddEmployeeOpenFromDashboard,
  setIsAddLeaveOpenFromDashboard,
  setIsAddDeptOpenFromSidebar,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userName = user?.fullName ?? user?.email ?? "Guest User";
  const userRoleTitle = user?.role ? user.role.replace(/_/g, " ") : "Guest";
  const userEmail = user?.email ?? "No email";

  // Local filtered search
  const filteredEmployeesForSearch =
    searchQuery.trim() === ""
      ? []
      : employees
          .filter(
            (e) =>
              e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.department.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5);

  const filteredDeptsForSearch =
    searchQuery.trim() === ""
      ? []
      : departments
          .filter(
            (d) =>
              d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (d.description &&
                d.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())),
          )
          .slice(0, 3);

  return (
    <header
      className={`sticky top-0 ${isDarkMode ? "bg-slate-900/95 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-955"} border-b z-35 px-4 lg:px-6 h-15 flex items-center justify-between shadow-xs shrink-0 transition-colors duration-300`}
    >
      {/* Left header group */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`p-1 px-1.5 border ${isDarkMode ? "border-slate-800 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-55 text-slate-600"} rounded-lg lg:hidden cursor-pointer`}
        >
          <Menu size={16} />
        </button>
        <div className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md">
            H
          </div>
          <div>
            <p
              className={`text-xs font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"} leading-none`}
            >
              Enterprise HRMS
            </p>
            <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">
              SaaS Administration Node
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar - Desktop Layout */}
      <div className="hidden md:block relative w-64 lg:w-96 mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search personnel, departments, reports..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border ${
              isDarkMode
                ? "bg-slate-800/80 border-slate-700 text-slate-100 focus:ring-1 focus:ring-indigo-505 placeholder-slate-450"
                : "bg-slate-50 border-slate-250 text-slate-900 focus:ring-1 focus:ring-indigo-505 placeholder-slate-400"
            } outline-none transition-all`}
          />
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-slate-400"
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResultsOpen(false);
              }}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Search Results Popover */}
        <AnimatePresence>
          {searchResultsOpen && searchQuery.trim() !== "" && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSearchResultsOpen(false)}
              ></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 5 }}
                className={`absolute left-0 mt-1.5 w-full ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80"
                    : "bg-white border-slate-200 text-slate-900 shadow-xl"
                } border rounded-xl overflow-hidden shadow-2xl z-50`}
              >
                {/* Employees section */}
                <div className="p-2 px-2.5 space-y-1">
                  <p className="text-[9px] uppercase font-bold text-slate-400 px-2 tracking-wider">
                    Matched Personnel
                  </p>
                  {filteredEmployeesForSearch.length === 0 ? (
                    <p className="text-[10px] text-slate-400 px-2 py-1.5 font-medium italic">
                      No personnel found
                    </p>
                  ) : (
                    filteredEmployeesForSearch.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          setActiveView("Directory");
                          setSearchQuery("");
                          setSearchResultsOpen(false);
                          toast.success(
                            `Viewing ${emp.name} profile in Directory`,
                          );
                        }}
                        className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg text-xs ${
                          isDarkMode
                            ? "hover:bg-slate-800 text-slate-300"
                            : "hover:bg-slate-50 text-slate-705"
                        } transition-all`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <UserCircle
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                          <span className="font-semibold truncate">
                            {emp.name}
                          </span>
                        </div>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.5 rounded ${
                            isDarkMode
                              ? "bg-slate-805 text-slate-400"
                              : "bg-slate-100 text-slate-550"
                          } font-medium tracking-tight shrink-0`}
                        >
                          {emp.department} • {emp.role}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                <div
                  className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                ></div>

                {/* Departments section */}
                <div className="p-2 px-2.5 space-y-1">
                  <p className="text-[9px] uppercase font-bold text-slate-400 px-2 tracking-wider">
                    Corporate Units
                  </p>
                  {filteredDeptsForSearch.length === 0 ? (
                    <p className="text-[10px] text-slate-400 px-2 py-1.5 font-medium italic">
                      No departments matched
                    </p>
                  ) : (
                    filteredDeptsForSearch.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setActiveView("Departments");
                          setSearchQuery("");
                          setSearchResultsOpen(false);
                          toast.success(`Navigated to ${d.name} unit`);
                        }}
                        className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg text-xs ${
                          isDarkMode
                            ? "hover:bg-slate-800 text-slate-350"
                            : "hover:bg-slate-50 text-slate-700"
                        } transition-all`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2
                            size={13}
                            className="text-slate-400 shrink-0"
                          />
                          <span className="font-semibold truncate">
                            {d.name}
                          </span>
                        </div>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono ${
                            isDarkMode
                              ? "bg-slate-800 text-teal-400"
                              : "bg-teal-50 text-teal-750"
                          } font-semibold shrink-0`}
                        >
                          {d.code || "DEPT"}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Global Live Date indicator */}
      <div
        className={`hidden lg:flex items-center gap-1.5 ${isDarkMode ? "text-slate-400 bg-slate-800/60 border-slate-800" : "text-slate-500 bg-slate-50 border-slate-100"} border px-3 py-1.5 rounded-xl`}
      >
        <Calendar
          size={12}
          className={isDarkMode ? "text-slate-500" : "text-slate-400"}
        />
        <span className="text-[10.5px] font-mono tracking-tight font-semibold">
          {currentSystemTime}
        </span>
      </div>

      {/* Right Notifications, Quick Toolbar, and user actions group */}
      <div className="flex items-center gap-2.5 lg:gap-3.5">
        {/* Quick Actions Panel */}
        <div className="relative">
          <button
            onClick={() => setQuickActionsOpen(!quickActionsOpen)}
            title="HR Quick Command Panel"
            className={`p-2 border ${
              isDarkMode
                ? "border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-indigo-400"
                : "border-slate-200 hover:bg-indigo-50/50 text-indigo-600 bg-indigo-50/20"
            } rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 font-bold text-xs`}
          >
            <Zap size={14} className="animate-pulse" />
            <span className="hidden md:inline text-[11px]">Quick Action</span>
          </button>

          <AnimatePresence>
            {quickActionsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setQuickActionsOpen(false)}
                ></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className={`absolute right-0 mt-2 w-56 ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80"
                      : "bg-white border-slate-150 text-slate-950 shadow-xl"
                  } border rounded-xl p-2 z-50 space-y-1`}
                >
                  <div className="pb-1.5 px-2 border-b border-slate-800/60 mb-1.5">
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      Fast Command Launcher
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setQuickActionsOpen(false);
                      setActiveView("Directory");
                      if (setIsAddEmployeeOpenFromDashboard)
                        setIsAddEmployeeOpenFromDashboard(true);
                      toast.info("Opened Onboard Employee modal form");
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-2 py-2 rounded-lg text-xs ${
                      isDarkMode
                        ? "hover:bg-slate-800 hover:text-white text-slate-300"
                        : "hover:bg-slate-50 hover:text-slate-900 text-slate-705"
                    } font-semibold transition-all cursor-pointer`}
                  >
                    <Users size={14} className="text-indigo-500 shrink-0" />
                    <span>Onboard Employee</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickActionsOpen(false);
                      setActiveView("Leave");
                      if (setIsAddLeaveOpenFromDashboard)
                        setIsAddLeaveOpenFromDashboard(true);
                      toast.info("Request leave panel triggered");
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-2 py-2 rounded-lg text-xs ${
                      isDarkMode
                        ? "hover:bg-slate-800 hover:text-white text-slate-300"
                        : "hover:bg-slate-50 hover:text-slate-900 text-slate-705"
                    } font-semibold transition-all cursor-pointer`}
                  >
                    <CalendarClock
                      size={14}
                      className="text-emerald-500 shrink-0"
                    />
                    <span>Book Employee Time-off</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickActionsOpen(false);
                      setActiveView("Departments");
                      if (setIsAddDeptOpenFromSidebar)
                        setIsAddDeptOpenFromSidebar(true);
                      toast.info("Ready to append department");
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-2 py-2 rounded-lg text-xs ${
                      isDarkMode
                        ? "hover:bg-slate-800 hover:text-white text-slate-305"
                        : "hover:bg-slate-50 hover:text-slate-900 text-slate-705"
                    } font-semibold transition-all cursor-pointer`}
                  >
                    <Building2 size={14} className="text-amber-500 shrink-0" />
                    <span>Create Department</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickActionsOpen(false);
                      setActiveView("Attendance");
                      if (setAttendanceSubView) setAttendanceSubView("reports");
                      toast.info("Navigated to Attendance reports engine");
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-2 py-2 rounded-lg text-xs ${
                      isDarkMode
                        ? "hover:bg-slate-800 hover:text-white text-slate-300"
                        : "hover:bg-slate-50 hover:text-slate-900 text-slate-705"
                    } font-semibold transition-all cursor-pointer`}
                  >
                    <BarChart3 size={14} className="text-rose-500 shrink-0" />
                    <span>Run Attendance Reports</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickActionsOpen(false);
                      setActiveView("Payroll");
                      if (setPayrollSubView) setPayrollSubView("payslips");
                      toast.info("Switched to Employee payslips overview");
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-2 py-2 rounded-lg text-xs ${
                      isDarkMode
                        ? "hover:bg-slate-800 hover:text-white text-slate-300"
                        : "hover:bg-slate-50 hover:text-slate-900 text-slate-705"
                    } font-semibold transition-all cursor-pointer`}
                  >
                    <Receipt size={14} className="text-purple-500 shrink-0" />
                    <span>Generate Payslips</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle (Sun/Moon) */}
        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            toast.info(
              `Switched to ${!isDarkMode ? "Cool Slate Dark" : "Standard Light"} mode`,
            );
          }}
          title={isDarkMode ? "Switch to Light theme" : "Switch to Dark theme"}
          className={`p-2 border ${
            isDarkMode
              ? "border-slate-805 hover:bg-slate-800 text-amber-400 bg-slate-800/40"
              : "border-slate-205 hover:bg-slate-50 text-slate-655 bg-slate-100/20"
          } rounded-xl cursor-pointer transition-all active:scale-95`}
        >
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications Bell Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-2 border ${isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"} rounded-xl cursor-pointer transition-all active:scale-95`}
          >
            <Bell size={15} />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white text-white text-[8px] font-bold flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Portal List Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div
                  onClick={() => setNotificationsOpen(false)}
                  className="fixed inset-0 z-40 bg-transparent"
                ></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-72 ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80" : "bg-white border-slate-150 text-slate-950 shadow-xl"} border rounded-xl p-4 space-y-3.5 z-50`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
                    <h4 className="text-2xs font-bold uppercase tracking-wider">
                      Awaiting Operations
                    </h4>
                    <span className="text-[9px] bg-indigo-650 text-indigo-100 px-1.5 py-0.5 rounded-md font-extrabold">
                      {notificationsCount} tasks
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/40 max-h-56 overflow-y-auto space-y-2">
                    {leaveRequests.filter((l) => l.status === "Pending")
                      .length === 0 ? (
                      <div className="py-6 text-center text-slate-400">
                        <CheckCircle2
                          size={20}
                          className="text-emerald-500 mx-auto mb-1"
                        />
                        <p className="text-[10px] font-semibold">
                          Operational Compliance OK
                        </p>
                        <p className="text-[9px] mt-0.5 text-slate-500">
                          No administrative signals waiting.
                        </p>
                      </div>
                    ) : (
                      leaveRequests
                        .filter((l) => l.status === "Pending")
                        .map((leave) => (
                          <div
                            key={leave.id}
                            className="pt-2 first:pt-0 space-y-1 text-left"
                          >
                            <p className="text-[10.5px] font-bold">
                              {leave.employeeName}
                            </p>
                            <p className="text-[9.5px] text-slate-450 leading-normal">
                              Filed "{leave.type}" absence request for{" "}
                              {leave.days} {leave.days === 1 ? "day" : "days"}.
                            </p>
                            <button
                              onClick={() => {
                                setActiveView("Leave");
                                setNotificationsOpen(false);
                              }}
                              className="text-[9px] text-indigo-500 font-bold hover:underline"
                            >
                              Take Action
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <span
          className={`w-px h-6 ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
        ></span>

        {/* Interactive User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center gap-2 cursor-pointer p-1 rounded-xl ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"} transition-all select-none`}
          >
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold text-white ${isDarkMode ? "border-slate-805 bg-indigo-600" : "border-slate-205 bg-indigo-600"}`}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left space-y-0.5">
              <p className="text-xs font-bold leading-none">{userName}</p>
              <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                {userRoleTitle}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setProfileDropdownOpen(false)}
                ></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className={`absolute right-0 mt-2 w-64 ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/85"
                      : "bg-white border-slate-150 text-slate-950 shadow-xl"
                  } border rounded-xl p-3 z-50 space-y-2.5`}
                >
                  {/* Detailed Card Block */}
                  <div className="flex items-center gap-3 p-1 text-left">
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold text-white ${isDarkMode ? "border-slate-805 bg-indigo-600" : "border-slate-205 bg-indigo-600"}`}
                      >
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">{userName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-0.5">
                        {userRoleTitle}
                      </p>
                      <p className="text-[9px] text-slate-500 font-medium truncate font-mono mt-1">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                  ></div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        toast.success(
                          "Amara Diop's comprehensive profile overview requested (compliance node: secured)",
                        );
                      }}
                      className={`w-full flex items-center gap-2.5 text-left px-2 py-1.5 rounded-lg text-xs ${
                        isDarkMode
                          ? "hover:bg-slate-805 text-slate-300"
                          : "hover:bg-slate-50 text-slate-705"
                      } font-semibold transition-all cursor-pointer`}
                    >
                      <UserCircle
                        size={14}
                        className="text-slate-400 shrink-0"
                      />
                      <span>My Profile Overview</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveView("Settings");
                      }}
                      className={`w-full flex items-center gap-2.5 text-left px-2 py-1.5 rounded-lg text-xs ${
                        isDarkMode
                          ? "hover:bg-slate-805 text-slate-300"
                          : "hover:bg-slate-50 text-slate-705"
                      } font-semibold transition-all cursor-pointer`}
                    >
                      <Settings size={14} className="text-slate-450 shrink-0" />
                      <span>Platform Settings</span>
                    </button>
                  </div>

                  <div
                    className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                  ></div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                      toast.success("Session ended. Redirecting to login...");
                      navigate("/login", { replace: true });
                    }}
                    className="w-full flex items-center gap-2.5 text-left px-2 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 font-bold transition-all cursor-pointer"
                  >
                    <LogOut size={14} className="shrink-0" />
                    <span>Secure Log Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
