import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Employee,
  Candidate,
  LeaveRequest,
  PerformanceGoal,
  ActivityLog,
  UserRole,
  User,
  Department,
  Attendance,
  Overtime,
  Payroll,
} from "../../types";
import { toast } from "sonner";
import {
  getEmployees,
  createEmployee,
} from "../../features/employees/api/employees.api";
import {
  getDepartments,
  createDepartment,
} from "../../features/departments/api/departments.api";
import { api } from "../../lib/api/axios";
import type { EmployeeApiModel } from "../../features/employees/types";
import type { DepartmentApiModel } from "../../features/departments/types";

interface HRContextType {
  employees: Employee[];
  candidates: Candidate[];
  leaveRequests: LeaveRequest[];
  goals: PerformanceGoal[];
  logs: ActivityLog[];
  departments: Department[];
  attendances: Attendance[];
  overtimes: Overtime[];
  payrolls: Payroll[];
  users: User[];
  addEmployee: (employee: Omit<Employee, "id" | "startDate">) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addCandidate: (
    candidate: Omit<Candidate, "id" | "appliedDate" | "stage" | "status">,
  ) => void;
  updateCandidateStage: (id: string, stage: Candidate["stage"]) => void;
  rejectCandidate: (id: string) => void;
  hireCandidate: (id: string) => void;
  submitLeaveRequest: (
    request: Omit<LeaveRequest, "id" | "status" | "days">,
  ) => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  addPerformanceGoal: (
    goal: Omit<PerformanceGoal, "id" | "employeeName">,
  ) => void;
  updateGoalProgress: (
    id: string,
    progress: number,
    status: PerformanceGoal["status"],
  ) => void;
  addLog: (
    action: string,
    module: ActivityLog["module"],
    type: ActivityLog["type"],
  ) => void;
  clearLogs: () => void;

  // Department Management
  addDepartment: (
    dept: Omit<Department, "id" | "totalEmployees" | "createdDate">,
  ) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Attendance Management
  addAttendanceRecord: (record: Omit<Attendance, "id">) => void;
  updateAttendanceRecord: (id: string, updates: Partial<Attendance>) => void;

  // Overtime Management
  addOvertimeRecord: (record: Omit<Overtime, "id" | "amount">) => void;
  deleteOvertimeRecord: (id: string) => void;

  // Payroll Management
  addPayrollRecord: (record: Omit<Payroll, "id" | "netSalary">) => void;
  deletePayrollRecord: (id: string) => void;

  // User Management
  addUser: (user: Omit<User, "id">) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  deleteUser: (id: string) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const INITIAL_EMPLOYEES: Employee[] = [];

const INITIAL_CANDIDATES: Candidate[] = [];

const INITIAL_LEAVES: LeaveRequest[] = [];

const INITIAL_GOALS: PerformanceGoal[] = [];

const INITIAL_LOGS: ActivityLog[] = [];

const INITIAL_DEPARTMENTS: Department[] = [];

const INITIAL_ATTENDANCE: Attendance[] = [];

const INITIAL_OVERTIME: Overtime[] = [];

const INITIAL_PAYROLL: Payroll[] = [];

const INITIAL_USERS: User[] = [];

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [goals, setGoals] = useState<PerformanceGoal[]>(INITIAL_GOALS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [departments, setDepartments] =
    useState<Department[]>(INITIAL_DEPARTMENTS);
  const [attendances, setAttendances] =
    useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [overtimes, setOvertimes] = useState<Overtime[]>(INITIAL_OVERTIME);
  const [payrolls, setPayrolls] = useState<Payroll[]>(INITIAL_PAYROLL);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  useEffect(() => {
    const loadHrData = async () => {
      try {
        const [employeeApiData, departmentApiData, attendanceApiData] =
          await Promise.all([
            getEmployees(),
            getDepartments(),
            api
              .get<{
                success: boolean;
                data: Array<{
                  id: string;
                  employeeId: string;
                  status: string;
                  attendanceDate: string;
                  hoursWorked?: string | number;
                }>;
              }>("/api/attendance")
              .then((response) => response.data.data),
          ]);

        const departmentLookup = new Map(
          departmentApiData.map((dept: DepartmentApiModel) => [
            dept.id,
            dept.name,
          ]),
        );
        const mappedEmployees = employeeApiData.map(
          (employee: EmployeeApiModel) => ({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            department:
              departmentLookup.get(employee.departmentId) ??
              employee.departmentId,
            status: (employee.status as Employee["status"]) ?? "Active",
            location: "Remote",
            startDate: employee.joinDate,
            salary: Number(employee.baseSalary),
            performanceRating: 5,
            avatar: "",
            phone: "",
            gender: "Other",
          }),
        );

        const mappedDepartments = departmentApiData.map(
          (dept: DepartmentApiModel) => ({
            id: dept.id,
            name: dept.name,
            description: dept.description ?? "",
            totalEmployees: mappedEmployees.filter(
              (employee) => employee.department === dept.name,
            ).length,
            createdDate:
              dept.createdAt ?? new Date().toISOString().split("T")[0],
          }),
        );

        const mappedAttendances = attendanceApiData.map((record) => {
          const employee = mappedEmployees.find(
            (item) => item.id === record.employeeId,
          );
          return {
            id: record.id,
            employeeId: record.employeeId,
            employeeName: employee?.name ?? record.employeeId,
            date: record.attendanceDate,
            checkIn: "",
            checkOut: "",
            hoursWorked: Number(record.hoursWorked ?? 0),
            status: (record.status as Attendance["status"]) ?? "Present",
            department: employee?.department ?? "",
          } as Attendance;
        });

        setEmployees(mappedEmployees);
        setDepartments(mappedDepartments);
        setAttendances(mappedAttendances);
      } catch (error) {
        console.error("Failed to load HR data from the server", error);
        toast.error("Unable to load data from the server");
      }
    };

    void loadHrData();
  }, []);

  const addLog = useCallback(
    (
      action: string,
      module: ActivityLog["module"],
      type: ActivityLog["type"],
    ) => {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: "Amara Diop (HR Administrator)",
        action,
        module,
        type,
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 100));
    },
    [],
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
    toast.info("Activity history log cleared");
  }, []);

  const addEmployee = useCallback(
    async (employee: Omit<Employee, "id" | "startDate">) => {
      try {
        const departmentMatch = departments.find(
          (dept) => dept.name === employee.department,
        );
        const createdEmployee = await createEmployee({
          name: employee.name,
          email: employee.email,
          departmentId: departmentMatch?.id ?? "",
          role: employee.role,
          baseSalary: employee.salary,
          joinDate: new Date().toISOString().split("T")[0],
        });

        const newEmployee: Employee = {
          ...employee,
          id: createdEmployee.id,
          startDate: createdEmployee.joinDate,
          salary: Number(createdEmployee.baseSalary),
          department: departmentMatch?.name ?? employee.department,
        };

        setEmployees((prev) => [newEmployee, ...prev]);
        addLog(
          `Onboarded new employee: ${newEmployee.name} (${newEmployee.role})`,
          "Employees",
          "success",
        );
        toast.success(`Successfully onboarded ${newEmployee.name}!`);
      } catch (error) {
        console.error("Failed to create employee", error);
        toast.error("Unable to create employee");
      }
    },
    [addLog, departments],
  );

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === id) {
            const updated = { ...emp, ...updates };
            if (updates.name) {
              setLeaveRequests((leaves) =>
                leaves.map((l) =>
                  l.employeeId === id
                    ? { ...l, employeeName: updates.name! }
                    : l,
                ),
              );
              setGoals((gls) =>
                gls.map((g) =>
                  g.employeeId === id
                    ? { ...g, employeeName: updates.name! }
                    : g,
                ),
              );
            }
            return updated;
          }
          return emp;
        }),
      );
      addLog(
        `Updated employee details for ${updates.name || "ID " + id}`,
        "Employees",
        "info",
      );
      toast.success("Employee profile updated successfully");
    },
    [addLog],
  );

  const deleteEmployee = useCallback(
    (id: string) => {
      const employee = employees.find((e) => e.id === id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      addLog(
        `Deleted employee record for ${employee ? employee.name : id}`,
        "Employees",
        "warning",
      );
      toast.warning(
        `${employee ? employee.name : "Employee"} has been offboarded`,
      );
    },
    [employees, addLog],
  );

  const addCandidate = useCallback(
    (candidate: Omit<Candidate, "id" | "appliedDate" | "stage" | "status">) => {
      const newCandidate: Candidate = {
        ...candidate,
        id: `cand-${Date.now()}`,
        appliedDate: new Date().toISOString().split("T")[0],
        stage: "Applied",
        status: "active",
      };
      setCandidates((prev) => [newCandidate, ...prev]);
      addLog(
        `Registered candidate application: ${newCandidate.name} for ${newCandidate.role}`,
        "Recruitment",
        "info",
      );
      toast.success(`Application received for ${newCandidate.name}`);
    },
    [addLog],
  );

  const updateCandidateStage = useCallback(
    (id: string, stage: Candidate["stage"]) => {
      setCandidates((prev) =>
        prev.map((cand) => {
          if (cand.id === id) {
            addLog(
              `Moved candidate ${cand.name} to stage: ${stage}`,
              "Recruitment",
              "info",
            );
            return { ...cand, stage };
          }
          return cand;
        }),
      );
      toast.info(`Candidate stage updated to ${stage}`);
    },
    [addLog],
  );

  const rejectCandidate = useCallback(
    (id: string) => {
      const cand = candidates.find((c) => c.id === id);
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c)),
      );
      if (cand) {
        addLog(
          `Rejected candidate ${cand.name} application`,
          "Recruitment",
          "warning",
        );
        toast.error(`Application filed as rejected for ${cand.name}`);
      }
    },
    [candidates, addLog],
  );

  const hireCandidate = useCallback(
    (id: string) => {
      const cand = candidates.find((c) => c.id === id);
      if (!cand) return;

      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, stage: "Hired" } : c)),
      );

      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: cand.name,
        email: cand.email,
        role: cand.role,
        department: cand.department,
        status: "Active",
        location: "Remote Work",
        startDate: new Date().toISOString().split("T")[0],
        salary: 95000,
        performanceRating: 5.0,
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150`,
        phone: cand.phone,
        gender: "Male",
      };

      setEmployees((prev) => [newEmp, ...prev]);
      addLog(
        `HIRED candidate: ${cand.name} is now onboarded as a full-time ${cand.role}!`,
        "Recruitment",
        "success",
      );
      toast.success(`Hired & Onboarded ${cand.name}! 🎉 Welcome to the team.`);
    },
    [candidates, addLog],
  );

  const submitLeaveRequest = useCallback(
    (request: Omit<LeaveRequest, "id" | "status" | "days">) => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const newRequest: LeaveRequest = {
        ...request,
        id: `leave-${Date.now()}`,
        status: "Pending",
        days: diffDays,
      };

      setLeaveRequests((prev) => [newRequest, ...prev]);
      addLog(
        `Submitted new leave request for ${request.employeeName} (${diffDays} days)`,
        "Leave",
        "info",
      );
      toast.success(`Leave request submitted for ${request.employeeName}`);
    },
    [addLog],
  );

  const approveLeaveRequest = useCallback(
    (id: string) => {
      let leaveName = "";
      let empId = "";

      setLeaveRequests((prev) =>
        prev.map((req) => {
          if (req.id === id) {
            leaveName = req.employeeName;
            empId = req.employeeId;
            return { ...req, status: "Approved" };
          }
          return req;
        }),
      );

      if (empId) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === empId ? { ...emp, status: "On Leave" } : emp,
          ),
        );
      }

      addLog(`Approved leave request for ${leaveName}`, "Leave", "success");
      toast.success(`Approved leave request for ${leaveName}`);
    },
    [addLog],
  );

  const rejectLeaveRequest = useCallback(
    (id: string) => {
      let leaveName = "";
      setLeaveRequests((prev) =>
        prev.map((req) => {
          if (req.id === id) {
            leaveName = req.employeeName;
            return { ...req, status: "Rejected" };
          }
          return req;
        }),
      );
      addLog(`Rejected leave request for ${leaveName}`, "Leave", "warning");
      toast.error(`Rejected leave request for ${leaveName}`);
    },
    [addLog],
  );

  const addPerformanceGoal = useCallback(
    (goal: Omit<PerformanceGoal, "id" | "employeeName">) => {
      const employee = employees.find((e) => e.id === goal.employeeId);
      if (!employee) return;

      const newGoal: PerformanceGoal = {
        ...goal,
        id: `goal-${Date.now()}`,
        employeeName: employee.name,
      };

      setGoals((prev) => [newGoal, ...prev]);
      addLog(
        `Assigned performance goal: "${goal.title}" to ${employee.name}`,
        "Performance",
        "info",
      );
      toast.success(`Assigned goal to ${employee.name}`);
    },
    [employees, addLog],
  );

  const updateGoalProgress = useCallback(
    (id: string, progress: number, status: PerformanceGoal["status"]) => {
      let goalTitle = "";
      let empName = "";

      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            goalTitle = g.title;
            empName = g.employeeName;
            return { ...g, progress, status };
          }
          return g;
        }),
      );

      addLog(
        `Updated goal "${goalTitle}" progress to ${progress}% for ${empName}`,
        "Performance",
        "info",
      );
      toast.success(`Updated progress for ${empName} (${progress}%)`);
    },
    [addLog],
  );

  const addDepartment = useCallback(
    async (dept: Omit<Department, "id" | "totalEmployees" | "createdDate">) => {
      try {
        const createdDepartment = await createDepartment({
          name: dept.name,
          description: dept.description,
        });

        const newDept: Department = {
          ...dept,
          id: createdDepartment.id,
          totalEmployees: 0,
          createdDate:
            createdDepartment.createdAt ??
            new Date().toISOString().split("T")[0],
        };
        setDepartments((prev) => [...prev, newDept]);
        addLog(
          `Created new department: ${newDept.name}`,
          "Departments",
          "success",
        );
        toast.success(`Successfully registered ${newDept.name} Department!`);
      } catch (error) {
        console.error("Failed to create department", error);
        toast.error("Unable to create department");
      }
    },
    [addLog],
  );

  const updateDepartment = useCallback(
    (id: string, updates: Partial<Department>) => {
      setDepartments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      );
      addLog(
        `Updated department details for ${updates.name || "ID " + id}`,
        "Departments",
        "info",
      );
      toast.success("Department updated successfully");
    },
    [addLog],
  );

  const deleteDepartment = useCallback(
    (id: string) => {
      const dept = departments.find((d) => d.id === id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      addLog(
        `Deleted department: ${dept ? dept.name : id}`,
        "Departments",
        "warning",
      );
      toast.warning(`${dept ? dept.name : "Department"} deleted`);
    },
    [departments, addLog],
  );

  const addAttendanceRecord = useCallback(
    async (record: Omit<Attendance, "id">) => {
      try {
        const createdRecord = await api.post<{
          success: boolean;
          data: {
            id: string;
            employeeId: string;
            status: string;
            attendanceDate: string;
            hoursWorked?: string | number;
          };
        }>("/api/attendance/record", {
          employeeId: record.employeeId,
          status: record.status,
          attendanceDate: record.date,
          hoursWorked: record.hoursWorked,
        });

        const newRec: Attendance = {
          ...record,
          id: createdRecord.data.data.id,
        };
        setAttendances((prev) => [newRec, ...prev]);
        addLog(
          `Logged attendance for ${record.employeeName}: ${record.status}`,
          "Attendance",
          "success",
        );
        toast.success(`Logged attendance for ${record.employeeName}`);
      } catch (error) {
        console.error("Failed to record attendance", error);
        toast.error("Unable to save attendance");
      }
    },
    [addLog],
  );

  const updateAttendanceRecord = useCallback(
    (id: string, updates: Partial<Attendance>) => {
      setAttendances((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      );
      addLog(`Modified attendance status for ID ${id}`, "Attendance", "info");
      toast.success("Attendance record updated");
    },
    [addLog],
  );

  const addOvertimeRecord = useCallback(
    (record: Omit<Overtime, "id" | "amount">) => {
      const newRec: Overtime = {
        ...record,
        id: `ot-${Date.now()}`,
        amount: record.hours * record.rate,
      };
      setOvertimes((prev) => [newRec, ...prev]);
      addLog(
        `Logged overtime for ${record.employeeName}: ${record.hours}h`,
        "Overtime",
        "success",
      );
      toast.success(
        `Logged overtime of ${record.hours} hours for ${record.employeeName}`,
      );
    },
    [addLog],
  );

  const deleteOvertimeRecord = useCallback(
    (id: string) => {
      setOvertimes((prev) => prev.filter((o) => o.id !== id));
      addLog(`Deleted overtime record: ${id}`, "Overtime", "warning");
      toast.warning(`Overtime record removed`);
    },
    [addLog],
  );

  const addPayrollRecord = useCallback(
    (record: Omit<Payroll, "id" | "netSalary">) => {
      const newRec: Payroll = {
        ...record,
        id: `pay-${Date.now()}`,
        netSalary:
          Number(record.baseSalary) +
          Number(record.overtime) -
          Number(record.deductions),
      };
      setPayrolls((prev) => [newRec, ...prev]);
      addLog(
        `Generated payslip for ${record.employeeName} (${record.month})`,
        "Payroll",
        "success",
      );
      toast.success(`Generated payslip for ${record.employeeName}`);
    },
    [addLog],
  );

  const deletePayrollRecord = useCallback(
    (id: string) => {
      setPayrolls((prev) => prev.filter((p) => p.id !== id));
      addLog(`Removed payslip record: ${id}`, "Payroll", "warning");
      toast.warning(`Payslip deleted`);
    },
    [addLog],
  );

  const addUser = useCallback(
    (user: Omit<User, "id">) => {
      const newRec: User = {
        ...user,
        id: `user-${Date.now()}`,
      };
      setUsers((prev) => [...prev, newRec]);
      addLog(
        `Added system user: ${user.name} (${user.role})`,
        "Users",
        "success",
      );
      toast.success(`User ${user.name} created!`);
    },
    [addLog],
  );

  const updateUserRole = useCallback(
    (id: string, role: UserRole) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      addLog(
        `Changed authority role to ${role} for user ID ${id}`,
        "Users",
        "info",
      );
      toast.success("User role updated successfully");
    },
    [addLog],
  );

  const deleteUser = useCallback(
    (id: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addLog(`Deleted user account: ${id}`, "Users", "warning");
      toast.warning("User account removed");
    },
    [addLog],
  );

  return (
    <HRContext.Provider
      value={{
        employees,
        candidates,
        leaveRequests,
        goals,
        logs,
        departments,
        attendances,
        overtimes,
        payrolls,
        users,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addCandidate,
        updateCandidateStage,
        rejectCandidate,
        hireCandidate,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        addPerformanceGoal,
        updateGoalProgress,
        addLog,
        clearLogs,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addAttendanceRecord,
        updateAttendanceRecord,
        addOvertimeRecord,
        deleteOvertimeRecord,
        addPayrollRecord,
        deletePayrollRecord,
        addUser,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (context === undefined) {
    throw new Error("useHR must be used within an HRProvider");
  }
  return context;
};
