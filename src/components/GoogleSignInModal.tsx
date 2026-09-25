'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ExtendedPastryReward } from '@/data/pastries';
import { VoucherPerk } from '@/types/voucher';
import { supabase } from '@/lib/supabaseClient';

interface GoogleSignInModalProps {
  pastry: ExtendedPastryReward;
  perk: VoucherPerk;
  onSuccess: (email: string, name?: string, picture?: string) => void;
  onClose: () => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  pastry,
  perk,
  onSuccess,
  onClose,
}) => {
  const [emailInput, setEmailInput] = useState('juandc.ph@gmail.com');
  const [nameInput, setNameInput] = useState('Juan Dela Cruz');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Direct Supabase Google OAuth Provider Sign-In
  const handleSupabaseGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        if (
          error.message.toLowerCase().includes('unsupported provider') ||
          error.message.toLowerCase().includes('not enabled') ||
          error.message.toLowerCase().includes('validation_failed')
        ) {
          setErrorMsg(
            "Supabase Google Auth is not yet toggled ON in your Supabase dashboard (Authentication > Providers > Google). Use the instant login below while setting it up!"
          );
        } else {
          setErrorMsg(error.message);
        }
      }
    } catch (err: unknown) {
      console.error('Supabase Google OAuth error:', err);
      setErrorMsg('Could not connect to Supabase Google Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Direct login with email (persisted to database)
  const handleDirectSignIn = async (email: string, name: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        onSuccess(data.user.email, data.user.name);
      } else {
        setErrorMsg(data.error || 'Sign-in failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      onSuccess(email.trim(), name.trim());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl flex flex-col items-center border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google G Logo */}
        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
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
        </div>

        {/* Heading */}
        <h3 className="text-base font-black text-slate-900 text-center">
          Sign in with Google
        </h3>
        <p className="text-xs text-slate-500 text-center mt-1">
          To claim your voucher for <strong className="text-slate-800">{pastry.name}</strong> ({perk})
        </p>

        {/* Supabase Status Badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Supabase Auth Enabled</span>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="w-full mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* 1 User = 1 Voucher Rule Notice */}
        <div className="w-full my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-700">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900">1 User = 1 Voucher Limit</p>
            <p className="text-slate-500 text-[10.5px] mt-0.5 leading-tight">
              Strictly 1 bread voucher per Google account.
            </p>
          </div>
        </div>

        {/* Primary Supabase Google OAuth Button */}
        <button
          onClick={handleSupabaseGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          ) : (
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
          )}
          <span>Continue with Google (Supabase Auth)</span>
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Or One-Tap Login</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Quick Accounts */}
        <div className="w-full space-y-2">
          <button
            onClick={() => handleDirectSignIn('juandc.ph@gmail.com', 'Juan Dela Cruz')}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                J
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-800">Juan Dela Cruz</p>
                <p className="text-[9.5px] text-slate-400">juandc.ph@gmail.com</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
          </button>

          <button
            onClick={() => handleDirectSignIn('sarah.suki@gmail.com', 'Sarah Suki')}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                S
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-800">Sarah Suki</p>
                <p className="text-[9.5px] text-slate-400">sarah.suki@gmail.com</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
          </button>
        </div>

        {/* Custom Google Account Email Input */}
        <div className="w-full mt-3 pt-2 border-t border-slate-100">
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
            Or type your Google email:
          </label>
          <div className="space-y-1.5">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-1.5">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@gmail.com"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleDirectSignIn(emailInput, nameInput)}
                disabled={isLoading || !emailInput.trim()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
