import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  getEmployeeById,
  getEmployees,
} from "../api/employees.api";
import type { CreateEmployeeInput } from "../types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: getEmployees,
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeInput) => createEmployee(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}
