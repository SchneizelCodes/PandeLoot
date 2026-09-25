'use client';

import React, { useState } from 'react';
import { X, QrCode, CheckCircle, AlertTriangle, ShieldCheck, Loader2, Store } from 'lucide-react';
import { useVoucherRedemption } from '@/hooks/useVoucherRedemption';

interface StaffScannerModalProps {
  onClose: () => void;
  activeVoucherId?: string;
  activeSignature?: string;
}

export const StaffScannerModal: React.FC<StaffScannerModalProps> = ({
  onClose,
  activeVoucherId = '',
  activeSignature = '',
}) => {
  const [voucherIdInput, setVoucherIdInput] = useState(activeVoucherId);
  const [signatureInput, setSignatureInput] = useState(activeSignature);
  const [cashierId] = useState('cashier_manay_01');

  const { redemptionState, redeemVoucher } = useVoucherRedemption(cashierId);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherIdInput || !signatureInput) return;

    await redeemVoucher(voucherIdInput.trim(), signatureInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Staff Counter Scanner
              </h3>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Store className="w-3 h-3 text-amber-600" /> Manay&apos;s Panaderia POS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRedeem} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Voucher ID:
            </label>
            <input
              type="text"
              value={voucherIdInput}
              onChange={(e) => setVoucherIdInput(e.target.value)}
              placeholder="e.g. vch_171000000_abc"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Cryptographic HMAC Signature:
            </label>
            <input
              type="text"
              value={signatureInput}
              onChange={(e) => setSignatureInput(e.target.value)}
              placeholder="64-character SHA256 hex string"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={redemptionState.status === 'submitting'}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {redemptionState.status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying with Server...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Validate &amp; Dispense Pastry
              </>
            )}
          </button>
        </form>

        {/* Status Outcome */}
        {redemptionState.status === 'success' && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center animate-fade-in">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <h4 className="text-sm font-black text-emerald-900 uppercase">
              Voucher Verified &amp; Redeemed!
            </h4>
            <p className="text-xs text-slate-900 font-bold mt-1">
              Hand over: {redemptionState.voucher.pastryReward.name}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Claim Code: {redemptionState.voucher.claimCode}
            </p>
          </div>
        )}

        {redemptionState.status === 'failure' && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-center animate-fade-in">
            <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto mb-1" />
            <h4 className="text-sm font-black text-rose-900 uppercase">
              Redemption Rejected
            </h4>
            <p className="text-xs text-rose-800 font-semibold mt-1">{redemptionState.error}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Code: {redemptionState.code}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
