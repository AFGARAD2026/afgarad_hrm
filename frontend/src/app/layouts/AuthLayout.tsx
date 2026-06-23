import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-md">
            H
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Enterprise HRMS Node</h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Secured Administrative Compliance Access</p>
        </div>
        {children}
      </div>
    </div>
  );
};
