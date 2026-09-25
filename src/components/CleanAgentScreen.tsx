'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Circle, ChevronDown, ChevronUp, Sparkles, Mic, Edit2 } from 'lucide-react';
import { soundEngine } from '@/utils/audio';
import { ExtendedPastryReward, PASTRY_DATABASE } from '@/data/pastries';
import { VoucherPerk } from '@/types/voucher';

interface CleanAgentScreenProps {
  onBack: () => void;
  onSelectDrop: (item: ExtendedPastryReward, perk: VoucherPerk) => void;
  crateName?: string;
}

const PERKS: VoucherPerk[] = ['50% OFF', 'Buy 1 Get 1', '100% Free'];

export const CleanAgentScreen: React.FC<CleanAgentScreenProps> = ({
  onBack,
  onSelectDrop,
  crateName = 'Morning Warmup Crate',
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promptText, setPromptText] = useState('');

  // 3 finalists randomized from the 12 bestsellers
  const [candidateList] = useState<ExtendedPastryReward[]>(() => {
    const shuffled = [...PASTRY_DATABASE].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  const finalists: { item: ExtendedPastryReward; tag: string }[] = [
    { item: candidateList[0] || PASTRY_DATABASE[9], tag: 'Top choice' },
    { item: candidateList[1] || PASTRY_DATABASE[5], tag: 'Most popular' },
    { item: candidateList[2] || PASTRY_DATABASE[10], tag: 'Fresh out' },
  ];

  // Pick winning bread and random perk
  const handleFinalSelection = (chosenItem?: ExtendedPastryReward) => {
    const winningItem = chosenItem || candidateList[0] || PASTRY_DATABASE[0];
    const winningPerk = PERKS[Math.floor(Math.random() * PERKS.length)];
    onSelectDrop(winningItem, winningPerk);
  };

  // Sequential execution progress
  useEffect(() => {
    soundEngine.playBoxOpen();

    const t1 = setTimeout(() => {
      setStepIndex(1);
      soundEngine.playTick(450);
    }, 700);

    const t2 = setTimeout(() => {
      setStepIndex(2);
      soundEngine.playTick(500);
    }, 1500);

    const t3 = setTimeout(() => {
      setStepIndex(3);
      soundEngine.playTick(550);
    }, 2400);

    const t4 = setTimeout(() => {
      setStepIndex(4);
      soundEngine.playTick(600);
    }, 3300);

    const t5 = setTimeout(() => {
      setStepIndex(5);
      soundEngine.playWinFanfare(true);
      handleFinalSelection(candidateList[0]);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="w-full px-5 py-2 space-y-4 pb-24 text-slate-900 select-none">
      {/* 1. Header with Back Chevron & Title */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h2 className="text-xs font-black tracking-tight text-slate-900 uppercase">
          {crateName}
        </h2>

        <div className="w-5 h-5" />
      </div>

      {/* 2. Top Filter Pill with Edit Button */}
      <div className="bg-[#f5f3ee] border border-slate-200/80 rounded-full px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600 font-medium">
        <span className="truncate pr-2">
          12 Bestsellers • 50% / BOGO / Free • Manay&apos;s
        </span>
        <button className="flex items-center gap-1 font-bold text-slate-800 hover:text-black shrink-0 cursor-pointer">
          <Edit2 className="w-3 h-3 text-slate-600" />
          <span>Edit</span>
        </button>
      </div>

      {/* 3. Agent Status Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1d58d8] mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Manay&apos;s AI is researching</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          Finding the best options for you
        </h3>
      </div>

      {/* 4. Live Step-by-Step Execution Checklist */}
      <div className="space-y-3 pt-1 text-xs">
        {/* Step 1 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {stepIndex >= 1 ? (
              <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-100" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
            <span className={stepIndex >= 1 ? 'font-bold text-slate-900' : 'text-slate-400 font-medium'}>
              Understood your pastry brief
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">5 constraints</span>
        </div>

        {/* Step 2 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {stepIndex >= 2 ? (
              <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-100" />
            ) : stepIndex === 1 ? (
              <Loader2 className="w-4 h-4 text-[#1d58d8] animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
            <span className={stepIndex >= 2 ? 'font-bold text-slate-900' : 'text-slate-400 font-medium'}>
              Checked morning oven batches
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">12 bestsellers</span>
        </div>

        {/* Step 3 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {stepIndex >= 3 ? (
              <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-100" />
            ) : stepIndex === 2 ? (
              <Loader2 className="w-4 h-4 text-[#1d58d8] animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
            <span className={stepIndex >= 3 ? 'font-bold text-slate-900' : 'text-slate-400 font-medium'}>
              Rolling random perk (50% / BOGO / Free)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Random perk</span>
        </div>

        {/* Step 4 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {stepIndex >= 4 ? (
              <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-100" />
            ) : stepIndex === 3 ? (
              <Loader2 className="w-4 h-4 text-[#1d58d8] animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
            <div>
              <span className={stepIndex >= 4 ? 'font-bold text-slate-900' : 'text-slate-400 font-medium'}>
                Reading Google Maps reviews
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Authentic 4.9★ ratings for Manay&apos;s Panaderia
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">1,240 reviews</span>
        </div>

        {/* Step 5 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {stepIndex >= 5 ? (
              <CheckCircle2 className="w-4 h-4 text-slate-900 fill-slate-100" />
            ) : stepIndex === 4 ? (
              <Loader2 className="w-4 h-4 text-[#1d58d8] animate-spin" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
            <span className={stepIndex >= 5 ? 'font-bold text-slate-900' : 'text-slate-400 font-medium'}>
              Unboxing your pastry voucher
            </span>
          </div>
        </div>
      </div>

      {/* 5. Collapsible Metrics: "Ruled out so far" */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <span>Ruled out so far</span>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
            <span>9 of 12</span>
            {isDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {isDrawerOpen && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center justify-between">
              <span>Remaining bread candidates:</span>
              <span className="font-bold text-slate-800">3 of 12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Perks available in this roll:</span>
              <span className="font-bold text-slate-800">50% OFF, BOGO, 100% Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pickup schedule:</span>
              <span className="font-bold text-slate-800">Today 7am - 8pm</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Section: "3 finalists" Ranking now */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-black text-slate-900">3 finalists</h4>
          <span className="text-[10px] text-slate-400 font-medium">Ranking now</span>
        </div>

        {/* 3 Finalist Product Cards in a Row */}
        <div className="grid grid-cols-3 gap-2">
          {finalists.map(({ item, tag }) => (
            <div
              key={item.id}
              onClick={() => handleFinalSelection(item)}
              className="bg-[#f5f3ee] border border-slate-200/80 hover:border-slate-400 rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer transition-all group"
            >
              <div className="w-full aspect-square rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-2xs">
                {item.emoji}
              </div>
              <div className="mt-2 text-left">
                <p className="text-[10px] font-black text-slate-900 truncate">
                  {item.name.replace(/^1x\s+/, '')}
                </p>
                <p className="text-[9px] font-bold text-slate-700 font-mono">
                  ₱{item.retailPricePhp.toFixed(2)}
                </p>
                <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                  {tag}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Persistent Capsule Input at Bottom */}
      <div className="fixed bottom-4 inset-x-0 mx-auto w-[90%] max-w-[390px] z-40">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full px-4 py-2.5 shadow-md flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1d58d8]" />
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Tell Manay what you need..."
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
          />
          <Mic className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
