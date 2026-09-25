'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, MessageSquare, QrCode, User, Menu, Store } from 'lucide-react';
import { soundEngine } from '@/utils/audio';

interface NavbarProps {
  onToggleChat: () => void;
  onOpenScanner: () => void;
  onToggleSidebar: () => void;
  unreadCount?: number;
  balancePhp: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleChat,
  onOpenScanner,
  onToggleSidebar,
  unreadCount = 0,
  balancePhp,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleMuteToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-sm px-3 md:px-6 py-2.5 flex items-center justify-between">
      {/* Left: Mobile Menu & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-md flex items-center justify-center text-xl">
            🥐
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base md:text-lg font-black tracking-tight text-slate-900">
                Manay&apos;s <span className="text-amber-600">Panaderia</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 rounded-md">
                PandeLoot
              </span>
            </div>
            <p className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Store className="w-3 h-3 text-amber-600" />
              Fresh Pastry Mystery Crates &amp; In-Store Drops
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dough Balance */}
        <div className="flex items-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 shadow-sm">
          <span className="text-xs font-bold text-amber-700 mr-1.5">₱</span>
          <span className="text-xs md:text-sm font-black text-slate-900 font-mono">
            {balancePhp.toFixed(2)}
          </span>
          <button
            onClick={() => alert("Dough balance top-up: GCash, Maya, or cash at Manay's Panaderia counter!")}
            className="ml-2 w-5 h-5 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center text-xs shadow-sm transition-colors cursor-pointer"
            title="Top up dough"
          >
            +
          </button>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={handleMuteToggle}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
          title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
        </button>

        {/* Staff Scanner Quick Launch */}
        <button
          onClick={onOpenScanner}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          title="Cashier Scanner Simulator"
        >
          <QrCode className="w-4 h-4 text-amber-600" />
          <span>Cashier Portal</span>
        </button>

        {/* Chat Toggle (Mobile View) */}
        <button
          onClick={onToggleChat}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 lg:hidden transition-colors"
          aria-label="Toggle chat"
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile / Auth Button */}
        <button
          onClick={() => alert("Welcome to Manay's Panaderia VIP Club!")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Juan (VIP)</span>
        </button>
      </div>
    </header>
  );
};
