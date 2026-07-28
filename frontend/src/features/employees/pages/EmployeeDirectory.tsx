import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Search, Plus, RefreshCw } from "lucide-react";
import { useEmployees, useCreateEmployee } from "../hooks/useEmployees";
import { useDepartments } from "../../departments/hooks/useDepartments";
import type { EmployeeApiModel } from "../types";

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
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeApiModel | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    return (employees as EmployeeApiModel[]).filter(
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
    setSelectedEmployee(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEmployee(null);
    closeAddModalFromApp();
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: EmployeeFormInput) => {
    try {
      await createEmployeeMutation.mutateAsync({
        ...data,
        baseSalary: Number(data.baseSalary),
      });
      toast.success("Employee created successfully");
      closeModal();
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

  const formatSalary = (value: string | number) =>
    `$${Number(value).toLocaleString()}`;

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
                      onClick={() => setSelectedEmployee(employee)}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30"
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
                        {formatSalary(employee.baseSalary)}
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

      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Employee Details
              </h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400"
              >
                x
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Personal Info
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Full name
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedEmployee.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Email
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedEmployee.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Role & Department
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Role
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedEmployee.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Department
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {departmentNameById(selectedEmployee.departmentId)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Employment Details
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Base salary
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatSalary(selectedEmployee.baseSalary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Joined
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedEmployee.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {selectedEmployee.status && (
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Status
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedEmployee.status}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedEmployee(null)}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Close
              </button>
            </div>
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
              <button onClick={closeModal} className="text-slate-400">
                x
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Employee photo
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-500 dark:hover:bg-slate-800">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Employee preview"
                      className="mb-3 h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                      <Plus size={20} />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {selectedImage
                      ? selectedImage.name
                      : "Upload employee image"}
                  </span>
                  <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, or JPEG up to a few MB
                  </span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full name
                  </label>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department
                  </label>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Role
                  </label>
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Base salary
                  </label>
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
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Join date
                  </label>
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
