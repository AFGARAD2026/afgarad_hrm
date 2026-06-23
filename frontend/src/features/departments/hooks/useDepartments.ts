import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  getDepartmentById,
  getDepartments,
} from "../api/departments.api";
import type { CreateDepartmentInput } from "../types";

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  detail: (id: string) => [...departmentKeys.all, "detail", id] as const,
};

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: getDepartments,
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => getDepartmentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentInput) => createDepartment(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}
