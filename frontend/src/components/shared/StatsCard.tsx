import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
  iconColorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconColorClass = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between transition-colors duration-300"
    >
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </p>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">
          {value}
        </h3>
        {(description || trend) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {trend && (
              <span className={`text-[10px] font-bold font-mono px-1 py-0.5 rounded ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
              }`}>
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {description}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={`p-3 rounded-xl shrink-0 ${iconColorClass}`}>
        <Icon size={18} />
      </div>
    </motion.div>
  );
};
