import React, { useState, useEffect } from "react";
import { useHR } from "../providers/HRProvider";
import { Sidebar, SidebarItem } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MobileSidebar } from "./components/MobileSidebar";
import { Breadcrumb } from "./components/Breadcrumb";
import { Toaster, toast } from "sonner";
import {
  Briefcase,
  Users,
  CalendarClock,
  TrendingUp,
  Goal,
  Settings,
  Building2,
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  Timer,
  BarChart3,
  UserCircle,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: any) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  // Options for subviews / modal overrides from parent triggers
  setIsAddEmployeeOpenFromDashboard?: (open: boolean) => void;
  setIsAddLeaveOpenFromDashboard?: (open: boolean) => void;
  setIsAddDeptOpenFromSidebar?: (open: boolean) => void;
  setAttendanceSubView?: (view: "records" | "reports") => void;
  setPayrollSubView?: (view: "dashboard" | "payslips") => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeView,
  setActiveView,
  accentColor,
  setAccentColor,
  setIsAddEmployeeOpenFromDashboard,
  setIsAddLeaveOpenFromDashboard,
  setIsAddDeptOpenFromSidebar,
  setAttendanceSubView,
  setPayrollSubView,
}) => {
  const { logs, leaveRequests, employees, departments } = useHR();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentSystemTime, setCurrentSystemTime] = useState("");

  // Theme and dropdown states
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("hrms_dark_mode") === "true",
  );
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("hrms_dark_mode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("hrms_sidebar_collapsed") === "true",
  );
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Employees: true,
    Departments: false,
    Attendance: false,
    LeaveManagement: false,
    Payroll: false,
    Overtime: false,
    PerformanceReviews: false,
    Users: false,
  });

  useEffect(() => {
    localStorage.setItem("hrms_sidebar_collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSubmenu = (menuKey: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Sync brand highlight
  useEffect(() => {
    localStorage.setItem("hrms_accent_color", accentColor);
  }, [accentColor]);

  // Modern live clock ticker
  useEffect(() => {
    const updateTimeStr = () => {
      const now = new Date();
      const utcSeconds = now.getTime() + now.getTimezoneOffset() * 60000;
      const systemTime = new Date(utcSeconds - 7 * 3600000); // PDT (UTC-07:00)

      const formatted = systemTime.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentSystemTime(formatted + " (PDT)");
    };

    updateTimeStr();
    const interval = setInterval(updateTimeStr, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAccentBgClass = () => {
    switch (accentColor) {
      case "emerald":
        return "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-100";
      case "rose":
        return "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-100";
      case "amber":
        return "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-100";
      case "purple":
        return "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-100";
      default:
        return "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-100";
    }
  };

  const getAccentSidebarClass = (itemActive: boolean) => {
    if (!itemActive)
      return "text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium";
    switch (accentColor) {
      case "emerald":
        return "bg-emerald-600 text-white shadow-sm font-bold";
      case "rose":
        return "bg-rose-600 text-white shadow-sm font-bold";
      case "amber":
        return "bg-amber-600 text-white shadow-sm font-bold";
      case "purple":
        return "bg-purple-600 text-white shadow-sm font-bold";
      default:
        return "bg-indigo-600 text-white shadow-sm font-bold";
    }
  };

  const getAccentSubmenuClass = (isActive: boolean) => {
    if (!isActive)
      return "text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium";
    switch (accentColor) {
      case "emerald":
        return "text-emerald-400 font-bold bg-emerald-500/10 border-l-2 border-emerald-500";
      case "rose":
        return "text-rose-400 font-bold bg-rose-500/10 border-l-2 border-rose-500";
      case "amber":
        return "text-amber-400 font-bold bg-amber-500/10 border-l-2 border-amber-500";
      case "purple":
        return "text-purple-400 font-bold bg-purple-500/10 border-l-2 border-purple-500";
      default:
        return "text-indigo-400 font-bold bg-indigo-500/10 border-l-2 border-indigo-500";
    }
  };

  const sidebarMenu: SidebarItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      active: activeView === "Dashboard",
      onClick: () => setActiveView("Dashboard"),
    },
    {
      name: "Register",
      icon: Users,
      active: activeView === "Register",
      menuKey: "Employees",
      onClick: () => setActiveView("Register"),
    },
    {
      name: "Hiring",
      icon: Briefcase,
      active: activeView === "Hiring",
      onClick: () => setActiveView("Hiring"),
    },
    {
      name: "Leave Tracker",
      icon: CalendarClock,
      active: activeView === "Leave",
      menuKey: "LeaveManagement",
      onClick: () => setActiveView("Leave"),
    },
    {
      name: "Departments",
      icon: Building2,
      active: activeView === "Departments",
      menuKey: "Departments",
      onClick: () => setActiveView("Departments"),
    },
    {
      name: "Attendance",
      icon: CalendarCheck,
      active: activeView === "Attendance",
      menuKey: "Attendance",
      subItems: [
        {
          name: "Records Matrix",
          active:
            activeView === "Attendance" &&
            (setAttendanceSubView ? true : false),
          onClick: () => {
            setActiveView("Attendance");
            if (setAttendanceSubView) setAttendanceSubView("records");
          },
        },
        {
          name: "Compliance Report",
          active:
            activeView === "Attendance" &&
            (setAttendanceSubView ? false : false),
          onClick: () => {
            setActiveView("Attendance");
            if (setAttendanceSubView) setAttendanceSubView("reports");
          },
        },
      ],
    },
    {
      name: "Payroll",
      icon: Wallet,
      active: activeView === "Payroll",
      menuKey: "Payroll",
      subItems: [
        {
          name: "Dashboard",
          active:
            activeView === "Payroll" && (setPayrollSubView ? true : false),
          onClick: () => {
            setActiveView("Payroll");
            if (setPayrollSubView) setPayrollSubView("dashboard");
          },
        },
        {
          name: "Payslips",
          active:
            activeView === "Payroll" && (setPayrollSubView ? false : false),
          onClick: () => {
            setActiveView("Payroll");
            if (setPayrollSubView) setPayrollSubView("payslips");
          },
        },
      ],
    },
    {
      name: "Overtime",
      icon: Timer,
      active: activeView === "Overtime",
      menuKey: "Overtime",
      onClick: () => setActiveView("Overtime"),
    },
    {
      name: "Performance Reviews",
      icon: BarChart3,
      active: activeView === "Performance",
      menuKey: "PerformanceReviews",
      onClick: () => setActiveView("Performance"),
    },
    {
      name: "User Management",
      icon: UserCircle,
      active: activeView === "Users",
      menuKey: "Users",
      onClick: () => setActiveView("Users"),
    },
    {
      name: "Portal Settings",
      icon: Settings,
      active: activeView === "Settings",
      onClick: () => setActiveView("Settings"),
    },
  ];

  const handleParentClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.menuKey) {
      toggleSubmenu(item.menuKey);
    }
  };

  const notificationsCount = leaveRequests.filter(
    (l) => l.status === "Pending",
  ).length;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50/40 text-slate-900"} flex flex-col font-sans select-none antialiased transition-colors duration-300`}
    >
      {/* Header */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        profileDropdownOpen={profileDropdownOpen}
        setProfileDropdownOpen={setProfileDropdownOpen}
        quickActionsOpen={quickActionsOpen}
        setQuickActionsOpen={setQuickActionsOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResultsOpen={searchResultsOpen}
        setSearchResultsOpen={setSearchResultsOpen}
        currentSystemTime={currentSystemTime}
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
        notificationsCount={notificationsCount}
        leaveRequests={leaveRequests}
        employees={employees}
        departments={departments}
        setActiveView={setActiveView}
        setAttendanceSubView={setAttendanceSubView}
        setPayrollSubView={setPayrollSubView}
        setIsAddEmployeeOpenFromDashboard={setIsAddEmployeeOpenFromDashboard}
        setIsAddLeaveOpenFromDashboard={setIsAddLeaveOpenFromDashboard}
        setIsAddDeptOpenFromSidebar={setIsAddDeptOpenFromSidebar}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          sidebarMenu={sidebarMenu}
          expandedMenus={expandedMenus}
          handleParentClick={handleParentClick}
          getAccentSidebarClass={getAccentSidebarClass}
          getAccentSubmenuClass={getAccentSubmenuClass}
          accentColor={accentColor}
        />

        {/* Dynamic page contents body render area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-950/20 transition-colors">
          <div className="max-w-7xl mx-auto space-y-6 text-left">
            <Breadcrumb activeView={activeView} />
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      <MobileSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarMenu={sidebarMenu}
        expandedMenus={expandedMenus}
        toggleSubmenu={toggleSubmenu}
        getAccentBgClass={getAccentBgClass}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
};
