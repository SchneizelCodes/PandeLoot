'use client';

import React, { useState } from 'react';
import { OvenCrate, OVEN_CRATES } from '@/data/crates';
import { Sparkles, Layers, ChevronDown } from 'lucide-react';

interface CrateGridProps {
  onOpenCrate: (crate: OvenCrate) => void;
}

export const CrateGrid: React.FC<CrateGridProps> = ({ onOpenCrate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = [
    { id: 'all', label: 'All Crates' },
    { id: 'featured', label: 'Featured' },
    { id: 'new', label: 'Jackpots' },
    { id: 'free', label: 'Free Crates' },
    { id: 'rare', label: 'Bestseller Vaults' },
  ];

  let filtered = OVEN_CRATES.filter((crate) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'featured') return crate.badge === 'HOT' || crate.badge === 'POPULAR';
    if (activeCategory === 'new') return crate.badge === 'NEW';
    if (activeCategory === 'free') return crate.pricePhp === 0;
    if (activeCategory === 'rare') return crate.category === 'rare' || crate.category === 'jackpot';
    return true;
  });

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.pricePhp - b.pricePhp);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.pricePhp - a.pricePhp);
  }

  return (
    <div className="w-full my-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-black uppercase tracking-wide text-slate-900">
            Manay&apos;s Oven Crates
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-mono font-bold">
            {filtered.length} Crates
          </span>
        </div>

        {/* Filter Pills and Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-amber-500 shadow-2xs"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Crates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 md:gap-5 mt-5">
        {filtered.map((crate) => {
          return (
            <div
              key={crate.id}
              onClick={() => onOpenCrate(crate)}
              className="group relative rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-400 p-4 md:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden"
            >
              {/* Subtle top tone accent */}
              <div
                className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-80"
              />

              {/* Badges */}
              <div className="flex items-center justify-between z-10 pt-1">
                {crate.badge ? (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      crate.badge === 'HOT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : crate.badge === 'NEW'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {crate.badge}
                  </span>
                ) : (
                  <span />
                )}

                <span className="text-[10px] text-slate-500 font-mono font-bold">
                  {crate.possibleDrops.length} Pastry Drops
                </span>
              </div>

              {/* 3D Crate Visual */}
              <div className="my-3 flex flex-col items-center justify-center relative z-10 py-1">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-inner flex items-center justify-center text-4xl md:text-5xl group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                  {crate.id.includes('morning')
                    ? '🥐'
                    : crate.id.includes('jackpot')
                    ? '🎂'
                    : crate.id.includes('cheese')
                    ? '🧀'
                    : crate.id.includes('choco')
                    ? '🍫'
                    : '🎁'}
                </div>

                <div className="w-16 h-2.5 bg-amber-900/10 rounded-full blur-xs mt-2 group-hover:scale-110 transition-transform" />
              </div>

              {/* Name & Drops Info */}
              <div className="z-10 text-center">
                <h4 className="text-xs md:text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                  {crate.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                  {crate.description}
                </p>
              </div>

              {/* Price / Open Button */}
              <div className="mt-4 z-10">
                <button
                  className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${
                    crate.pricePhp === 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {crate.pricePhp === 0 ? 'FREE ROLL' : `₱${crate.pricePhp.toFixed(2)}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
