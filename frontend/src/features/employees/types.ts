export interface EmployeeApiModel {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: string;
  status?: string;
  baseSalary: string | number;
  joinDate: string;
  createdAt?: string;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  departmentId: string;
  role: string;
  baseSalary: number;
  joinDate: string;
  image?: string;
}
