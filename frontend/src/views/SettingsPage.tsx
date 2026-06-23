import React, { useState, useEffect } from 'react';
import { useHR } from '../context/HRContext';
import { 
  Building2, 
  Trash2, 
  RotateCcw, 
  Palette, 
  ShieldCheck, 
  Sliders, 
  Globe, 
  DollarSign, 
  Mail, 
  Lock,
  Compass
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPageProps {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ accentColor, setAccentColor }) => {
  const { clearLogs } = useHR();
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('hrms_company_name') || 'Enterprise Corp.');
  const [currency, setCurrency] = useState(() => localStorage.getItem('hrms_company_currency') || 'USD ($)');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('hrms_company_timezone') || 'UTC -07:00 (Pacific Time)');
  const [reviewInterval, setReviewInterval] = useState('Semi-Annually (6 Mo)');

  useEffect(() => {
    localStorage.setItem('hrms_company_name', companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem('hrms_company_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('hrms_company_timezone', timezone);
  }, [timezone]);

  const handleClearSandboxMemory = () => {
    if (confirm('Acknowledge: This will completely flush all custom employees, recruitment boards, and leave requests, resetting sandbox back to factory settings. Proceed?')) {
      localStorage.removeItem('hrms_employees');
      localStorage.removeItem('hrms_candidates');
      localStorage.removeItem('hrms_leave_requests');
      localStorage.removeItem('hrms_goals');
      localStorage.removeItem('hrms_logs');
      toast.success('Sandbox memory cleared! Reloading dashboard instance...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleSaveWorkspaceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Workspace administration parameters locked in!');
  };

  const ACCENTS = [
    { name: 'Indigo Space', value: 'indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200' },
    { name: 'Emerald Forest', value: 'emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200' },
    { name: 'Cosmic Magenta', value: 'rose', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-200' },
    { name: 'Solar Amber', value: 'amber', bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-200' },
    { name: 'Deep Amethyst', value: 'purple', bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column navigation cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Settings Hub</h3>
            <p className="text-[10px] text-slate-400">Configure administrative rules, aesthetic design sheets, and database controllers.</p>
            
            <div className="pt-2 border-t border-slate-50 space-y-1">
              <span className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50/50 rounded-xl leading-none">
                <Sliders size={14} /> Customization
              </span>
              <span className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 rounded-xl leading-none cursor-not-allowed">
                <Lock size={14} /> Active Directory (SSO)
              </span>
              <span className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 rounded-xl leading-none cursor-not-allowed">
                <ShieldCheck size={14} /> Privacy & Compliance
              </span>
            </div>
          </div>
        </div>

        {/* Right column options */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Aesthetic Personalization */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Palette size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Workspace Aesthetic Design</h4>
                <p className="text-[10px] text-slate-400">Personalize corporate highlighting accents across the workspace panel.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.value}
                  onClick={() => {
                    setAccentColor(acc.value);
                    toast.success(`Branding color schemes adjusted to ${acc.name}!`);
                  }}
                  className={`flex items-center justify-between p-3 border rounded-xl text-left cursor-pointer transition-all ${
                    accentColor === acc.value 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full ${acc.bg} shrink-0`}></span>
                    <span className="text-xs font-semibold text-slate-700">{acc.name}</span>
                  </div>
                  {accentColor === acc.value && (
                    <span className="text-[10px] text-indigo-600 font-bold">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Business Profile configs */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Building2 size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Corporate System Parameters</h4>
                <p className="text-[10px] text-slate-400">Lock in compliance, default valuation base, and location metrics.</p>
              </div>
            </div>

            <form onSubmit={handleSaveWorkspaceSettings} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Legal Business Entity</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Corporate Base Currency</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="EUR (€)">EUR (€) - Eurozone Euro</option>
                    <option value="GBP (£)">GBP (£) - UK Sterling Pound</option>
                    <option value="KRW (₩)">KRW (₩) - Korean Won</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">HQ Timezone Node</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                  >
                    <option value="UTC -07:00 (Pacific Time)">UTC -07:00 (Pacific Time)</option>
                    <option value="UTC +00:00 (Coordinated Universal)">UTC +00:00 (Coordinated Universal)</option>
                    <option value="UTC +01:00 (Central European)">UTC +01:00 (Central European)</option>
                    <option value="UTC +09:00 (S.Korean/Japan Time)">UTC +09:00 (S.Korean/Japan Time)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Performance Review Interval</label>
                  <select 
                    value={reviewInterval}
                    onChange={(e) => setReviewInterval(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                  >
                    <option value="Semi-Annually (6 Mo)">Semi-Annually (Every 6 Months)</option>
                    <option value="Quarterly (3 Mo)">Quarterly (Every 3 Months)</option>
                    <option value="Annually (12 Mo)">Annually (Once Academic Year)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-sm transition-all text-center"
                >
                  Apply Parameters
                </button>
              </div>
            </form>
          </div>

          {/* Sandbox Controls */}
          <div className="bg-white border-2 border-dashed border-rose-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-xs font-bold text-rose-800">Sandbox Developer Panel</h4>
              <p className="text-[10px] text-slate-400">Operational triggers to clear sandbox caches and local databases schemas.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={clearLogs}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 rounded-xl py-2.5 px-4 cursor-pointer transition-all"
              >
                <Trash2 size={13} />
                Flush Audit Logs
              </button>

              <button
                type="button"
                onClick={handleClearSandboxMemory}
                className="inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-100 rounded-xl py-2.5 px-4 cursor-pointer transition-all"
              >
                <RotateCcw size={13} />
                Reset Sandbox DB
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
