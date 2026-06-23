import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Search, Plus, RefreshCw } from "lucide-react";
import { useEmployees, useCreateEmployee } from "../hooks/useEmployees";
import { useDepartments } from "../../departments/hooks/useDepartments";

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  departmentId: z.string().min(1, "Department is required"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  baseSalary: z.coerce.number().min(0, "Salary is required"),
  joinDate: z.string().min(1, "Join date is required"),
});

type EmployeeFormInput = z.infer<typeof employeeSchema>;

interface EmployeeDirectoryProps {
  isAddModalOpenFromApp: boolean;
  closeAddModalFromApp: () => void;
}

export function EmployeeDirectory({
  isAddModalOpenFromApp,
  closeAddModalFromApp,
}: EmployeeDirectoryProps) {
  const { data: employees = [], isLoading, error, refetch } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const createEmployeeMutation = useCreateEmployee();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormInput>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      joinDate: new Date().toISOString().slice(0, 10),
    },
  });

  React.useEffect(() => {
    if (isAddModalOpenFromApp) {
      setIsOpen(true);
    }
  }, [isAddModalOpenFromApp]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

  const openCreate = () => {
    reset({
      name: "",
      email: "",
      departmentId: departments[0]?.id ?? "",
      role: "",
      baseSalary: 0,
      joinDate: new Date().toISOString().slice(0, 10),
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: EmployeeFormInput) => {
    try {
      await createEmployeeMutation.mutateAsync({
        ...data,
        baseSalary: Number(data.baseSalary),
      });
      toast.success("Employee created successfully");
      setIsOpen(false);
      closeAddModalFromApp();
      reset();
    } catch (submitError: any) {
      toast.error(
        submitError?.response?.data?.message ||
          submitError?.response?.data?.error ||
          "Failed to create employee",
      );
    }
  };

  const departmentNameById = (departmentId: string) =>
    departments.find((department) => department.id === departmentId)?.name ??
    departmentId;

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
            placeholder="Search employees by name, email, or role"
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
            Add Employee
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading employees...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
          Failed to load employees.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/40">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Base Salary</th>
                  <th className="px-4 py-3">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees?.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {employee.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {employee.email}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {departmentNameById(employee.departmentId)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {employee.role}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        ${Number(employee.baseSalary).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {employee.joinDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create Employee
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  closeAddModalFromApp();
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
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <select
                  {...register("departmentId")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("role")}
                  placeholder="Role"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.role && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  {...register("baseSalary")}
                  placeholder="Base salary"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.baseSalary && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.baseSalary.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  {...register("joinDate")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                {errors.joinDate && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.joinDate.message}
                  </p>
                )}
              </div>
              <button
                disabled={createEmployeeMutation.isPending}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70"
              >
                {createEmployeeMutation.isPending
                  ? "Saving..."
                  : "Create Employee"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
