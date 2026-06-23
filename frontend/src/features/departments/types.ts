export interface DepartmentApiModel {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
}

export interface CreateDepartmentInput {
  name: string;
  description: string;
}
