'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Gift, Flame, ShieldCheck, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '@/utils/audio';
import { OvenCrate } from '@/data/crates';
import { ExtendedPastryReward, PASTRY_DATABASE } from '@/data/pastries';
import { PastryRarity } from '@/types/voucher';
import { AgentExecutionChecklist } from './AgentExecutionChecklist';

const CARD_WIDTH = 150;
const TOTAL_REEL_ITEMS = 48;
const TARGET_INDEX = 40;

const RARITY_THEMES: Record<PastryRarity, { border: string; bg: string; badge: string; text: string }> = {
  common: {
    border: 'border-slate-300',
    bg: 'bg-white',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    text: 'text-slate-800',
  },
  rare: {
    border: 'border-purple-300 shadow-sm shadow-purple-500/10',
    bg: 'bg-gradient-to-b from-purple-50 to-white',
    badge: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    text: 'text-purple-900',
  },
  legendary: {
    border: 'border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-300',
    bg: 'bg-gradient-to-b from-amber-50 to-yellow-50',
    badge: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black',
    text: 'text-amber-950',
  },
};

interface RouletteModalProps {
  crate: OvenCrate | null;
  onClose: () => void;
  onClaimVoucher: (item: ExtendedPastryReward) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({
  crate,
  onClose,
  onClaimVoucher,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCheckingOven, setIsCheckingOven] = useState(false);
  const [reel, setReel] = useState<ExtendedPastryReward[]>([]);
  const [wonItem, setWonItem] = useState<ExtendedPastryReward | null>(null);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!crate) return;
    const initialPool: ExtendedPastryReward[] = [];
    for (let i = 0; i < TOTAL_REEL_ITEMS; i++) {
      const rand = crate.possibleDrops[Math.floor(Math.random() * crate.possibleDrops.length)];
      initialPool.push(rand);
    }
    setReel(initialPool);
    setWonItem(null);
    setIsSpinning(false);
    setIsCheckingOven(false);
    controls.set({ x: 0 });
  }, [crate, controls]);

  if (!crate) return null;

  // Ruled-out items calculation
  const crateDropIds = new Set(crate.possibleDrops.map((d) => d.id));
  const ruledOutItems = PASTRY_DATABASE.filter((d) => !crateDropIds.has(d.id));

  const handleStartSpin = async () => {
    if (isSpinning || isCheckingOven) return;
    setIsCheckingOven(true);
    setWonItem(null);

    soundEngine.playBoxOpen();

    const legendary = crate.possibleDrops.find((d) => d.rarity === 'legendary');
    const rare = crate.possibleDrops.find((d) => d.rarity === 'rare');
    const common = crate.possibleDrops.find((d) => d.rarity === 'common') || crate.possibleDrops[0];

    const roll = Math.random() * 100;
    let selectedWinner: ExtendedPastryReward;
    if (roll > 80 && legendary) {
      selectedWinner = legendary;
    } else if (roll > 40 && rare) {
      selectedWinner = rare;
    } else {
      selectedWinner = common;
    }

    const newReel: ExtendedPastryReward[] = [];
    for (let i = 0; i < TOTAL_REEL_ITEMS; i++) {
      if (i === TARGET_INDEX) {
        newReel.push(selectedWinner);
      } else {
        const rand = crate.possibleDrops[Math.floor(Math.random() * crate.possibleDrops.length)];
        newReel.push(rand);
      }
    }
    setReel(newReel);

    const containerWidth = containerRef.current?.offsetWidth || 380;
    const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;
    const jitter = (Math.random() - 0.5) * 60;
    const destinationX = -(TARGET_INDEX * CARD_WIDTH - centerOffset + jitter);

    await controls.set({ x: 0 });

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      soundEngine.playTick(440 + (tickCount % 6) * 35);
    }, 120);

    // Staggered roll execution
    setIsSpinning(true);
    await controls.start({
      x: destinationX,
      transition: {
        duration: 5.2,
        ease: [0.12, 0.8, 0.33, 1],
      },
    });

    clearInterval(tickInterval);
    setIsSpinning(false);
    setIsCheckingOven(false);
    setWonItem(selectedWinner);

    soundEngine.playWinFanfare(selectedWinner.rarity === 'legendary');

    if (selectedWinner.rarity === 'legendary') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff'],
      });
    } else if (selectedWinner.rarity === 'rare') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#a855f7', '#c084fc', '#e9d5ff'],
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#faf8f5] overflow-y-auto no-scrollbar"
    >
      {/* 1. Contextual Back Navigation Header */}
      <div className="w-full px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 disabled:opacity-40 cursor-pointer p-1 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-amber-600" />
          <span>Back to Bakery Lobby</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span className="truncate max-w-[140px] text-slate-900">{crate.name}</span>
        </div>
      </div>

      {/* 2. Main Spatial Content (Staggered Entrance Delays) */}
      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center">
        {/* Crate Information & Price Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-2"
        >
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {crate.category.toUpperCase()} DROP
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {crate.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mt-0.5">
            {crate.description}
          </p>
        </motion.div>

        {/* Live Step-by-Step Autonomous Execution Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          <AgentExecutionChecklist
            isExecuting={isCheckingOven || isSpinning}
            ruledOutItems={ruledOutItems}
            totalCandidatesCount={PASTRY_DATABASE.length}
          />
        </motion.div>

        {/* CS:GO Roulette Reel (Bakery Glass Showcase) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          ref={containerRef}
          className="relative w-full h-52 bg-[#f9f6f0] border-2 border-amber-200 rounded-3xl my-3 overflow-hidden flex items-center shadow-inner"
        >
          {/* Top & Bottom Golden Needles (Needle Marker) */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-amber-600 via-amber-400 to-amber-600 z-30 shadow-[0_0_12px_#f59e0b] needle-glow pointer-events-none">
            <div className="absolute top-0 -left-[6.5px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[11px] border-t-amber-600 shadow-md" />
            <div className="absolute bottom-0 -left-[6.5px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[11px] border-b-amber-600 shadow-md" />
          </div>

          {/* Vignette Gradients */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#f9f6f0] via-[#f9f6f0]/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#f9f6f0] via-[#f9f6f0]/90 to-transparent z-20 pointer-events-none" />

          {/* Sliding Cards Reel */}
          <motion.div animate={controls} className="flex pl-4 space-x-2.5 absolute left-0 z-10">
            {reel.map((item, idx) => {
              const theme = RARITY_THEMES[item.rarity];
              return (
                <div
                  key={`${item.id}-${idx}`}
                  style={{ width: `${CARD_WIDTH - 10}px` }}
                  className={`h-44 shrink-0 rounded-2xl border-2 ${theme.border} ${theme.bg} p-3 flex flex-col justify-between items-center text-center select-none shadow-xs`}
                >
                  <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    {item.rarity}
                  </span>

                  <div className="w-14 h-14 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-center text-3xl shadow-inner">
                    {item.emoji}
                  </div>

                  <div className="w-full">
                    <p className={`text-xs font-black leading-tight truncate ${theme.text}`}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      ₱{item.retailPricePhp.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Won Item Card Reveal */}
        <AnimatePresence>
          {wonItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full p-4 rounded-3xl border-2 ${RARITY_THEMES[wonItem.rarity].border} bg-white text-center flex flex-col items-center shadow-lg my-2`}
            >
              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full mb-1 ${RARITY_THEMES[wonItem.rarity].badge}`}>
                {wonItem.rarity} Drop Unlocked!
              </span>

              <div className="text-4xl my-1">{wonItem.emoji}</div>
              <h4 className="text-base font-black text-slate-900">{wonItem.name}</h4>
              <p className="text-xs text-slate-600 max-w-sm mt-0.5 font-medium">{wonItem.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Fixed Baseline CTAs (Anchored Full-Width Button) */}
      <div className="w-full max-w-xl mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 sticky bottom-0 z-30">
        {!wonItem ? (
          <div className="space-y-2">
            <button
              onClick={handleStartSpin}
              disabled={isSpinning || isCheckingOven}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              {isSpinning || isCheckingOven
                ? 'Unlocking Pastry Crate...'
                : `Roll ${crate.pricePhp === 0 ? 'Free Daily Crate' : `for ₱${crate.pricePhp.toFixed(2)}`}`}
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Provably Fair
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-600" /> {crate.possibleDrops.length} drops active
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => onClaimVoucher(wonItem)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Gift className="w-4 h-4" /> Claim In-Store Voucher (QR)
            </button>

            <button
              onClick={handleStartSpin}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              Roll Again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
