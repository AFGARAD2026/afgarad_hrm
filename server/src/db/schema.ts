import {
  pgTable,
  varchar,
  timestamp,
  date,
  numeric,
  text,
} from "drizzle-orm/pg-core";

export const departments = pgTable("departments", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),

  fullName: varchar("full_name", {
    length: 150,
  }).notNull(),

  email: varchar("email", {
    length: 150,
  })
    .notNull()
    .unique(),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  role: text("role").default("HRM_MANAGER").notNull(),

  status: varchar("status", {
    length: 30,
  }).default("ACTIVE"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: varchar("id", {
    length: 50,
  }).primaryKey(),

  name: varchar("name", {
    length: 150,
  }).notNull(),

  email: varchar("email", {
    length: 150,
  }).notNull(),

  departmentId: varchar("department_id", { length: 50 })
    .references(() => departments.id)
    .notNull(),

  role: varchar("role", {
    length: 100,
  }).notNull(),

  avatar: varchar("image", {
    length: 200,
  }).notNull(),

  status: varchar("status", {
    length: 30,
  }).default("ACTIVE"),

  baseSalary: numeric("base_salary", {
    precision: 12,
    scale: 2,
  }).notNull(),

  joinDate: date("join_date").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: varchar("id", {
    length: 50,
  }).primaryKey(),

  employeeId: varchar("employee_id", { length: 50 })
    .references(() => employees.id)
    .notNull(),

  attendanceDate: date("attendance_date").notNull(),

  status: varchar("status", {
    length: 30,
  }).notNull(),

  hoursWorked: numeric("hours_worked", {
    precision: 5,
    scale: 2,
  }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id", {
    length: 50,
  }).primaryKey(),

  employeeId: varchar("employee_id", { length: 50 })
    .references(() => employees.id)
    .notNull(),

  leaveType: varchar("leave_type", { length: 50 }).notNull(),

  startDate: date("start_date").notNull(),

  endDate: date("end_date").notNull(),

  status: varchar("status", {
    length: 30,
  }).default("PENDING"),

  reason: varchar("reason", {
    length: 500,
  }),
});

export const overtimes = pgTable("overtimes", {
  id: varchar("id", {
    length: 50,
  }).primaryKey(),

  employeeId: varchar("employee_id", { length: 50 })
    .references(() => employees.id)
    .notNull(),

  overtimeDate: date("overtime_date").notNull(),

  hours: numeric("hours", {
    precision: 5,
    scale: 2,
  }).notNull(),

  rate: numeric("rate", {
    precision: 10,
    scale: 2,
  }).notNull(),

  amount: numeric("amount", {
    precision: 12,
    scale: 2,
  }).notNull(),
});

export const performanceReviews = pgTable("performance_reviews", {
  id: varchar("id", {
    length: 50,
  }).primaryKey(),

  employeeId: varchar("employee_id", {
    length: 50,
  })
    .references(() => employees.id)
    .notNull(),

  reviewerId: varchar("reviewer_id", {
    length: 50,
  })
    .references(() => users.id)
    .notNull(),

  reviewDate: date("review_date").notNull(),

  score: numeric("score", {
    precision: 3,
    scale: 1,
  }),

  comments: varchar("comments", {
    length: 1000,
  }),
});

export const payslips = pgTable("payslips", {
  id: varchar("id", {
    length: 50,
  }).primaryKey(),

  employeeId: varchar("employee_id", { length: 50 })
    .references(() => employees.id)
    .notNull(),

  payrollMonth: varchar("payroll_month", {
    length: 20,
  }),

  baseSalary: numeric("base_salary", {
    precision: 12,
    scale: 2,
  }),

  overtimeAmount: numeric("overtime_amount", {
    precision: 12,
    scale: 2,
  }),

  deductions: numeric("deductions", {
    precision: 12,
    scale: 2,
  }),

  netSalary: numeric("net_salary", {
    precision: 12,
    scale: 2,
  }),

  generatedAt: timestamp("generated_at").defaultNow(),
});
