import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "../../../app/layouts/AuthLayout";
import { useAuth } from "../../../app/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/app";
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await login(data);
      toast.success("Logged in successfully");
      setShouldRedirect(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to login";
      toast.error(message);
    }
  };

  React.useEffect(() => {
    if (shouldRedirect && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate, shouldRedirect]);

  return (
    <AuthLayout>
      <form className="space-y-4 text-left" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Email
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            {...register("email")}
            className="w-full rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="w-full rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-xs text-slate-500">
          No account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
