import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Candidate, RecruitmentStage } from '../types';
import { 
  Search, 
  Plus, 
  Star, 
  MapPin, 
  ChevronRight, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Trash2, 
  Award, 
  UserCheck, 
  UserPlus, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const candidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  department: z.enum(['Engineering', 'Design', 'Product', 'Marketing', 'HR & Operations', 'Sales']),
  rating: z.coerce.number().min(1).max(5),
  phone: z.string().min(6, 'Valid phone number is required'),
});

type CandidateFormInput = z.infer<typeof candidateSchema>;

export const RecruitmentPipeline: React.FC = () => {
  const { candidates, addCandidate, updateCandidateStage, rejectCandidate, hireCandidate } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewCandidateOpen, setIsNewCandidateOpen] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CandidateFormInput>({
    resolver: zodResolver(candidateSchema) as any,
    defaultValues: {
      rating: 4,
      department: 'Engineering'
    }
  });

  const onSubmit = (data: CandidateFormInput) => {
    addCandidate(data);
    setIsNewCandidateOpen(false);
    reset();
  };

  const STAGES: RecruitmentStage[] = ['Applied', 'Screening', 'Interview', 'Offered', 'Hired'];

  const getStageHeaderColor = (stage: RecruitmentStage) => {
    switch(stage) {
      case 'Applied': return 'bg-blue-500';
      case 'Screening': return 'bg-amber-500';
      case 'Interview': return 'bg-indigo-500';
      case 'Offered': return 'bg-purple-500';
      case 'Hired': return 'bg-emerald-500';
    }
  };

  const activeCandidates = candidates.filter(
    c => c.status === 'active' && 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCandidatesByStage = (stage: RecruitmentStage) => {
    return activeCandidates.filter(c => c.stage === stage);
  };

  const handleAdvanceStage = (id: string, currentStage: RecruitmentStage) => {
    const currentIndex = STAGES.indexOf(currentStage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      updateCandidateStage(id, nextStage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header and quick triggers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search candidates by name or applied role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <button 
          onClick={() => setIsNewCandidateOpen(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-sm hover:scale-101 active:scale-99 transition-all shrink-0"
        >
          <UserPlus size={14} />
          Record Applicant
        </button>
      </div>

      {/* Kanban Stage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const list = getCandidatesByStage(stage);
          const headerDotColor = getStageHeaderColor(stage);

          return (
            <div key={stage} className="flex flex-col min-w-[220px] bg-slate-50 border border-slate-200 rounded-xl p-3.5 min-h-[500px]">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${headerDotColor}`}></span>
                  <span className="text-xs font-bold text-slate-900">{stage}</span>
                </div>
                <span className="text-[10px] bg-white border border-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold shadow-2xs">
                  {list.length}
                </span>
              </div>

              {/* Stack container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                {list.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center text-slate-400 h-28">
                    <p className="text-[10px] font-semibold">Column is empty</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {list.map((cand) => (
                      <motion.div
                        key={cand.id}
                        layoutId={cand.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-3.5 space-y-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all relative group"
                      >
                        {/* Title details */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{cand.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{cand.role}</p>
                        </div>

                        {/* Middle info tags */}
                        <div className="pt-2 border-t border-slate-55 flex flex-wrap gap-1">
                          <span className="text-[9px] bg-slate-50 text-slate-500 font-medium px-1.5 py-0.5 rounded border border-slate-100">
                            {cand.department}
                          </span>
                          <span className="text-[9px] bg-slate-50 text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-0.5">
                            <Calendar size={9} />
                            Applied: {cand.appliedDate}
                          </span>
                        </div>

                        {/* Stats rating & phone details */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center text-amber-500 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={10} 
                                className={i < cand.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-[9px] text-slate-400 font-mono">{cand.phone}</p>
                        </div>

                        {/* Context triggers */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          <button 
                            onClick={() => rejectCandidate(cand.id)}
                            className="text-[9.5px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg py-1 px-2 cursor-pointer transition-all"
                          >
                            Reject
                          </button>

                          {stage === 'Offered' ? (
                            <button
                              onClick={() => hireCandidate(cand.id)}
                              className="text-[9.5px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg py-1.5 px-3 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                            >
                              <UserCheck size={11} />
                              Onboard Now!
                            </button>
                          ) : stage !== 'Hired' ? (
                            <button 
                              onClick={() => handleAdvanceStage(cand.id, stage)}
                              className="text-[9.5px] font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-100 hover:border-indigo-600 rounded-lg py-1 px-2.5 flex items-center gap-0.5 cursor-pointer transition-all duration-150"
                            >
                              <span>Next</span>
                              <ChevronRight size={11} />
                            </button>
                          ) : (
                            <span className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1 py-1 px-2">
                              <Award size={12} /> Onboarded
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Drawer: Add Candidate Modal */}
      <AnimatePresence>
        {isNewCandidateOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCandidateOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40"
            ></motion.div>

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white border-l border-slate-100 z-50 flex flex-col justify-between shadow-2xl"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                <div className="overflow-y-auto flex-1 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900">Record Job Applicant Dossier</h3>
                    <button 
                      type="button"
                      onClick={() => setIsNewCandidateOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    File a new prospect candidate details into standard Recruitment Pipeline stage tracking.
                  </p>

                  <div className="space-y-4">
                    {/* Candidate Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Applicant Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Jean Dupont"
                        {...register('name')}
                        className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.name && <p className="text-[10px] text-rose-500">{errors.name.message}</p>}
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Personal Email</label>
                      <input 
                        type="email" 
                        placeholder="e.g. j.dupont@gmail.com"
                        {...register('email')}
                        className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.email && <p className="text-[10px] text-rose-500">{errors.email.message}</p>}
                    </div>

                    {/* Role Target */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Target Role</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Senior Product Designer"
                        {...register('role')}
                        className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.role && <p className="text-[10px] text-rose-500">{errors.role.message}</p>}
                    </div>

                    {/* Contact Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Contact Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +1 (555) 901-2244"
                        {...register('phone')}
                        className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone.message}</p>}
                    </div>

                    {/* Selector Dept & Rating */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Department Pool</label>
                        <select 
                          {...register('department')}
                          className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Product">Product</option>
                          <option value="Marketing">Marketing</option>
                          <option value="HR & Operations">HR & Operations</option>
                          <option value="Sales">Sales</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Initial Rating (1-5)</label>
                        <select 
                          {...register('rating')}
                          className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                        >
                          <option value="1">1 Star</option>
                          <option value="2">2 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="5">5 Stars</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foot submit bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsNewCandidateOpen(false)}
                    className="flex-1 text-xs text-slate-600 hover:text-slate-800 font-bold border border-slate-200 hover:bg-slate-100 rounded-xl py-3 cursor-pointer bg-white transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 text-xs text-white font-bold bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 cursor-pointer shadow-indigo-100 shadow-sm hover:scale-101 active:scale-99 transition-all text-center"
                  >
                    File Candidate
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
