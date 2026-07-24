import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { HRProvider } from "./app/providers/HRProvider";
import { AuthProvider } from "./app/providers/AuthProvider";
import { ProtectedRoute } from "./app/routes/ProtectedRoute";
import { queryClient } from "./lib/api/queryClient";
import { DashboardLayout } from "./app/layouts/DashboardLayout";
import { DashboardOverview } from "./features/dashboard/pages/DashboardOverview";
import { EmployeeDirectory } from "./features/employees/pages/EmployeeDirectory";
import { RecruitmentPipeline } from "./features/recruitment/pages/RecruitmentPipeline";
import { LeaveTracker } from "./features/leaves/pages/LeaveTracker";
import { PerformanceReview } from "./features/performance/pages/PerformanceReview";
import { SettingsPage } from "./features/settings/pages/SettingsPage";
import { DepartmentsPage } from "./features/departments/pages/DepartmentsPage";
import { AttendancePage } from "./features/attendance/pages/AttendancePage";
import { OvertimePage } from "./features/overtime/pages/OvertimePage";
import { PayrollPage } from "./features/payroll/pages/PayrollPage";
import { UsersPage } from "./features/users/pages/UsersPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { UnauthorizedPage } from "./features/auth/pages/UnauthorizedPage";

type ActiveView =
  | "Dashboard"
  | "Register"
  | "Hiring"
  | "Leave"
  | "Performance"
  | "Departments"
  | "Attendance"
  | "Overtime"
  | "Payroll"
  | "Users"
  | "Settings";

function HRMSAppShell() {
  const [activeView, setActiveView] = useState<ActiveView>("Dashboard");
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem("hrms_accent_color") || "indigo",
  );
  const [isAddLeaveOpenFromDashboard, setIsAddLeaveOpenFromDashboard] =
    useState(false);
  const [isAddEmployeeOpenFromDashboard, setIsAddEmployeeOpenFromDashboard] =
    useState(false);
  const [isAddDeptOpenFromSidebar, setIsAddDeptOpenFromSidebar] =
    useState(false);
  const [attendanceSubView, setAttendanceSubView] = useState<
    "records" | "reports"
  >("records");
  const [payrollSubView, setPayrollSubView] = useState<
    "dashboard" | "payslips"
  >("dashboard");

  return (
    <DashboardLayout
      activeView={activeView}
      setActiveView={(view) => setActiveView(view as ActiveView)}
      accentColor={accentColor}
      setAccentColor={setAccentColor}
      setIsAddEmployeeOpenFromDashboard={setIsAddEmployeeOpenFromDashboard}
      setIsAddLeaveOpenFromDashboard={setIsAddLeaveOpenFromDashboard}
      setIsAddDeptOpenFromSidebar={setIsAddDeptOpenFromSidebar}
      setAttendanceSubView={setAttendanceSubView}
      setPayrollSubView={setPayrollSubView}
    >
      {activeView === "Dashboard" && (
        <DashboardOverview
          onNavigate={(v) => {
            if (v === "Register") {
              setActiveView("Register");
              setIsAddEmployeeOpenFromDashboard(false);
            } else {
              setActiveView(v as ActiveView);
            }
          }}
          openLeaveModal={() => setIsAddLeaveOpenFromDashboard(true)}
          openEmployeeModal={() => setIsAddEmployeeOpenFromDashboard(true)}
        />
      )}
      {activeView === "Register" && (
        <EmployeeDirectory
          isAddModalOpenFromApp={isAddEmployeeOpenFromDashboard}
          closeAddModalFromApp={() => setIsAddEmployeeOpenFromDashboard(false)}
        />
      )}
      {activeView === "Hiring" && <RecruitmentPipeline />}
      {activeView === "Leave" && (
        <LeaveTracker
          isAddModalOpenFromApp={isAddLeaveOpenFromDashboard}
          closeAddModalFromApp={() => setIsAddLeaveOpenFromDashboard(false)}
        />
      )}
      {activeView === "Performance" && <PerformanceReview />}
      {activeView === "Departments" && (
        <DepartmentsPage
          isAddModalOpenFromApp={isAddDeptOpenFromSidebar}
          closeAddModalFromApp={() => setIsAddDeptOpenFromSidebar(false)}
        />
      )}
      {activeView === "Attendance" && (
        <AttendancePage initialSubView={attendanceSubView} />
      )}
      {activeView === "Overtime" && <OvertimePage />}
      {activeView === "Payroll" && (
        <PayrollPage initialSubView={payrollSubView} />
      )}
      {activeView === "Users" && <UsersPage />}
      {activeView === "Settings" && (
        <SettingsPage
          accentColor={accentColor}
          setAccentColor={setAccentColor}
        />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HRProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<HRMSAppShell />} />
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HRProvider>
      </AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
