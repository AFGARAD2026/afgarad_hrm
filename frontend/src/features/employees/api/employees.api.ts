import { api } from "../../../lib/api/axios";
import type { ApiResponse } from "../../../lib/api/types";
import type { CreateEmployeeInput, EmployeeApiModel } from "../types";

export async function getEmployees() {
  const response =
    await api.get<ApiResponse<EmployeeApiModel[]>>("/api/employees");
  return response.data.data;
}

export async function getEmployeeById(id: string) {
  const response = await api.get<ApiResponse<EmployeeApiModel>>(
    `/api/employees/${id}`,
  );
  return response.data.data;
}

export async function createEmployee(data: CreateEmployeeInput) {
  const response = await api.post<ApiResponse<EmployeeApiModel>>(
    "/api/employees/create",
    data,
  );
  return response.data.data;
}
