'use client';

import React from 'react';
import { PastryRarity } from '@/types/voucher';

interface LiveClaim {
  id: string;
  name: string;
  location: string;
  item: string;
  pricePhp: number;
  rarity: PastryRarity;
  timeAgo: string;
  emoji: string;
}

const LIVE_CLAIMS: LiveClaim[] = [
  { id: '1', name: 'Juan', location: "Manay's Counter", item: 'Whole Yema Cake', pricePhp: 0, rarity: 'legendary', timeAgo: 'just now', emoji: '👑' },
  { id: '2', name: 'Sarah', location: "Manay's Panaderia", item: 'Special Cheese Ensaymada', pricePhp: 0, rarity: 'legendary', timeAgo: '1m ago', emoji: '🌟' },
  { id: '3', name: 'Bea', location: 'Nearby Cafe', item: 'Whole Decadent Choco Cake', pricePhp: 0, rarity: 'legendary', timeAgo: '2m ago', emoji: '🎂' },
  { id: '4', name: 'Kuya Joms', location: "Manay's Dine-in", item: 'Golden Egg Pie Slice', pricePhp: 0, rarity: 'rare', timeAgo: '3m ago', emoji: '🥧' },
  { id: '5', name: 'Mark', location: 'Local Customer', item: 'Leche Flan Custard Cake', pricePhp: 0, rarity: 'rare', timeAgo: '4m ago', emoji: '🍮' },
  { id: '6', name: 'Marites', location: "Manay's Regular", item: 'Classic Pianono Roll', pricePhp: 0, rarity: 'common', timeAgo: '5m ago', emoji: '🍰' },
  { id: '7', name: 'Carlo', location: 'In Store', item: 'Special Cheese Mamon', pricePhp: 0, rarity: 'rare', timeAgo: '6m ago', emoji: '🧀' },
  { id: '8', name: 'Chef Ron', location: "Manay's Bakery", item: 'Special Torta Bisaya', pricePhp: 0, rarity: 'rare', timeAgo: '7m ago', emoji: '🧁' },
  { id: '9', name: 'Ate Joy', location: 'Morning Suki', item: 'Fresh Banana Cake Slice', pricePhp: 0, rarity: 'common', timeAgo: '8m ago', emoji: '🍌' },
  { id: '10', name: 'Miggy', location: "Manay's Suki", item: 'Fudgy Brownie Bar', pricePhp: 0, rarity: 'common', timeAgo: '9m ago', emoji: '🍫' },
];

const RARITY_STYLES: Record<PastryRarity, { border: string; glow: string; badge: string; text: string }> = {
  common: {
    border: 'border-slate-200',
    glow: 'shadow-xs',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    text: 'text-slate-800',
  },
  rare: {
    border: 'border-purple-200',
    glow: 'shadow-sm shadow-purple-500/10',
    badge: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    text: 'text-purple-900',
  },
  legendary: {
    border: 'border-amber-300',
    glow: 'shadow-sm shadow-amber-500/15',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
    text: 'text-amber-900',
  },
};

export const DropTicker: React.FC = () => {
  return (
    <div className="w-full bg-[#f5f1eb] border-y border-[#e6dfd5] py-2 overflow-hidden relative select-none">
      {/* Edge gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#f5f1eb] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#f5f1eb] to-transparent z-10 pointer-events-none" />

      {/* Marquee ticker */}
      <div className="animate-marquee flex items-center gap-3">
        {LIVE_CLAIMS.concat(LIVE_CLAIMS).map((drop, idx) => {
          const style = RARITY_STYLES[drop.rarity];
          return (
            <div
              key={`${drop.id}-${idx}`}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border ${style.border} ${style.glow} shrink-0 cursor-default hover:border-amber-400 transition-colors`}
            >
              <span className="text-base">{drop.emoji}</span>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900">
                    {drop.name} <span className="text-slate-500 font-normal">at {drop.location}</span>
                  </span>
                  <span className="text-[9px] text-slate-400">• {drop.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[11px] font-bold truncate max-w-[170px] ${style.text}`}>
                    {drop.item}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-mono ${style.badge}`}>
                    {drop.pricePhp === 0 ? '₱0 Free Drop' : `₱${drop.pricePhp}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
