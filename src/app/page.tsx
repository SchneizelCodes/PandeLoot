'use client';

import React, { useState, useEffect } from 'react';
import { MobileShell } from '@/components/MobileShell';
import { CleanBottomDock } from '@/components/CleanBottomDock';
import { CleanTodayScreen } from '@/components/CleanTodayScreen';
import { CleanAgentScreen } from '@/components/CleanAgentScreen';
import { CleanResultScreen } from '@/components/CleanResultScreen';
import { CleanVoucherModal } from '@/components/CleanVoucherModal';
import { GoogleSignInModal } from '@/components/GoogleSignInModal';
import { StaffScannerModal } from '@/components/StaffScannerModal';
import { TambayanChatScreen } from '@/components/TambayanChatScreen';
import { OvenCrate, OVEN_CRATES } from '@/data/crates';
import { ExtendedPastryReward, PASTRY_DATABASE } from '@/data/pastries';
import { VoucherPerk, VoucherRecord } from '@/types/voucher';
import { supabase } from '@/lib/supabaseClient';
import { QrCode } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const GOOGLE_MAPS_MANAY_URL = 'https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7';

export default function PandeLootApp() {
  const [balancePhp, setBalancePhp] = useState<number>(280.0);
  const [activeTab, setActiveTab] = useState<'today' | 'tambayan' | 'saved' | 'vouchers'>('today');
  const [screen, setScreen] = useState<'today' | 'agent' | 'result'>('today');

  const [selectedCrate, setSelectedCrate] = useState<OvenCrate>(OVEN_CRATES[0]);
  const [wonItem, setWonItem] = useState<ExtendedPastryReward>(PASTRY_DATABASE[10]); // Yema Cake default
  const [wonPerk, setWonPerk] = useState<VoucherPerk>('100% Free');
  const [voucherRecord, setVoucherRecord] = useState<VoucherRecord | null>(null);

  // Authenticated Google User Email
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // User Vouchers list (enforcing 1 voucher per user)
  const [userVouchers, setUserVouchers] = useState<VoucherRecord[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Listen for Supabase Google Auth Session (e.g. redirect back from Google OAuth)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        handleGoogleSignInSuccess(email, name);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        handleGoogleSignInSuccess(email, name);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Start crate roll flow (Step 2)
  const handleStartCrateFlow = (crate?: OvenCrate) => {
    // If user already claimed their 1-voucher limit, check first
    if (userVouchers.length >= 1 && userEmail) {
      alert(`Notice: You have already claimed your 1 voucher limit for ${userVouchers[0].pastryReward.name} (${userVouchers[0].perk}). Viewing your active voucher.`);
      setWonItem(userVouchers[0].pastryReward as ExtendedPastryReward);
      setWonPerk(userVouchers[0].perk);
      setVoucherRecord(userVouchers[0]);
      setScreen('result');
      return;
    }

    if (crate) {
      setSelectedCrate(crate);
    } else {
      setSelectedCrate(OVEN_CRATES[0]);
    }
    setScreen('agent');
  };

  // Agent completes unboxing and passes randomized bread & random perk (Step 3)
  const handleAgentSelectDrop = (item: ExtendedPastryReward, perk: VoucherPerk) => {
    setWonItem(item);
    setWonPerk(perk);
    setScreen('result');
  };

  // Google Sign-In Success Handler (Step 4 & 5)
  const handleGoogleSignInSuccess = async (email: string, name?: string) => {
    setUserEmail(email);
    setIsGoogleModalOpen(false);

    // Call API to create voucher and enforce 1 user = 1 voucher limit in working database
    try {
      const res = await fetch('/api/vouchers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pastryId: wonItem.id,
          userEmail: email,
          userId: email,
          userName: name,
          perk: wonPerk,
        }),
      });

      const data = await res.json();

      if (data.voucher) {
        setVoucherRecord(data.voucher);
        setUserVouchers([data.voucher]); // Only 1 voucher per user
        if (data.isExisting) {
          alert(`Welcome back! You already claimed 1 voucher (${data.voucher.pastryReward.name} - ${data.voucher.perk}). Opening your active voucher.`);
          setWonItem(data.voucher.pastryReward);
          setWonPerk(data.voucher.perk);
        }
      }
    } catch {
      // Fallback local voucher
      const fallbackVch: VoucherRecord = {
        id: `vch_${Date.now()}`,
        userId: email,
        userEmail: email,
        itemId: wonItem.id,
        claimCode: `MANAY-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        perk: wonPerk,
        finalPricePhp: wonPerk === '50% OFF' ? Math.round(wonItem.retailPricePhp * 0.5) : wonPerk === 'Buy 1 Get 1' ? wonItem.retailPricePhp : 0,
        googleMapsUrl: GOOGLE_MAPS_MANAY_URL,
        storeHours: '7:00 AM – 8:00 PM (Same-day pickup only)',
        guideText: 'You can comment on the Facebook post if the bread is available. If yes, you can only receive it within that day between 7:00 AM – 8:00 PM.',
        pastryReward: {
          id: wonItem.id,
          name: wonItem.name,
          rarity: wonItem.rarity,
          retailPricePhp: wonItem.retailPricePhp,
        },
      };
      setVoucherRecord(fallbackVch);
      setUserVouchers([fallbackVch]);
    }

    // Step 5: "After that it will navigate to the google map location https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7 where he can get the bread."
    setTimeout(() => {
      window.open(GOOGLE_MAPS_MANAY_URL, '_blank');
    }, 600);
  };

  const handleUnlockBonusCrate = () => {
    alert("🎉 Maraming salamat for visiting Manay's Panaderia!");
  };

  return (
    <MobileShell>
      {/* Dynamic Screen Routing */}
      <AnimatePresence mode="wait">
        {screen === 'today' && activeTab === 'today' && (
          <motion.div
            key="screen-today"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CleanTodayScreen
              onOpenCrateFlow={() => handleStartCrateFlow()}
              onSelectItem={(item) => {
                const crate = OVEN_CRATES.find((c) => c.possibleDrops.some((d) => d.id === item.id)) || OVEN_CRATES[0];
                handleStartCrateFlow(crate);
              }}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenTambayan={() => setActiveTab('tambayan')}
              vouchersCount={userVouchers.length}
              balancePhp={balancePhp}
            />
          </motion.div>
        )}

        {screen === 'agent' && (
          <motion.div
            key="screen-agent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <CleanAgentScreen
              onBack={() => setScreen('today')}
              onSelectDrop={handleAgentSelectDrop}
              crateName={selectedCrate.name}
            />
          </motion.div>
        )}

        {screen === 'result' && (
          <motion.div
            key="screen-result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <CleanResultScreen
              onBack={() => setScreen('today')}
              wonItem={wonItem}
              perk={wonPerk}
              voucherRecord={voucherRecord}
              userEmail={userEmail}
              onInitiateGoogleSignIn={() => setIsGoogleModalOpen(true)}
              onOpenQRVoucher={() => setIsQRModalOpen(true)}
              crateName={selectedCrate.name}
            />
          </motion.div>
        )}

        {screen === 'today' && activeTab === 'tambayan' && (
          <motion.div
            key="screen-tambayan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <TambayanChatScreen
              onNavigateToRoll={() => handleStartCrateFlow()}
            />
          </motion.div>
        )}

        {screen === 'today' && activeTab === 'vouchers' && (
          <motion.div
            key="screen-vouchers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-3 pb-24"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Your Orders &amp; Vouchers</h2>
              <span className="text-xs font-bold text-slate-500">
                {userVouchers.length} / 1 Allowed
              </span>
            </div>

            {userVouchers.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#f7f5f0] border border-slate-200/80 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  No active vouchers yet. Tap the center button to roll your crate!
                </p>
                <button
                  onClick={() => handleStartCrateFlow()}
                  className="mt-4 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Roll Today&apos;s Crate
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userVouchers.map((vch) => (
                  <div
                    key={vch.id}
                    className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {vch.claimCode}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {vch.perk}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-1">
                        {vch.pastryReward.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Same-day pickup: 7:00 AM – 8:00 PM at Manay&apos;s Panaderia
                      </p>
                    </div>

                    <button
                      onClick={() => setIsQRModalOpen(true)}
                      className="mt-3 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-700" />
                      <span>View In-Store QR Voucher</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {screen === 'today' && activeTab === 'saved' && (
          <motion.div
            key="screen-saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-3 pb-24"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Saved Items</h2>
              <span className="text-xs text-slate-500 font-medium">Favorites</span>
            </div>
            <div className="p-8 rounded-3xl bg-[#f7f5f0] border border-slate-200/80 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Your favorite bakes from Manay&apos;s Panaderia will appear here.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Pill Dock: visible on Today, Crates, Saved, Vouchers */}
      {screen === 'today' && (
        <CleanBottomDock
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onCenterAction={() => handleStartCrateFlow()}
          vouchersCount={userVouchers.length}
        />
      )}

      {/* Google Sign In Modal (Step 4) */}
      {isGoogleModalOpen && (
        <GoogleSignInModal
          pastry={wonItem}
          perk={wonPerk}
          onSuccess={handleGoogleSignInSuccess}
          onClose={() => setIsGoogleModalOpen(false)}
        />
      )}

      {/* Clean Dynamic QR Voucher Sheet Modal */}
      {isQRModalOpen && voucherRecord && (
        <CleanVoucherModal
          voucherData={{
            voucherId: voucherRecord.id,
            signature: voucherRecord.claimCode,
            claimCode: voucherRecord.claimCode,
            item: wonItem,
            expiresAt: voucherRecord.expiresAt,
            perk: wonPerk,
          }}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}

      {/* Staff Cashier QR Scanner Simulator */}
      {isScannerOpen && (
        <StaffScannerModal
          onClose={() => setIsScannerOpen(false)}
          activeVoucherId={voucherRecord?.id}
          activeSignature={voucherRecord?.claimCode}
        />
      )}
    </MobileShell>
  );
}
