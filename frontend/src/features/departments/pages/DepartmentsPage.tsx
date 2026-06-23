import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Search, Plus, RefreshCw } from "lucide-react";
import { useCreateDepartment, useDepartments } from "../hooks/useDepartments";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  description: z.string().min(2, "Description is required"),
});

type DepartmentFormInput = z.infer<typeof departmentSchema>;

interface DepartmentsPageProps {
  isAddModalOpenFromApp?: boolean;
  closeAddModalFromApp?: () => void;
}

export function DepartmentsPage({
  isAddModalOpenFromApp = false,
  closeAddModalFromApp,
}: DepartmentsPageProps) {
  const {
    data: departments = [],
    isLoading,
    error,
    refetch,
  } = useDepartments();
  const createDepartmentMutation = useCreateDepartment();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormInput>({
    resolver: zodResolver(departmentSchema),
  });

  React.useEffect(() => {
    if (isAddModalOpenFromApp) {
      setIsOpen(true);
    }
  }, [isAddModalOpenFromApp]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.description ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [departments, searchTerm]);

  const openCreate = () => {
    reset({ name: "", description: "" });
    setIsOpen(true);
  };

  const onSubmit = async (data: DepartmentFormInput) => {
    try {
      await createDepartmentMutation.mutateAsync(data);
      toast.success("Department created successfully");
      setIsOpen(false);
      closeAddModalFromApp?.();
      reset();
    } catch (submitError: any) {
      toast.error(
        submitError?.response?.data?.message ||
          submitError?.response?.data?.error ||
          "Failed to create department",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search departments"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Plus size={14} />
            Add Department
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading departments...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
          Failed to load departments.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDepartments.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              No departments found.
            </div>
          ) : (
            filteredDepartments.map((department) => (
              <div
                key={department.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {department.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {department.description || "No description provided."}
                  </p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                  ID: {department.id}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create Department
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  closeAddModalFromApp?.();
                }}
                className="text-slate-400"
              >
                x
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div>
                <input
                  {...register("name")}
                  placeholder="Department name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Description"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <button
                disabled={createDepartmentMutation.isPending}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
              >
                {createDepartmentMutation.isPending
                  ? "Saving..."
                  : "Create Department"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
