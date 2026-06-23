import React, { useState } from 'react';
import { useHR } from '../../../app/providers/HRProvider';
import { PerformanceGoal, GoalStatus } from '../../../types';
import { 
  Users, 
  Target, 
  Award, 
  CheckCircle2, 
  Sliders, 
  Percent, 
  Plus, 
  Calendar, 
  Sparkles, 
  TrendingUp,
  X,
  Search,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const goalSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetDate: z.string().min(1, 'Target date is required'),
  category: z.enum(['Sales', 'Technical', 'Leadership', 'Operational', 'Culture']),
});

type GoalFormInput = z.infer<typeof goalSchema>;

export const PerformanceReview: React.FC = () => {
  const { employees, goals, addPerformanceGoal, updateGoalProgress } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalFormInput>({
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      category: 'Technical'
    }
  });

  const onSubmit = (data: GoalFormInput) => {
    addPerformanceGoal({
      ...data,
      progress: 0,
      status: 'Not Started'
    });
    setIsNewGoalOpen(false);
    reset();
  };

  const handleIncrementProgress = (goal: PerformanceGoal) => {
    const nextProgress = Math.min(goal.progress + 10, 100);
    const nextStatus: GoalStatus = nextProgress === 100 ? 'Achieved' : 'On Track';
    updateGoalProgress(goal.id, nextProgress, nextStatus);
  };

  const handleDecrementProgress = (goal: PerformanceGoal) => {
    const nextProgress = Math.max(goal.progress - 10, 0);
    const nextStatus: GoalStatus = nextProgress === 100 ? 'Achieved' : nextProgress === 0 ? 'Not Started' : 'On Track';
    updateGoalProgress(goal.id, nextProgress, nextStatus);
  };

  // Metrics
  const totalActives = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Achieved').length;
  const averageProgress = Math.round(goals.reduce((acc, curr) => acc + curr.progress, 0) / (totalActives || 1));

  // Filter Goals List
  const filteredGoals = goals.filter(g => 
    g.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Top metrics tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">KPI Targets Managed</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalActives} Active</p>
            <p className="text-[10px] text-slate-500">Across 6 different department sectors</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/35">
            <Target size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Goal Progress Index</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{averageProgress}% Mean</p>
            <p className="text-[10px] text-slate-500">Milestone accomplishment mean rate</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/35">
            <Percent size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Achieved Milestones</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedGoals} Targets</p>
            <p className="text-[10px] text-slate-500">Success validations logged live</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-955/25 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100/35">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Directory controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search milestones, assignees, categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-55/40 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        <button 
          onClick={() => setIsNewGoalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl px-4 py-2.5 cursor-pointer shadow-sm shadow-indigo-200 hover:scale-101 active:scale-99 transition-all shrink-0"
        >
          <Plus size={14} />
          Assign Target
        </button>
      </div>

      {/* KPI Goals Lists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGoals.map((goal) => {
          const statusColors = 
            goal.status === 'Achieved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' :
            goal.status === 'Behind' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/30' :
            goal.status === 'Not Started' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-450 dark:border-slate-700' :
            'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30';

          return (
            <motion.div 
              key={goal.id}
              layout
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all hover:border-slate-350 dark:hover:border-slate-700 relative group overflow-hidden hover:shadow-md"
            >
              {/* Category label */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded px-1.5 py-0.5 text-slate-500 font-bold shrink-0">
                  {goal.category}
                </span>

                <span className={`text-[9.5px] px-2 py-0.5 border rounded-md font-bold ${statusColors}`}>
                  {goal.status}
                </span>
              </div>

              {/* Title descriptions */}
              <div className="space-y-1.5 mt-4 text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-all">{goal.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium font-mono">Assignee: {goal.employeeName}</p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-3">
                  {goal.description}
                </p>
              </div>

              {/* Slider scale */}
              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Progress Done</span>
                  <span className="font-extrabold text-slate-805 dark:text-slate-200">{goal.progress}%</span>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      goal.status === 'Achieved' ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`} 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Date & Interactive Progress Steppers */}
              <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-1 text-[9.5px] font-semibold text-slate-400 whitespace-nowrap">
                  <Calendar size={11} />
                  <span>Due {goal.targetDate}</span>
                </div>

                {goal.status !== 'Achieved' ? (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDecrementProgress(goal)}
                      disabled={goal.progress <= 0}
                      className="w-6 h-6 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-350 font-bold bg-white dark:bg-slate-900 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 select-none cursor-pointer text-xs flex items-center justify-center"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => handleIncrementProgress(goal)}
                      disabled={goal.progress >= 100}
                      className="w-14 h-6 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-md select-none cursor-pointer text-[10px] flex items-center justify-center"
                    >
                      +10%
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-extrabold text-emerald-600 inline-flex items-center gap-1 py-0.5">
                    <CheckCircle2 size={11} className="text-emerald-500" /> Goal Achieved!
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide Drawer: New Objective Goal Form */}
      <AnimatePresence>
        {isNewGoalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewGoalOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40"
            ></motion.div>

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-105 dark:border-slate-800 z-50 flex flex-col justify-between shadow-2xl"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full text-left">
                <div className="overflow-y-auto flex-1 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Assign Work Performance KPI</h3>
                    <button 
                      type="button"
                      onClick={() => setIsNewGoalOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Construct and assign an active measurable objective milestone target to an employee under continuous feedback reviews.
                  </p>

                  <div className="space-y-4">
                    {/* Choose Employee */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Target Employee Profile</label>
                      <select 
                        {...register('employeeId')}
                        className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                      >
                        <option value="">-- Select Target Employee --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                        ))}
                      </select>
                      {errors.employeeId && <p className="text-[10px] text-rose-500">{errors.employeeId.message}</p>}
                    </div>

                    {/* Choose Category */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Category / Dimension</label>
                      <select 
                        {...register('category')}
                        className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                      >
                        <option value="Technical">Technical Milestone</option>
                        <option value="Sales">Sales & Revenue Conversion</option>
                        <option value="Leadership">Leadership & Management</option>
                        <option value="Operational">Operational Metrics</option>
                        <option value="Culture">Company Culture & Satisfaction</option>
                      </select>
                    </div>

                    {/* Goal Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Objective Milestone Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Optimize Database Latencies under 12ms"
                        {...register('title')}
                        className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.title && <p className="text-[10px] text-rose-500">{errors.title.message}</p>}
                    </div>

                    {/* Target Date */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Target Accomplishment Date</label>
                      <input 
                        type="date"
                        {...register('targetDate')}
                        className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 dark:border-slate-705 bg-transparent dark:text-white rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50 cursor-pointer"
                      />
                      {errors.targetDate && <p className="text-[10px] text-rose-500">{errors.targetDate.message}</p>}
                    </div>

                    {/* Description details */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Quantitative Target Specification</label>
                      <textarea 
                        rows={3.5}
                        placeholder="e.g. Reconfigure indexing systems on PostgreSQL production clusters and conduct weekly execution benchmark checks."
                        {...register('description')}
                        className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 dark:border-slate-730 bg-transparent dark:text-white rounded-xl focus:border-indigo-500 focus:outline-hidden bg-slate-50/50"
                      />
                      {errors.description && <p className="text-[10px] text-rose-500">{errors.description.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Foot submit bar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsNewGoalOpen(false)}
                    className="flex-1 text-xs text-slate-600 dark:text-slate-350 hover:text-slate-800 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl py-3 cursor-pointer bg-white dark:bg-slate-905 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 text-xs text-white font-bold bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 cursor-pointer shadow-indigo-100 shadow-sm hover:scale-101 active:scale-99 transition-all text-center"
                  >
                    Deploy Target
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
