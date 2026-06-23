import { api } from "../../../lib/api/axios";
import type { ApiResponse } from "../../../lib/api/types";
import type { CreateDepartmentInput, DepartmentApiModel } from "../types";

export async function getDepartments() {
  const response =
    await api.get<ApiResponse<DepartmentApiModel[]>>("/api/departments");
  return response.data.data;
}

export async function getDepartmentById(id: string) {
  const response = await api.get<ApiResponse<DepartmentApiModel>>(
    `/api/departments/${id}`,
  );
  return response.data.data;
}

export async function createDepartment(data: CreateDepartmentInput) {
  const response = await api.post<ApiResponse<DepartmentApiModel>>(
    "/api/departments/create",
    data,
  );
  return response.data.data;
}
