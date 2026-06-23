import React from 'react';

interface LoadingProps {
  fullPage?: boolean;
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  fullPage = false, 
  message = 'Processing secure compliance records...' 
}) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xs">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-4 text-center">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <p className="text-xs font-bold text-slate-705 dark:text-slate-300 font-mono tracking-tight">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center gap-1.5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
      <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold font-mono tracking-tight">
        {message}
      </p>
    </div>
  );
};
