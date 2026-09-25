'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Package, Sparkles, Ticket, MessageSquare } from 'lucide-react';

interface FloatingPillNavProps {
  isVisible: boolean;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onPrimaryAction: () => void;
  vouchersCount: number;
  unreadCount?: number;
}

export const FloatingPillNav: React.FC<FloatingPillNavProps> = ({
  isVisible,
  activeTab,
  onSelectTab,
  onPrimaryAction,
  vouchersCount,
  unreadCount = 0,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="fixed bottom-6 inset-x-0 mx-auto w-[92%] max-w-[380px] z-40 pointer-events-auto"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-amber-900/10 rounded-full px-4 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] flex items-center justify-between">
            {/* 1. Home / Lobby */}
            <button
              onClick={() => onSelectTab('home')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1.5 ${
                activeTab === 'home' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-black uppercase tracking-wider">Lobby</span>
            </button>

            {/* 2. Crates */}
            <button
              onClick={() => onSelectTab('crates')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1.5 ${
                activeTab === 'crates' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Package className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-black uppercase tracking-wider">Crates</span>
            </button>

            {/* 3. ELEVATED CENTRAL ACTION BUTTON */}
            <button
              onClick={onPrimaryAction}
              className="relative -top-4 w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-white font-black flex items-center justify-center shadow-[0_8px_25px_rgba(245,158,11,0.45)] border-4 border-[#faf8f5] active:scale-95 transition-transform cursor-pointer group"
              aria-label="Roll Crate"
            >
              <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform drop-shadow" />
              <span className="absolute -bottom-4 text-[8px] font-black tracking-widest uppercase text-amber-700">
                Roll
              </span>
            </button>

            {/* 4. Vouchers */}
            <button
              onClick={() => onSelectTab('vouchers')}
              className={`relative flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1.5 ${
                activeTab === 'vouchers' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Ticket className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-black uppercase tracking-wider">Vouchers</span>
              {vouchersCount > 0 && (
                <span className="absolute -top-1 right-0 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {vouchersCount}
                </span>
              )}
            </button>

            {/* 5. Live Tambayan Chat */}
            <button
              onClick={() => onSelectTab('chat')}
              className={`relative flex flex-col items-center gap-0.5 cursor-pointer transition-colors p-1.5 ${
                activeTab === 'chat' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-black uppercase tracking-wider">Tambayan</span>
              <span className="absolute 1 top-0 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
