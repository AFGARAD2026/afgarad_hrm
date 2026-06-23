import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 transition-all duration-300">
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-505 rounded-2xl mb-4 shrink-0">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm leading-normal">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
