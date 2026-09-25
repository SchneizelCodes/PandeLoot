'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface HeroBannersProps {
  onClaimFreeCrate: () => void;
  onExploreCrates: () => void;
}

export const HeroBanners: React.FC<HeroBannersProps> = ({
  onClaimFreeCrate,
  onExploreCrates,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {/* Banner 1: Free Daily Crate */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 border-2 border-amber-200 p-5 md:p-6 overflow-hidden shadow-sm flex flex-col justify-between min-h-[195px] group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" /> Free Daily Roll
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Manay&apos;s Panaderia Special</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
            Claim <span className="text-amber-600">Daily Pastry Drops</span> on every visit!
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
            Crack open the Morning Warmup reel for Cheese Cup Cakes, Pianono rolls, and legendary Cheese Ensaymadas.
          </p>
        </div>

        {/* 3D Bakery Mystery Box Floating Visual */}
        <div className="absolute -right-2 -bottom-2 text-7xl md:text-8xl opacity-20 group-hover:scale-105 group-hover:rotate-6 transition-transform select-none">
          🎁
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-3">
          <button
            onClick={onClaimFreeCrate}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Claim Free Box
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified QR Voucher
          </span>
        </div>
      </div>

      {/* Banner 2: High Value Oven Vaults */}
      <div className="relative rounded-3xl bg-gradient-to-br from-orange-50/90 via-white to-amber-50/70 border-2 border-orange-200 p-5 md:p-6 overflow-hidden shadow-sm flex flex-col justify-between min-h-[195px] group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
              <Flame className="w-3 h-3 text-orange-600" /> Celebration Jackpot
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Whole Cakes &amp; Pies</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
            Win <span className="text-amber-600">Whole Yema Cakes</span> &amp; Golden Egg Pies
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
            High odds for Whole Choco Cakes, Leche Flan Custard Cakes, and rich Torta Bisaya.
          </p>
        </div>

        <div className="absolute -right-2 -bottom-2 text-7xl md:text-8xl opacity-20 group-hover:scale-105 group-hover:-rotate-6 transition-transform select-none">
          🎂
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-3">
          <button
            onClick={onExploreCrates}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Explore Crates
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-slate-500">
            Valued up to ₱450.00 / drop
          </span>
        </div>
      </div>
    </div>
  );
};
