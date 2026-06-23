import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  Payroll 
} from '../../types';
import { toast } from 'sonner';

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
  addEmployee: (employee: Omit<Employee, 'id' | 'startDate'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate' | 'stage' | 'status'>) => void;
  updateCandidateStage: (id: string, stage: Candidate['stage']) => void;
  rejectCandidate: (id: string) => void;
  hireCandidate: (id: string) => void;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'days'>) => void;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  addPerformanceGoal: (goal: Omit<PerformanceGoal, 'id' | 'employeeName'>) => void;
  updateGoalProgress: (id: string, progress: number, status: PerformanceGoal['status']) => void;
  addLog: (action: string, module: ActivityLog['module'], type: ActivityLog['type']) => void;
  clearLogs: () => void;
  
  // Department Management
  addDepartment: (dept: Omit<Department, 'id' | 'totalEmployees' | 'createdDate'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Attendance Management
  addAttendanceRecord: (record: Omit<Attendance, 'id'>) => void;
  updateAttendanceRecord: (id: string, updates: Partial<Attendance>) => void;

  // Overtime Management
  addOvertimeRecord: (record: Omit<Overtime, 'id' | 'amount'>) => void;
  deleteOvertimeRecord: (id: string) => void;

  // Payroll Management
  addPayrollRecord: (record: Omit<Payroll, 'id' | 'netSalary'>) => void;
  deletePayrollRecord: (id: string) => void;

  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  deleteUser: (id: string) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@enterprise.co',
    role: 'Lead UX Designer',
    department: 'Design',
    status: 'Active',
    location: 'London, UK (Remote)',
    startDate: '2022-03-15',
    salary: 110000,
    performanceRating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+44 7700 900077',
    gender: 'Female',
  },
  {
    id: 'emp-2',
    name: 'Marcus Vance',
    email: 'm.vance@enterprise.co',
    role: 'Principal Engineer',
    department: 'Engineering',
    status: 'Active',
    location: 'San Francisco, USA',
    startDate: '2021-06-01',
    salary: 185000,
    performanceRating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+1 (555) 019-2834',
    gender: 'Male',
  },
  {
    id: 'emp-3',
    name: 'Elena Rostova',
    email: 'e.rostova@enterprise.co',
    role: 'Product Director',
    department: 'Product',
    status: 'On Leave',
    location: 'Amsterdam, NL (Hybrid)',
    startDate: '2023-01-10',
    salary: 135000,
    performanceRating: 4.5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+31 20 555 0123',
    gender: 'Female',
  },
  {
    id: 'emp-4',
    name: 'David Kim',
    email: 'david.k@enterprise.co',
    role: 'Senior Frontend Architect',
    department: 'Engineering',
    status: 'Active',
    location: 'Seoul, South Korea (Remote)',
    startDate: '2023-08-20',
    salary: 140000,
    performanceRating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+82 10 5555 0192',
    gender: 'Male',
  },
  {
    id: 'emp-5',
    name: 'Amara Diop',
    email: 'amara.d@enterprise.co',
    role: 'HR Director',
    department: 'HR & Operations',
    status: 'Active',
    location: 'Paris, France',
    startDate: '2020-11-01',
    salary: 125000,
    performanceRating: 4.6,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    phone: '+33 1 70 555 123',
    gender: 'Female',
  },
  {
    id: 'emp-6',
    name: 'Nicholas Reyes',
    email: 'n.reyes@enterprise.co',
    role: 'Head of Growth Marketing',
    department: 'Marketing',
    status: 'Active',
    location: 'Austin, USA (Hybrid)',
    startDate: '2022-09-12',
    salary: 115000,
    performanceRating: 4.2,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    phone: '+1 (555) 014-9988',
    gender: 'Male',
  },
  {
    id: 'emp-7',
    name: 'Sofia Martinez',
    email: 'sofia.m@enterprise.co',
    role: 'Customer Success Manager',
    department: 'Sales',
    status: 'Active',
    location: 'Madrid, Spain',
    startDate: '2023-04-05',
    salary: 80000,
    performanceRating: 4.4,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    phone: '+34 91 555 7766',
    gender: 'Female',
  },
  {
    id: 'emp-8',
    name: 'James O\'Connor',
    email: 'j.oconnor@enterprise.co',
    role: 'Security Engineer',
    department: 'Engineering',
    status: 'Suspended',
    location: 'Dublin, Ireland',
    startDate: '2022-11-15',
    salary: 120000,
    performanceRating: 3.8,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    phone: '+353 1 900 8822',
    gender: 'Male',
  }
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Jonathan Miller',
    email: 'j.miller@gmail.com',
    role: 'Senior React Developer',
    department: 'Engineering',
    stage: 'Interview',
    rating: 5,
    appliedDate: '2026-06-12',
    status: 'active',
    phone: '+1 (555) 901-2244'
  },
  {
    id: 'cand-2',
    name: 'Clara Oswald',
    email: 'clara.o@outlook.com',
    role: 'Product Designer',
    department: 'Design',
    stage: 'Offered',
    rating: 4,
    appliedDate: '2026-06-10',
    status: 'active',
    phone: '+44 7700 900112'
  },
  {
    id: 'cand-3',
    name: 'Rajen Patel',
    email: 'rpatel@techstaff.net',
    role: 'Staff DevOps Engineer',
    department: 'Engineering',
    stage: 'Screening',
    rating: 4,
    appliedDate: '2026-06-18',
    status: 'active',
    phone: '+1 (555) 231-1200'
  },
  {
    id: 'cand-4',
    name: 'Zoe Vance',
    email: 'zoevance@gmail.com',
    role: 'Marketing Associate',
    department: 'Marketing',
    stage: 'Applied',
    rating: 3,
    appliedDate: '2026-06-20',
    status: 'active',
    phone: '+1 (555) 890-4455'
  },
  {
    id: 'cand-5',
    name: 'Hassan Al-Fayed',
    email: 'h.alfayed@cyber-edu.org',
    role: 'QA Automation Engineer',
    department: 'Engineering',
    stage: 'Interview',
    rating: 5,
    appliedDate: '2026-06-14',
    status: 'active',
    phone: '+971 4 555 7890'
  },
  {
    id: 'cand-6',
    name: 'Mei Lin',
    email: 'meilin@hq-asia.com',
    role: 'HR Specialist',
    department: 'HR & Operations',
    stage: 'Applied',
    rating: 4,
    appliedDate: '2026-06-21',
    status: 'active',
    phone: '+86 21 5555 9876'
  }
];

const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    employeeName: 'Elena Rostova',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    type: 'Maternity/Paternity',
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    status: 'Approved',
    reason: 'Parental maternity leave extension.',
    days: 44,
  },
  {
    id: 'leave-2',
    employeeId: 'emp-1',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    type: 'Annual Leave',
    startDate: '2026-07-10',
    endDate: '2026-07-17',
    status: 'Pending',
    reason: 'Summer family vacation.',
    days: 7,
  },
  {
    id: 'leave-3',
    employeeId: 'emp-5',
    employeeName: 'Amara Diop',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    type: 'Sick Leave',
    startDate: '2026-06-19',
    endDate: '2026-06-22',
    status: 'Approved',
    reason: 'Dental wisdom tooth extraction.',
    days: 3,
  },
  {
    id: 'leave-4',
    employeeId: 'emp-6',
    employeeName: 'Nicholas Reyes',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    type: 'Unpaid Leave',
    startDate: '2026-06-24',
    endDate: '2026-06-25',
    status: 'Pending',
    reason: 'Personal administration / moving home.',
    days: 1,
  },
  {
    id: 'leave-5',
    employeeId: 'emp-4',
    employeeName: 'David Kim',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    type: 'Study Leave',
    startDate: '2026-05-10',
    endDate: '2026-05-14',
    status: 'Rejected',
    reason: 'AWS Cloud Architecture Certification seminar. Course cancelled.',
    days: 4,
  }
];

const INITIAL_GOALS: PerformanceGoal[] = [
  {
    id: 'goal-1',
    employeeId: 'emp-2',
    employeeName: 'Marcus Vance',
    title: 'Migrate Infrastructure to AWS Orchestrator',
    description: 'Transition production server grids to zero-cold-start container architecture to reduce cloud expenditures by 30%.',
    targetDate: '2026-08-30',
    progress: 75,
    status: 'On Track',
    category: 'Technical'
  },
  {
    id: 'goal-2',
    employeeId: 'emp-1',
    employeeName: 'Sarah Jenkins',
    title: 'Design-to-Code Framework Overhaul',
    description: 'Establish unified design token libraries and construct 24 modular high-performance components.',
    targetDate: '2026-07-15',
    progress: 90,
    status: 'On Track',
    category: 'Technical'
  },
  {
    id: 'goal-3',
    employeeId: 'emp-6',
    employeeName: 'Nicholas Reyes',
    title: 'Acquire 5,000 SaaS Signups from Paid Channels',
    description: 'Optimize lead funnels via targeted developer-focused search campaigns to hit $14 target CPA.',
    targetDate: '2026-06-30',
    progress: 40,
    status: 'Behind',
    category: 'Sales'
  },
  {
    id: 'goal-4',
    employeeId: 'emp-7',
    employeeName: 'Sofia Martinez',
    title: 'Reduce Customer Churn under 2.5%',
    description: 'Conduct comprehensive quarterly health checks for all Enterprise Tier portfolios and draft feedback cards.',
    targetDate: '2026-09-01',
    progress: 100,
    status: 'Achieved',
    category: 'Leadership'
  },
  {
    id: 'goal-5',
    employeeId: 'emp-5',
    employeeName: 'Amara Diop',
    title: 'Implement Employee Mental Well-being Framework',
    description: 'Introduce virtual telehealth counseling sessions and monitor standard satisfaction metrics (eNPS).',
    targetDate: '2026-07-01',
    progress: 15,
    status: 'Not Started',
    category: 'Culture'
  }
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-21T01:10:00Z',
    user: 'Amara Diop (HR Administrator)',
    action: 'Approved sick leave request for Marcus Vance',
    module: 'Leave',
    type: 'success',
  },
  {
    id: 'log-2',
    timestamp: '2026-06-20T18:45:00Z',
    user: 'System Operations',
    action: 'Integrated candidate application (Zoe Vance - Marketing)',
    module: 'Recruitment',
    type: 'info',
  },
  {
    id: 'log-3',
    timestamp: '2026-06-20T14:30:00Z',
    user: 'Nicholas Reyes (Marketing)',
    action: 'Updated goal "Paid Channel Signups" progress to 40%',
    module: 'Performance',
    type: 'warning',
  },
  {
    id: 'log-4',
    timestamp: '2026-06-19T11:15:00Z',
    user: 'Amara Diop (HR Administrator)',
    action: 'Added new employee Sofia Martinez (Customer Success)',
    module: 'Employees',
    type: 'success',
  },
  {
    id: 'log-5',
    timestamp: '2026-06-18T09:00:00Z',
    user: 'Amara Diop (HR Administrator)',
    action: 'Suspended employee record for James Connor',
    module: 'Employees',
    type: 'error',
  }
];

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Design', description: 'Product user research, UI library prototyping, and creative design.', totalEmployees: 1, createdDate: '2022-01-10' },
  { id: 'dept-2', name: 'Engineering', description: 'Core product codebases, full-stack microservices, cloud servers, and DevOps operations.', totalEmployees: 3, createdDate: '2021-05-15' },
  { id: 'dept-3', name: 'Product', description: 'Technical roadmap, feature lifecycle specifications, metrics analysis.', totalEmployees: 1, createdDate: '2022-12-01' },
  { id: 'dept-4', name: 'HR & Operations', description: 'Corporate personnel management, compliance, compensation, benefits, and sandbox nodes.', totalEmployees: 1, createdDate: '2020-09-20' },
  { id: 'dept-5', name: 'Marketing', description: 'SaaS user acquisition, global SEO, search ads, and branding campaigns.', totalEmployees: 1, createdDate: '2022-08-01' },
  { id: 'dept-6', name: 'Sales', description: 'Enterprise deal closing, accounts maintenance, portfolios onboarding.', totalEmployees: 1, createdDate: '2023-03-01' }
];

const INITIAL_ATTENDANCE: Attendance[] = [
  { id: 'att-1', employeeId: 'emp-1', employeeName: 'Sarah Jenkins', date: '2026-06-21', checkIn: '09:00 AM', checkOut: '05:30 PM', hoursWorked: 8.5, status: 'Present', department: 'Design' },
  { id: 'att-2', employeeId: 'emp-2', employeeName: 'Marcus Vance', date: '2026-06-21', checkIn: '08:45 AM', checkOut: '06:00 PM', hoursWorked: 9.25, status: 'Present', department: 'Engineering' },
  { id: 'att-3', employeeId: 'emp-4', employeeName: 'David Kim', date: '2026-06-21', checkIn: '09:12 AM', checkOut: '05:30 PM', hoursWorked: 8.3, status: 'Present', department: 'Engineering' },
  { id: 'att-4', employeeId: 'emp-5', employeeName: 'Amara Diop', date: '2026-06-21', checkIn: '08:50 AM', checkOut: '05:15 PM', hoursWorked: 8.4, status: 'Present', department: 'HR & Operations' },
  { id: 'att-5', employeeId: 'emp-6', employeeName: 'Nicholas Reyes', date: '2026-06-21', checkIn: '09:45 AM', checkOut: '06:15 PM', hoursWorked: 8.5, status: 'Late', department: 'Marketing' },
  { id: 'att-6', employeeId: 'emp-7', employeeName: 'Sofia Martinez', date: '2026-06-21', checkIn: '08:55 AM', checkOut: '05:00 PM', hoursWorked: 8.1, status: 'Present', department: 'Sales' },
  { id: 'att-7', employeeId: 'emp-3', employeeName: 'Elena Rostova', date: '2026-06-21', checkIn: '--:--', checkOut: '--:--', hoursWorked: 0, status: 'Absent', department: 'Product' }
];

const INITIAL_OVERTIME: Overtime[] = [
  { id: 'ot-1', employeeId: 'emp-2', employeeName: 'Marcus Vance', date: '2026-06-20', hours: 4, rate: 45, amount: 180 },
  { id: 'ot-2', employeeId: 'emp-4', employeeName: 'David Kim', date: '2026-06-19', hours: 2.5, rate: 40, amount: 100 },
  { id: 'ot-3', employeeId: 'emp-6', employeeName: 'Nicholas Reyes', date: '2026-06-18', hours: 3, rate: 35, amount: 105 }
];

const INITIAL_PAYROLL: Payroll[] = [
  { id: 'pay-1', employeeId: 'emp-1', employeeName: 'Sarah Jenkins', month: 'June 2026', baseSalary: 9166, overtime: 0, deductions: 450, netSalary: 8716 },
  { id: 'pay-2', employeeId: 'emp-2', employeeName: 'Marcus Vance', month: 'June 2026', baseSalary: 15416, overtime: 180, deductions: 950, netSalary: 14646 },
  { id: 'pay-3', employeeId: 'emp-3', employeeName: 'Elena Rostova', month: 'June 2026', baseSalary: 11250, overtime: 0, deductions: 500, netSalary: 10750 },
  { id: 'pay-4', employeeId: 'emp-4', employeeName: 'David Kim', month: 'June 2026', baseSalary: 11666, overtime: 100, deductions: 600, netSalary: 11166 },
  { id: 'pay-5', employeeId: 'emp-5', employeeName: 'Amara Diop', month: 'June 2026', baseSalary: 10416, overtime: 0, deductions: 400, netSalary: 10016 }
];

const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Amara Diop', email: 'amara.d@enterprise.co', role: 'Super Admin', status: 'Active' },
  { id: 'user-2', name: 'Sarah Jenkins', email: 'sarah.j@enterprise.co', role: 'HR Manager', status: 'Active' },
  { id: 'user-3', name: 'Marcus Vance', email: 'm.vance@enterprise.co', role: 'Department Manager', status: 'Active' },
  { id: 'user-4', name: 'Elena Rostova', email: 'e.rostova@enterprise.co', role: 'Department Manager', status: 'Active' },
  { id: 'user-5', name: 'Liam Sterling', email: 'l.sterling@enterprise.co', role: 'Payroll Officer', status: 'Active' },
  { id: 'user-6', name: 'Nicholas Reyes', email: 'n.reyes@enterprise.co', role: 'Employee', status: 'Active' }
];

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('hrms_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('hrms_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('hrms_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [goals, setGoals] = useState<PerformanceGoal[]>(() => {
    const saved = localStorage.getItem('hrms_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('hrms_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('hrms_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [attendances, setAttendances] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('hrms_attendances');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [overtimes, setOvertimes] = useState<Overtime[]>(() => {
    const saved = localStorage.getItem('hrms_overtimes');
    return saved ? JSON.parse(saved) : INITIAL_OVERTIME;
  });

  const [payrolls, setPayrolls] = useState<Payroll[]>(() => {
    const saved = localStorage.getItem('hrms_payrolls');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hrms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hrms_employees', JSON.stringify(employees));
    setDepartments(prev => prev.map(dept => ({
      ...dept,
      totalEmployees: employees.filter(e => e.department.toLowerCase() === dept.name.toLowerCase() && e.status !== 'Terminated').length
    })));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hrms_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('hrms_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('hrms_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('hrms_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('hrms_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('hrms_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('hrms_overtimes', JSON.stringify(overtimes));
  }, [overtimes]);

  useEffect(() => {
    localStorage.setItem('hrms_payrolls', JSON.stringify(payrolls));
  }, [payrolls]);

  useEffect(() => {
    localStorage.setItem('hrms_users', JSON.stringify(users));
  }, [users]);

  const addLog = useCallback((action: string, module: ActivityLog['module'], type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Amara Diop (HR Administrator)',
      action,
      module,
      type,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 100));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    toast.info('Activity history log cleared');
  }, []);

  const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'startDate'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [newEmployee, ...prev]);
    addLog(`Onboarded new employee: ${newEmployee.name} (${newEmployee.role})`, 'Employees', 'success');
    toast.success(`Successfully onboarded ${newEmployee.name}!`);
  }, [addLog]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, ...updates };
          if (updates.name) {
            setLeaveRequests((leaves) =>
              leaves.map((l) => (l.employeeId === id ? { ...l, employeeName: updates.name! } : l))
            );
            setGoals((gls) =>
              gls.map((g) => (g.employeeId === id ? { ...g, employeeName: updates.name! } : g))
            );
          }
          return updated;
        }
        return emp;
      })
    );
    addLog(`Updated employee details for ${updates.name || 'ID ' + id}`, 'Employees', 'info');
    toast.success('Employee profile updated successfully');
  }, [addLog]);

  const deleteEmployee = useCallback((id: string) => {
    const employee = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    addLog(`Deleted employee record for ${employee ? employee.name : id}`, 'Employees', 'warning');
    toast.warning(`${employee ? employee.name : 'Employee'} has been offboarded`);
  }, [employees, addLog]);

  const addCandidate = useCallback((candidate: Omit<Candidate, 'id' | 'appliedDate' | 'stage' | 'status'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: `cand-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'Applied',
      status: 'active',
    };
    setCandidates((prev) => [newCandidate, ...prev]);
    addLog(`Registered candidate application: ${newCandidate.name} for ${newCandidate.role}`, 'Recruitment', 'info');
    toast.success(`Application received for ${newCandidate.name}`);
  }, [addLog]);

  const updateCandidateStage = useCallback((id: string, stage: Candidate['stage']) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === id) {
          addLog(`Moved candidate ${cand.name} to stage: ${stage}`, 'Recruitment', 'info');
          return { ...cand, stage };
        }
        return cand;
      })
    );
    toast.info(`Candidate stage updated to ${stage}`);
  }, [addLog]);

  const rejectCandidate = useCallback((id: string) => {
    const cand = candidates.find((c) => c.id === id);
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
    if (cand) {
      addLog(`Rejected candidate ${cand.name} application`, 'Recruitment', 'warning');
      toast.error(`Application filed as rejected for ${cand.name}`);
    }
  }, [candidates, addLog]);

  const hireCandidate = useCallback((id: string) => {
    const cand = candidates.find((c) => c.id === id);
    if (!cand) return;

    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: 'Hired' } : c))
    );

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: cand.name,
      email: cand.email,
      role: cand.role,
      department: cand.department,
      status: 'Active',
      location: 'Remote Work',
      startDate: new Date().toISOString().split('T')[0],
      salary: 95000,
      performanceRating: 5.0,
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150`,
      phone: cand.phone,
      gender: 'Male',
    };

    setEmployees((prev) => [newEmp, ...prev]);
    addLog(`HIRED candidate: ${cand.name} is now onboarded as a full-time ${cand.role}!`, 'Recruitment', 'success');
    toast.success(`Hired & Onboarded ${cand.name}! 🎉 Welcome to the team.`);
  }, [candidates, addLog]);

  const submitLeaveRequest = useCallback((request: Omit<LeaveRequest, 'id' | 'status' | 'days'>) => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      ...request,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      days: diffDays,
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    addLog(`Submitted new leave request for ${request.employeeName} (${diffDays} days)`, 'Leave', 'info');
    toast.success(`Leave request submitted for ${request.employeeName}`);
  }, [addLog]);

  const approveLeaveRequest = useCallback((id: string) => {
    let leaveName = '';
    let empId = '';
    
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          leaveName = req.employeeName;
          empId = req.employeeId;
          return { ...req, status: 'Approved' };
        }
        return req;
      })
    );

    if (empId) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === empId ? { ...emp, status: 'On Leave' } : emp))
      );
    }

    addLog(`Approved leave request for ${leaveName}`, 'Leave', 'success');
    toast.success(`Approved leave request for ${leaveName}`);
  }, [addLog]);

  const rejectLeaveRequest = useCallback((id: string) => {
    let leaveName = '';
    setLeaveRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          leaveName = req.employeeName;
          return { ...req, status: 'Rejected' };
        }
        return req;
      })
    );
    addLog(`Rejected leave request for ${leaveName}`, 'Leave', 'warning');
    toast.error(`Rejected leave request for ${leaveName}`);
  }, [addLog]);

  const addPerformanceGoal = useCallback((goal: Omit<PerformanceGoal, 'id' | 'employeeName'>) => {
    const employee = employees.find((e) => e.id === goal.employeeId);
    if (!employee) return;

    const newGoal: PerformanceGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      employeeName: employee.name,
    };

    setGoals((prev) => [newGoal, ...prev]);
    addLog(`Assigned performance goal: "${goal.title}" to ${employee.name}`, 'Performance', 'info');
    toast.success(`Assigned goal to ${employee.name}`);
  }, [employees, addLog]);

  const updateGoalProgress = useCallback((id: string, progress: number, status: PerformanceGoal['status']) => {
    let goalTitle = '';
    let empName = '';

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          goalTitle = g.title;
          empName = g.employeeName;
          return { ...g, progress, status };
        }
        return g;
      })
    );

    addLog(`Updated goal "${goalTitle}" progress to ${progress}% for ${empName}`, 'Performance', 'info');
    toast.success(`Updated progress for ${empName} (${progress}%)`);
  }, [addLog]);

  const addDepartment = useCallback((dept: Omit<Department, 'id' | 'totalEmployees' | 'createdDate'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      totalEmployees: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setDepartments((prev) => [...prev, newDept]);
    addLog(`Created new department: ${newDept.name}`, 'Departments', 'success');
    toast.success(`Successfully registered ${newDept.name} Department!`);
  }, [addLog]);

  const updateDepartment = useCallback((id: string, updates: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    addLog(`Updated department details for ${updates.name || 'ID ' + id}`, 'Departments', 'info');
    toast.success('Department updated successfully');
  }, [addLog]);

  const deleteDepartment = useCallback((id: string) => {
    const dept = departments.find((d) => d.id === id);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    addLog(`Deleted department: ${dept ? dept.name : id}`, 'Departments', 'warning');
    toast.warning(`${dept ? dept.name : 'Department'} deleted`);
  }, [departments, addLog]);

  const addAttendanceRecord = useCallback((record: Omit<Attendance, 'id'>) => {
    const newRec: Attendance = {
      ...record,
      id: `att-${Date.now()}`,
    };
    setAttendances((prev) => [newRec, ...prev]);
    addLog(`Logged attendance for ${record.employeeName}: ${record.status}`, 'Attendance', 'success');
    toast.success(`Logged attendance for ${record.employeeName}`);
  }, [addLog]);

  const updateAttendanceRecord = useCallback((id: string, updates: Partial<Attendance>) => {
    setAttendances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    addLog(`Modified attendance status for ID ${id}`, 'Attendance', 'info');
    toast.success('Attendance record updated');
  }, [addLog]);

  const addOvertimeRecord = useCallback((record: Omit<Overtime, 'id' | 'amount'>) => {
    const newRec: Overtime = {
      ...record,
      id: `ot-${Date.now()}`,
      amount: record.hours * record.rate,
    };
    setOvertimes((prev) => [newRec, ...prev]);
    addLog(`Logged overtime for ${record.employeeName}: ${record.hours}h`, 'Overtime', 'success');
    toast.success(`Logged overtime of ${record.hours} hours for ${record.employeeName}`);
  }, [addLog]);

  const deleteOvertimeRecord = useCallback((id: string) => {
    setOvertimes((prev) => prev.filter((o) => o.id !== id));
    addLog(`Deleted overtime record: ${id}`, 'Overtime', 'warning');
    toast.warning(`Overtime record removed`);
  }, [addLog]);

  const addPayrollRecord = useCallback((record: Omit<Payroll, 'id' | 'netSalary'>) => {
    const newRec: Payroll = {
      ...record,
      id: `pay-${Date.now()}`,
      netSalary: Number(record.baseSalary) + Number(record.overtime) - Number(record.deductions),
    };
    setPayrolls((prev) => [newRec, ...prev]);
    addLog(`Generated payslip for ${record.employeeName} (${record.month})`, 'Payroll', 'success');
    toast.success(`Generated payslip for ${record.employeeName}`);
  }, [addLog]);

  const deletePayrollRecord = useCallback((id: string) => {
    setPayrolls((prev) => prev.filter((p) => p.id !== id));
    addLog(`Removed payslip record: ${id}`, 'Payroll', 'warning');
    toast.warning(`Payslip deleted`);
  }, [addLog]);

  const addUser = useCallback((user: Omit<User, 'id'>) => {
    const newRec: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newRec]);
    addLog(`Added system user: ${user.name} (${user.role})`, 'Users', 'success');
    toast.success(`User ${user.name} created!`);
  }, [addLog]);

  const updateUserRole = useCallback((id: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
    addLog(`Changed authority role to ${role} for user ID ${id}`, 'Users', 'info');
    toast.success('User role updated successfully');
  }, [addLog]);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addLog(`Deleted user account: ${id}`, 'Users', 'warning');
    toast.warning('User account removed');
  }, [addLog]);

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
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};
