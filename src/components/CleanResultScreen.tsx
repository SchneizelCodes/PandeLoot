'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Star, Sparkles, Mic, QrCode, Store, ExternalLink, MessageCircle, Clock, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import { ExtendedPastryReward } from '@/data/pastries';
import { VoucherPerk, VoucherRecord } from '@/types/voucher';

interface CleanResultScreenProps {
  onBack: () => void;
  wonItem: ExtendedPastryReward;
  perk: VoucherPerk;
  voucherRecord: VoucherRecord | null;
  userEmail: string | null;
  onInitiateGoogleSignIn: () => void;
  onOpenQRVoucher: () => void;
  crateName?: string;
}

export const CleanResultScreen: React.FC<CleanResultScreenProps> = ({
  onBack,
  wonItem,
  perk,
  voucherRecord,
  userEmail,
  onInitiateGoogleSignIn,
  onOpenQRVoucher,
  crateName = 'Morning Warmup Crate',
}) => {
  const [promptText, setPromptText] = useState('');

  const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7';
  const FACEBOOK_POST_URL = 'https://www.facebook.com/search/top?q=Manay%27s%20Panaderia';

  const handleNavigateMaps = () => {
    window.open(GOOGLE_MAPS_URL, '_blank');
  };

  const handleOpenFacebook = () => {
    window.open(FACEBOOK_POST_URL, '_blank');
  };

  // Calculate pricing based on perk
  let displayPrice = '₱0.00';
  let badgeLabel: string = perk;
  if (perk === '50% OFF') {
    displayPrice = `₱${(wonItem.retailPricePhp * 0.5).toFixed(2)}`;
  } else if (perk === 'Buy 1 Get 1') {
    displayPrice = `₱${wonItem.retailPricePhp.toFixed(2)}`;
    badgeLabel = 'BOGO (Pay 1, Get 2)';
  } else {
    displayPrice = '₱0.00';
    badgeLabel = '100% Free';
  }

  return (
    <div className="w-full px-5 py-2 space-y-4 pb-24 text-slate-900 select-none">
      {/* 1. Header with Minimal Back Chevron & Title */}
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

      {/* 2. Status Callout */}
      <div className="flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#1d58d8] fill-blue-50" />
          <span>Voucher Generated for {wonItem.name.replace(/^1x\s+/, '')}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400">1 of 12</span>
      </div>

      {/* 3. Hero Headline & Random Voucher Perk */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#1d58d8] text-white text-[10px] font-black uppercase tracking-wider">
            {perk} VOUCHER
          </span>
          {userEmail && (
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              Claimed by {userEmail.split('@')[0]}
            </span>
          )}
        </div>

        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
          Get {wonItem.name.replace(/^1x\s+/, '').replace(/^100%\s+FREE\s+/, '')} ({perk})
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
          Fresh from Manay&apos;s Panaderia. Claimable only within today between 7:00 AM – 8:00 PM.
        </p>
      </div>

      {/* 4. Large Product Showcase Card */}
      <div className="w-full aspect-[4/3] rounded-[28px] bg-[#f4efe8] border border-slate-200/80 flex items-center justify-center p-6 shadow-xs group">
        <div className="text-8xl drop-shadow-md group-hover:scale-105 transition-transform duration-300">
          {wonItem.emoji}
        </div>
      </div>

      {/* 5. Product Details & Price / Rating */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Manay&apos;s Panaderia
        </span>
        <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
          {wonItem.name.replace(/^1x\s+/, '').replace(/^100%\s+FREE\s+/, '')}
        </h2>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 font-mono">
              {displayPrice}
            </span>
            <span className="text-xs text-slate-400 line-through font-mono">
              ₱{wonItem.retailPricePhp.toFixed(2)}
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {badgeLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>4.9</span>
            <span className="text-slate-400 font-normal">(Google Maps)</span>
          </div>
        </div>
      </div>

      {/* 6. CLAIM ACTION & GOOGLE SIGN IN (User Process Step 4) */}
      {!userEmail ? (
        <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-3">
          <div>
            <h3 className="text-sm font-black">Proceed to Claim Voucher</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              To proceed with claiming your voucher, sign in with your Google Account. Only 1 user can get 1 voucher.
            </p>
          </div>

          {/* Claim Button with Live Indicator */}
          <button
            onClick={onInitiateGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer relative"
          >
            {/* Live pulsing radar beacon indicator */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.26C.46 8.19 0 10.03 0 12s.46 3.81 1.26 5.41l4.02-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.59l4.02 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
              />
            </svg>
            <span className="truncate">Click this button to get your free voucher</span>
          </button>
        </div>
      ) : (
        /* After Sign-in: Direct Navigation to Google Maps location and QR Voucher */
        <div className="space-y-2">
          {/* Direct Google Maps Navigation Button */}
          <button
            onClick={handleNavigateMaps}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1d58d8] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
          >
            <MapPin className="w-4 h-4 text-white" />
            <span>Navigate to Manay&apos;s Panaderia on Google Maps</span>
          </button>

          <button
            onClick={onOpenQRVoucher}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>View Dynamic QR Code for Cashier Scan</span>
          </button>
        </div>
      )}

      {/* 7. GUIDE: Availability check & Same-Day Hours */}
      <div className="bg-[#fcfbfa] border border-slate-200/90 rounded-2xl p-4 space-y-2.5 text-xs">
        <h3 className="font-black text-slate-900 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-amber-600" />
          <span>Claiming Guide &amp; Store Hours</span>
        </h3>

        <div className="space-y-2 text-[11px] text-slate-600">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Check Bread Availability: </span>
              <span>
                You can comment on our Facebook post to verify if this bread is in stock before heading over.
              </span>
              <div className="mt-1">
                <button
                  onClick={handleOpenFacebook}
                  className="font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 underline cursor-pointer"
                >
                  Comment on Facebook Post <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Same-Day Pickup Window: </span>
              <span>If available, you can only receive it <strong>within that day between 7:00 AM – 8:00 PM</strong>.</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Pickup Location: </span>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-bold hover:underline"
              >
                Manay&apos;s Panaderia on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Persistent Bottom Capsule Input */}
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
