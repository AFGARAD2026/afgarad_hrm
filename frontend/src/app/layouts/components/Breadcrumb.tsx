import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  activeView: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ activeView }) => {
  return (
    <div className="flex items-center gap-1.5 text-[10px] md:text-2xs font-semibold text-slate-400 dark:text-slate-500 select-none pb-2">
      <div className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
        <Home size={10} />
        <span>Enterprise Portal</span>
      </div>
      <ChevronRight size={10} className="text-slate-300 dark:text-slate-700" />
      <span className="hover:text-slate-650 dark:hover:text-slate-400 cursor-pointer">Human Resources</span>
      <ChevronRight size={10} className="text-slate-300 dark:text-slate-700" />
      <span className="text-slate-700 dark:text-slate-300 font-bold tracking-tight">
        {activeView}
      </span>
    </div>
  );
};
