import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-205 dark:border-slate-800">
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 md:self-end shrink-0 select-none">
          {actions}
        </div>
      )}
    </div>
  );
};
