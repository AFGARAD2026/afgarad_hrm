CREATE TABLE "attendance" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"attendance_date" date NOT NULL,
	"status" varchar(30) NOT NULL,
	"hours_worked" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"department_id" varchar(50) NOT NULL,
	"role" varchar(100) NOT NULL,
	"image" varchar(200),
	"status" varchar(30) DEFAULT 'ACTIVE',
	"base_salary" numeric(12, 2) NOT NULL,
	"join_date" date NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"leave_type" varchar(50) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" varchar(30) DEFAULT 'PENDING',
	"reason" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "overtimes" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"overtime_date" date NOT NULL,
	"hours" numeric(5, 2) NOT NULL,
	"rate" numeric(10, 2) NOT NULL,
	"amount" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payslips" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"payroll_month" varchar(20),
	"base_salary" numeric(12, 2),
	"overtime_amount" numeric(12, 2),
	"deductions" numeric(12, 2),
	"net_salary" numeric(12, 2),
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "performance_reviews" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"reviewer_id" varchar(50) NOT NULL,
	"review_date" date NOT NULL,
	"score" numeric(3, 1),
	"comments" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email" varchar(150) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" text DEFAULT 'HRM_MANAGER' NOT NULL,
	"status" varchar(30) DEFAULT 'ACTIVE',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "overtimes" ADD CONSTRAINT "overtimes_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;