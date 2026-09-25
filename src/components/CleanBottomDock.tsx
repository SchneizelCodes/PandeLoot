'use client';

import React from 'react';
import { MessageCircle, Heart, Package, Sparkles } from 'lucide-react';

interface CleanBottomDockProps {
  activeTab: 'today' | 'tambayan' | 'saved' | 'vouchers';
  onSelectTab: (tab: 'today' | 'tambayan' | 'saved' | 'vouchers') => void;
  onCenterAction: () => void;
  vouchersCount?: number;
}

export const CleanBottomDock: React.FC<CleanBottomDockProps> = ({
  activeTab,
  onSelectTab,
  onCenterAction,
  vouchersCount = 0,
}) => {
  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto w-[90%] max-w-[390px] z-40 pointer-events-auto select-none">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full px-5 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between">
        {/* Today Tab */}
        <button
          onClick={() => onSelectTab('today')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1 ${
            activeTab === 'today' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {/* Custom rounded house icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-tight">Today</span>
        </button>

        {/* Tambayan Live Chat Tab */}
        <button
          onClick={() => onSelectTab('tambayan')}
          className={`relative flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1 ${
            activeTab === 'tambayan' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[9px] font-bold tracking-tight">Tambayan</span>
        </button>

        {/* Center Primary Action Button (The exact blue elevated circle button with indicator) */}
        <div className="relative -top-2 flex flex-col items-center">
          <button
            onClick={onCenterAction}
            className="w-12 h-12 rounded-full bg-[#1d58d8] text-white font-black flex items-center justify-center shadow-[0_6px_20px_rgba(29,88,216,0.4)] border-[3px] border-white active:scale-95 transition-transform cursor-pointer group relative"
            aria-label="Click this button to get your free voucher"
            title="Click this button to get your free voucher"
          >
            {/* Live Indicator pulse beacon */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
            </span>
            <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Saved */}
        <button
          onClick={() => onSelectTab('saved')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1 ${
            activeTab === 'saved' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Heart className="w-5 h-5 stroke-[2]" />
          <span className="text-[9px] font-bold tracking-tight">Saved</span>
        </button>

        {/* Vouchers / Orders */}
        <button
          onClick={() => onSelectTab('vouchers')}
          className={`relative flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1 ${
            activeTab === 'vouchers' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Package className="w-5 h-5 stroke-[2]" />
          <span className="text-[9px] font-bold tracking-tight">Orders</span>
          {vouchersCount > 0 && (
            <span className="absolute -top-1 right-0 w-3.5 h-3.5 rounded-full bg-[#1d58d8] text-white text-[8px] font-black flex items-center justify-center">
              {vouchersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
