import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../app/layouts/AuthLayout';

export function UnauthorizedPage() {
  return (
    <AuthLayout>
      <div className="space-y-4 text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">You do not have access to this page.</p>
        <Link
          to="/app"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Go to dashboard
        </Link>
      </div>
    </AuthLayout>
  );
}
