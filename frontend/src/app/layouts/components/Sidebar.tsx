import React from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';

export interface SidebarSubItem {
  name: string;
  active: boolean;
  onClick: () => void;
}

export interface SidebarItem {
  name: string;
  icon: any;
  active: boolean;
  menuKey?: string;
  onClick?: () => void;
  subItems?: SidebarSubItem[];
}

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarMenu: SidebarItem[];
  expandedMenus: Record<string, boolean>;
  handleParentClick: (item: SidebarItem) => void;
  getAccentSidebarClass: (isActive: boolean) => string;
  getAccentSubmenuClass: (isActive: boolean) => string;
  accentColor: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  sidebarMenu,
  expandedMenus,
  handleParentClick,
  getAccentSidebarClass,
  getAccentSubmenuClass,
  accentColor
}) => {
  return (
    <aside className={`hidden lg:flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'} border-r border-slate-800 bg-slate-900 justify-between select-none shrink-0 text-slate-300 transition-all duration-300`}>
      <div className="space-y-4">
        {/* Header Toggle */}
        <div className={`p-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} border-b border-slate-800/60`}>
          {!sidebarCollapsed && <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Navigation</span>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 px-1.5 border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg transition-all cursor-pointer"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1 px-3">
          {sidebarMenu.map((item) => {
            const IconComp = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubmenuExpanded = expandedMenus[item.menuKey || ''] && !sidebarCollapsed;

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => handleParentClick(item)}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${getAccentSidebarClass(item.active)}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp size={15} className="opacity-80 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  
                  {!sidebarCollapsed && hasSubItems && (
                    <div className="text-slate-450 shrink-0">
                      {isSubmenuExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </div>
                  )}
                </button>

                {/* Sub-items list */}
                {hasSubItems && isSubmenuExpanded && (
                  <div className="pl-4 ml-3 border-l border-slate-800 space-y-1 mt-1 transition-all duration-205">
                    {item.subItems!.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={sub.onClick}
                        className={`w-full text-left px-3 py-2 text-[11px] rounded-lg transition-all cursor-pointer block truncate ${getAccentSubmenuClass(sub.active)}`}
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

        {/* Quick Stats sidebar widget */}
        {!sidebarCollapsed && (
          <div className="px-3">
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-800">
              <p className="text-slate-400 text-[9.5px] font-bold uppercase mb-1.5 tracking-wider">Cloud Storage Compliance</p>
              <div className="w-full bg-slate-700 rounded-full h-1 my-2">
                <div className={`h-1 rounded-full w-[72%] ${
                  accentColor === 'emerald' ? 'bg-emerald-500' :
                  accentColor === 'rose' ? 'bg-rose-500' :
                  accentColor === 'amber' ? 'bg-amber-500' :
                  accentColor === 'purple' ? 'bg-purple-500' :
                  'bg-indigo-500'
                }`}></div>
              </div>
              <p className="text-slate-500 text-[9px] font-medium font-mono">7.2 GB of 10 GB limit (OK)</p>
            </div>
          </div>
        )}
      </div>

      {/* Meta specifications info footer */}
      <div className={`border-t border-slate-800/80 py-4 space-y-1.5 ${sidebarCollapsed ? 'px-1 text-center' : 'px-4'} text-slate-550`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-1.5'} text-[9.5px] font-bold`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            accentColor === 'emerald' ? 'bg-emerald-500 animate-pulse' :
            accentColor === 'rose' ? 'bg-rose-500 animate-pulse' :
            accentColor === 'amber' ? 'bg-amber-500 animate-pulse' :
            accentColor === 'purple' ? 'bg-purple-500 animate-pulse' :
            'bg-indigo-500 animate-pulse'
          }`}></span>
          {!sidebarCollapsed && <p className="text-slate-400">System: Operational</p>}
        </div>
        {!sidebarCollapsed && <p className="text-[8.5px] font-mono leading-none">BUILD V: 1.42.02 • Relational Mode</p>}
      </div>
    </aside>
  );
};
