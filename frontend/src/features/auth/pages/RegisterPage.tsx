import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from '../../../app/layouts/AuthLayout';
import { useAuth } from '../../../app/providers/AuthProvider';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormInput = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await createAccount(data);
      toast.success('Account created successfully');
      navigate('/app', { replace: true });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Unable to register';
      toast.error(message);
    }
  };

  return (
    <AuthLayout>
      <form className="space-y-4 text-left" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Full name</label>
          <input
            type="text"
            placeholder="Amina Hassan"
            {...register('fullName')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.fullName && <p className="text-xs text-rose-600">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            {...register('email')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            {...register('password')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-center text-xs text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Back to sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
