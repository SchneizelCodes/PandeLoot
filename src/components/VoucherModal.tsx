'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Star, ShieldCheck, CheckCircle2, Sparkles, ExternalLink, Store, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { ExtendedPastryReward } from '@/data/pastries';

interface VoucherModalProps {
  voucherData: {
    voucherId: string;
    signature: string;
    claimCode: string;
    item: ExtendedPastryReward;
    expiresAt: string;
  } | null;
  onClose: () => void;
  onUnlockBonusCrate: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  voucherData,
  onClose,
  onUnlockBonusCrate,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('23:59:59');
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!voucherData) return;

    const payload = JSON.stringify({
      vId: voucherData.voucherId,
      sig: voucherData.signature,
      code: voucherData.claimCode,
    });

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [voucherData]);

  useEffect(() => {
    if (!voucherData) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(voucherData.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voucherData]);

  if (!voucherData) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherData.claimCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Manay's+Panaderia",
      '_blank'
    );
  };

  const handleClaimReviewBonus = () => {
    setHasReviewed(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      onUnlockBonusCrate();
      onClose();
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#faf8f5] overflow-y-auto no-scrollbar"
    >
      {/* 1. Contextual Back Navigation */}
      <div className="w-full px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer p-1 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-amber-600" />
          <span>Back to Bakery Lobby</span>
        </button>

        <span className="text-[11px] font-black text-amber-800 font-mono">
          {voucherData.claimCode}
        </span>
      </div>

      {/* 2. Main Spatial Scroll Content */}
      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-4 space-y-4">
        {/* Dynamic QR Presentation Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col items-center text-center"
        >
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            Active Counter Voucher
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            {voucherData.item.name}
          </h3>

          {/* QR Container */}
          <div className="my-3.5 p-3.5 bg-white rounded-2xl shadow-sm border-2 border-amber-300/80">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Voucher QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 rounded-xl"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          {/* Metadata Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Expires in {timeLeft}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HMAC Signed</span>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="mt-3 text-xs font-mono font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied to clipboard' : `Code: ${voucherData.claimCode}`}</span>
          </button>
        </motion.div>

        {/* Modular Card: Decision Logic & Redemption Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs text-xs space-y-2"
        >
          <div className="flex items-center gap-1.5 font-black text-slate-900">
            <Store className="w-4 h-4 text-amber-600" />
            <span>Counter Instructions at Manay&apos;s Panaderia:</span>
          </div>
          <ol className="list-decimal list-inside text-slate-600 space-y-1 font-medium text-[11.5px]">
            <li>Head to <strong>Manay&apos;s Panaderia</strong>.</li>
            <li>Present this screen with your dynamic QR code to the cashier before paying.</li>
            <li>Cashier scans via POS tablet and hands you your warm, freshly baked item!</li>
          </ol>
        </motion.div>

        {/* Modular Card: The Google Maps Review Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border-2 border-amber-300 p-4 text-center shadow-xs"
        >
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
          </div>

          <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            The &quot;Proof of Taste&quot; Google Maps Bridge
          </h5>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            Rate today&apos;s visit on <strong>Manay&apos;s Panaderia Google Maps</strong> to unlock{' '}
            <strong className="text-amber-800">&quot;The Golden Baker&apos;s Vault&quot;</strong> for 100% free!
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleOpenGoogleMaps}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              1. Review on Google Maps
            </button>

            <button
              onClick={handleClaimReviewBonus}
              disabled={hasReviewed}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {hasReviewed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Vault Unlocked!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> 2. I Reviewed • Unlock
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Fixed Baseline CTA */}
      <div className="w-full max-w-xl mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 sticky bottom-0 z-30">
        <button
          onClick={handleOpenGoogleMaps}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Star className="w-4 h-4 fill-white" /> Rate Manay&apos;s Panaderia &amp; Unlock Crate #2
        </button>
      </div>
    </motion.div>
  );
};
