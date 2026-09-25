'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, ShieldCheck, ExternalLink, Store, Copy, Check, MessageCircle, MapPin } from 'lucide-react';
import QRCode from 'qrcode';
import { ExtendedPastryReward } from '@/data/pastries';
import { VoucherPerk } from '@/types/voucher';

interface CleanVoucherModalProps {
  voucherData: {
    voucherId: string;
    signature: string;
    claimCode: string;
    item: ExtendedPastryReward;
    expiresAt: string;
    perk: VoucherPerk;
  } | null;
  onClose: () => void;
}

export const CleanVoucherModal: React.FC<CleanVoucherModalProps> = ({
  voucherData,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('23:59:59');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7';
  const FACEBOOK_POST_URL = 'https://www.facebook.com/search/top?q=Manay%27s%20Panaderia';

  useEffect(() => {
    if (!voucherData) return;

    const payload = JSON.stringify({
      vId: voucherData.voucherId,
      sig: voucherData.signature,
      code: voucherData.claimCode,
      perk: voucherData.perk,
      map: GOOGLE_MAPS_URL,
    });

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR error:', err));
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
    window.open(GOOGLE_MAPS_URL, '_blank');
  };

  const handleOpenFacebook = () => {
    window.open(FACEBOOK_POST_URL, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl flex flex-col items-center border border-slate-100 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Manay&apos;s Panaderia
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">
            {voucherData.item.name}
          </h3>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#1d58d8] text-white text-[10px] font-black uppercase tracking-wider">
            {voucherData.perk} Voucher
          </span>
        </div>

        {/* QR Code */}
        <div className="my-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 rounded-lg" />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
              Generating QR...
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-rose-600 animate-pulse" />
            Expires: 8:00 PM Today
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            1 User Limit
          </span>
        </div>

        {/* Copy Claim Code */}
        <button
          onClick={handleCopyCode}
          className="text-xs font-mono font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Copied code' : voucherData.claimCode}</span>
        </button>

        {/* Guide: Facebook comment & Same-Day Hours */}
        <div className="w-full mt-4 p-3.5 rounded-2xl bg-slate-50 text-[11px] text-slate-600 space-y-2 border border-slate-200/80">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Check Bread Availability:</span>
              <p className="text-[10.5px] mt-0.5">
                You can comment on our Facebook post to check if this bread is available today.
              </p>
              <button
                onClick={handleOpenFacebook}
                className="mt-1 text-blue-600 font-bold underline inline-flex items-center gap-1 cursor-pointer"
              >
                Comment on Facebook Post <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
            <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Operating Hours:</span>
              <p className="text-[10.5px]">
                If available, you can only receive it <strong>within that day between 7:00 AM – 8:00 PM</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Navigate on Google Maps */}
        <button
          onClick={handleOpenGoogleMaps}
          className="w-full mt-4 py-3 bg-[#1d58d8] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <MapPin className="w-4 h-4 text-white" />
          <span>Open Manay&apos;s on Google Maps</span>
        </button>
      </div>
    </div>
  );
};
