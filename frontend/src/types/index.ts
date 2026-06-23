export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated' | 'Suspended';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  location: string;
  startDate: string;
  salary: number;
  performanceRating: number;
  avatar: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
}

export type RecruitmentStage = 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  stage: RecruitmentStage;
  rating: number; // 1 to 5
  appliedDate: string;
  status: 'active' | 'rejected';
  phone: string;
}

export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Maternity/Paternity' | 'Unpaid Leave' | 'Study Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
  days: number;
}

export type GoalStatus = 'On Track' | 'Behind' | 'Achieved' | 'Not Started';

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0 to 100
  status: GoalStatus;
  category: 'Sales' | 'Technical' | 'Leadership' | 'Operational' | 'Culture';
}

export type UserRole = 'Super Admin' | 'HR Manager' | 'Department Manager' | 'Payroll Officer' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  totalEmployees: number;
  createdDate: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: 'Present' | 'Absent' | 'Late';
  department: string;
}

export interface Overtime {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  hours: number;
  rate: number; // hourly multiplier rate e.g. 25, 30
  amount: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  baseSalary: number;
  overtime: number;
  deductions: number;
  netSalary: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: 'Employees' | 'Leave' | 'Recruitment' | 'Performance' | 'Settings' | 'Departments' | 'Attendance' | 'Overtime' | 'Payroll' | 'Users';
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface HRState {
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
}
