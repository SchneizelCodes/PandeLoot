'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Circle, ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react';
import { ExtendedPastryReward } from '@/data/pastries';

export interface ExecutionStep {
  id: string;
  label: string;
  subLabel?: string;
  status: 'pending' | 'processing' | 'completed';
}

interface AgentExecutionChecklistProps {
  isExecuting: boolean;
  onComplete?: () => void;
  ruledOutItems?: ExtendedPastryReward[];
  totalCandidatesCount?: number;
}

export const AgentExecutionChecklist: React.FC<AgentExecutionChecklistProps> = ({
  isExecuting,
  onComplete,
  ruledOutItems = [],
  totalCandidatesCount = 12,
}) => {
  const [steps, setSteps] = useState<ExecutionStep[]>([
    { id: '1', label: "Checking Manay's morning oven batches", subLabel: 'Temperature: 215°C, fresh batch validated', status: 'pending' },
    { id: '2', label: 'Executing provably fair RNG tape', subLabel: 'Rarity odds calculation complete', status: 'pending' },
    { id: '3', label: 'Generating HMAC-SHA256 voucher token', subLabel: 'Tamper-proof signature verified', status: 'pending' },
    { id: '4', label: "Connecting to Manay's Google Maps bridge", subLabel: 'Ready for in-store cashier scan', status: 'pending' },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isExecuting) {
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'pending' })));
      return;
    }

    // Sequential disclosure with micro-delays
    const timers: NodeJS.Timeout[] = [];

    // Step 1: Processing -> Complete
    setSteps((prev) => [
      { ...prev[0], status: 'processing' },
      prev[1],
      prev[2],
      prev[3],
    ]);

    timers.push(
      setTimeout(() => {
        setSteps((prev) => [
          { ...prev[0], status: 'completed' },
          { ...prev[1], status: 'processing' },
          prev[2],
          prev[3],
        ]);
      }, 1100)
    );

    // Step 2
    timers.push(
      setTimeout(() => {
        setSteps((prev) => [
          prev[0],
          { ...prev[1], status: 'completed' },
          { ...prev[2], status: 'processing' },
          prev[3],
        ]);
      }, 2300)
    );

    // Step 3
    timers.push(
      setTimeout(() => {
        setSteps((prev) => [
          prev[0],
          prev[1],
          { ...prev[2], status: 'completed' },
          { ...prev[3], status: 'processing' },
        ]);
      }, 3500)
    );

    // Step 4
    timers.push(
      setTimeout(() => {
        setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
        onComplete?.();
      }, 4800)
    );

    return () => timers.forEach(clearTimeout);
  }, [isExecuting, onComplete]);

  if (!isExecuting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="w-full bg-white border border-amber-200/90 rounded-3xl p-4 shadow-md mb-4 text-xs select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
            Oven Drop Sequence
          </h4>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
          Autonomous Agent
        </span>
      </div>

      {/* Sequential Disclosure Steps */}
      <div className="mt-3 space-y-2.5">
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-2.5"
          >
            {/* Transition State Icon */}
            <div className="mt-0.5 shrink-0">
              {step.status === 'pending' && (
                <Circle className="w-4 h-4 text-slate-300 stroke-[2]" />
              )}
              {step.status === 'processing' && (
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin stroke-[2.5]" />
              )}
              {step.status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 stroke-[2.5]" />
              )}
            </div>

            <div className="flex-1">
              <p
                className={`font-bold transition-colors ${
                  step.status === 'completed'
                    ? 'text-slate-900'
                    : step.status === 'processing'
                    ? 'text-amber-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </p>
              {step.subLabel && step.status !== 'pending' && (
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  {step.subLabel}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collapsible Metrics & Filtering Drawer ("Ruled out so far") */}
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Ruled out in this roll:</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-800">
              {ruledOutItems.length > 0 ? ruledOutItems.length : 8} of {totalCandidatesCount}
            </span>
          </div>
          {isDrawerOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 pt-2 border-t border-slate-100 space-y-1"
            >
              <p className="text-[10px] text-slate-400 font-medium">
                Eliminated candidate drops based on crate tier weights:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(ruledOutItems.length > 0
                  ? ruledOutItems
                  : [
                      { name: 'Brownies', emoji: '🍫' },
                      { name: 'Banana Cake', emoji: '🍌' },
                      { name: 'Pianono', emoji: '🍰' },
                      { name: 'Butter Cake', emoji: '🧈' },
                    ]
                ).map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-medium flex items-center gap-1"
                  >
                    <span>{item.emoji}</span>
                    <span className="line-through">{item.name}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
