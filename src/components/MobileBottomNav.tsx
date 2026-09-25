'use client';

import React from 'react';
import { Home, Package, Ticket, MessageSquare } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onToggleChat: () => void;
  vouchersCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onToggleChat,
  vouchersCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around lg:hidden shadow-lg">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          activeTab === 'home' ? 'text-amber-600' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">Lobby</span>
      </button>

      <button
        onClick={() => onSelectTab('crates')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          activeTab === 'crates' ? 'text-amber-600' : 'text-slate-500'
        }`}
      >
        <Package className="w-5 h-5" />
        <span className="text-[10px] font-bold">Crates</span>
      </button>

      <button
        onClick={() => onSelectTab('vouchers')}
        className={`relative flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          activeTab === 'vouchers' ? 'text-amber-600' : 'text-slate-500'
        }`}
      >
        <Ticket className="w-5 h-5" />
        <span className="text-[10px] font-bold">Vouchers</span>
        {vouchersCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
            {vouchersCount}
          </span>
        )}
      </button>

      <button
        onClick={onToggleChat}
        className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 cursor-pointer"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <span className="text-[10px] font-bold">Tambayan</span>
      </button>
    </nav>
  );
};
