import React from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SidebarItem } from './Sidebar';

interface MobileSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  sidebarMenu: SidebarItem[];
  expandedMenus: Record<string, boolean>;
  toggleSubmenu: (key: string) => void;
  getAccentBgClass: () => string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  sidebarMenu,
  expandedMenus,
  toggleSubmenu,
  getAccentBgClass
}) => {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950 z-40 transition-all cursor-pointer"
          ></motion.div>

          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 p-5 flex flex-col justify-between shadow-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-black ${getAccentBgClass()}`}>
                    H
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Workspace</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 border border-slate-100 dark:border-slate-800 text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <nav className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
                {sidebarMenu.map((item) => {
                  const IconComp = item.icon;
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isSubmenuExpanded = expandedMenus[item.menuKey || ''];

                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                            setMobileMenuOpen(false);
                          } else if (item.menuKey) {
                            toggleSubmenu(item.menuKey);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          item.active 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-l-2 border-indigo-600' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <IconComp size={15} className="opacity-80 shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        
                        {hasSubItems && (
                          <div className="text-slate-400 shrink-0">
                            {isSubmenuExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </div>
                        )}
                      </button>

                      {/* Mobile Sub-items list */}
                      {hasSubItems && isSubmenuExpanded && (
                        <div className="pl-4 ml-3 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-0.5">
                          {item.subItems!.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => {
                                sub.onClick();
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-[11px] rounded-lg transition-all cursor-pointer block truncate ${
                                sub.active 
                                  ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/20' 
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-1 text-[9px] text-slate-400 text-left">
              <p className="font-semibold text-slate-650 dark:text-slate-350">Amara Diop (HR Director)</p>
              <p className="font-mono">PDT Zone • SDK 2.4.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
