import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No matching records found',
  loading = false
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 font-semibold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    <span className="font-semibold">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-405 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={keyExtractor(row)} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-slate-750 dark:text-slate-300 transition-colors"
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={`p-4 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
