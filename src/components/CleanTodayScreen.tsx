'use client';

import React from 'react';
import { Bell, ShoppingBag, Eye, Truck, Sparkles, ChevronRight, Store } from 'lucide-react';
import { ExtendedPastryReward, PASTRY_DATABASE } from '@/data/pastries';

interface CleanTodayScreenProps {
  onOpenCrateFlow: () => void;
  onSelectItem: (item: ExtendedPastryReward) => void;
  onOpenScanner: () => void;
  onOpenTambayan?: () => void;
  vouchersCount: number;
  balancePhp: number;
}

export const CleanTodayScreen: React.FC<CleanTodayScreenProps> = ({
  onOpenCrateFlow,
  onSelectItem,
  onOpenScanner,
  onOpenTambayan,
  vouchersCount,
  balancePhp,
}) => {
  const yemaCake = PASTRY_DATABASE.find((p) => p.id === 'pastry-yema-cake') || PASTRY_DATABASE[10];

  return (
    <div className="w-full px-5 py-2 space-y-4 pb-24 text-slate-900 select-none">
      {/* 1. Header: "Today", Notification Bell, and Avatar */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Today
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-700 cursor-pointer"
            title="Cashier Scanner Portal"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs">
            <span className="text-base">🧑‍🍳</span>
          </div>
        </div>
      </div>

      {/* 2. Dark Hero Card: "Manay's found a drop" */}
      <div
        onClick={onOpenCrateFlow}
        className="relative w-full rounded-[28px] bg-[#12151d] text-white p-5 shadow-sm overflow-hidden flex flex-col gap-3 cursor-pointer group hover:bg-[#161a24] transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-2 z-10">
            {/* Subtle Tag */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Manay&apos;s found a drop</span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-black leading-snug">
              Yema Cake<br />dropped ₱0
            </h2>

            <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
              Now ₱0.00 at Manay&apos;s Panaderia. 100% free with today&apos;s daily crate roll.
            </p>
          </div>

          {/* Product Visual */}
          <div className="shrink-0 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-105 transition-transform duration-300">
              👑
            </div>
          </div>
        </div>

        {/* Guide Text Pill on top of button to roll for a bread (from user screenshot) */}
        <div className="relative z-10 pt-1 flex flex-col items-center gap-1.5 w-full">
          {/* Guide Pill: Surprise me! 🎉 */}
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-[#60a5fa] bg-white text-[#3b82f6] text-xs font-bold shadow-xs select-none">
            Surprise me! 🎉
          </div>

          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-2xl bg-white text-slate-900 font-black text-xs flex items-center justify-center gap-2 shadow-md group-hover:bg-slate-100 group-hover:shadow-lg transition-all active:scale-98 cursor-pointer border border-white/90"
          >
            {/* Live pulsing radar beacon indicator */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="truncate">Click this button to get your free voucher</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          </button>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. Three Metric Row (Saved so far, Watching, Arriving) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Metric 1 */}
        <div className="bg-[#f5f3ee] border border-slate-200/70 rounded-2xl p-3 flex flex-col justify-between">
          <ShoppingBag className="w-4 h-4 text-emerald-600 mb-1" />
          <div>
            <span className="text-sm font-black text-emerald-700 block tracking-tight font-mono">
              ₱{balancePhp.toFixed(0)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Saved so far</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#f5f3ee] border border-slate-200/70 rounded-2xl p-3 flex flex-col justify-between">
          <Eye className="w-4 h-4 text-slate-700 mb-1" />
          <div>
            <span className="text-sm font-black text-slate-900 block tracking-tight">
              {vouchersCount}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Watching</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#f5f3ee] border border-slate-200/70 rounded-2xl p-3 flex flex-col justify-between">
          <Truck className="w-4 h-4 text-slate-700 mb-1" />
          <div>
            <span className="text-sm font-black text-slate-900 block tracking-tight">
              1
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Roll ready</span>
          </div>
        </div>
      </div>

      {/* 4. Section: "While you were away" / Tambayan chatter */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-black tracking-tight text-slate-900">
              Tambayan Live Chatter
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <button
            onClick={onOpenTambayan || onOpenCrateFlow}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Join Tambayan &rarr;
          </button>
        </div>

        <div className="space-y-2">
          {/* Recent Item 1 */}
          <div
            onClick={onOpenTambayan || onOpenCrateFlow}
            className="bg-[#fbfaf8] border border-slate-200/80 hover:border-slate-300 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-lg shrink-0">
                🌟
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Juan unlocked Cheese Ensaymada
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  ₱0 at Manay&apos;s counter • Valid until 9:40 PM
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>

          {/* Recent Item 2 */}
          <div
            onClick={onOpenTambayan || onOpenCrateFlow}
            className="bg-[#fbfaf8] border border-slate-200/80 hover:border-slate-300 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-lg shrink-0">
                🥧
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Sarah claimed Egg Pie
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  Redeemed at 11:30 AM with 5★ review
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>
        </div>
      </div>

      {/* 5. Section: "On your watchlist" / "Hot from the Oven" */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black tracking-tight text-slate-900">
            On your watchlist
          </h3>
          <button
            onClick={onOpenCrateFlow}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            See all
          </button>
        </div>

        {/* 3 Square Cards in a Row */}
        <div className="grid grid-cols-3 gap-2">
          {PASTRY_DATABASE.slice(4, 7).map((pastry) => (
            <div
              key={pastry.id}
              onClick={() => onSelectItem(pastry)}
              className="bg-[#f7f5f0] border border-slate-200/80 hover:border-slate-300 rounded-2xl p-2.5 flex flex-col items-center justify-between aspect-square cursor-pointer transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-2xs">
                {pastry.emoji}
              </div>
              <div className="text-center w-full">
                <p className="text-[10px] font-black text-slate-800 truncate">
                  {pastry.name.replace(/^1x\s+/, '')}
                </p>
                <p className="text-[9px] font-bold text-slate-500 font-mono">
                  ₱{pastry.retailPricePhp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Location Attribution */}
      <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <Store className="w-3 h-3 text-amber-600" />
        <span>Manay&apos;s Panaderia • Mystery Box Drops</span>
      </div>
    </div>
  );
};
