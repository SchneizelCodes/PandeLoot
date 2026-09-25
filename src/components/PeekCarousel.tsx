'use client';

import React, { useState } from 'react';
import { ExtendedPastryReward, PASTRY_DATABASE } from '@/data/pastries';
import { Sparkles, Flame, Coffee, Heart, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface PeekCarouselProps {
  onSelectItem?: (item: ExtendedPastryReward) => void;
}

// Attributes mapping for Manay's bestsellers
const ITEM_SPECS: Record<string, { sweetness: number; batchTime: string; pairing: string; bakersNote: string }> = {
  'pastry-cheese-cupcake': { sweetness: 3, batchTime: '6:30 AM', pairing: 'Drip Coffee', bakersNote: 'Kids & breakfast favorite with melted cheddar.' },
  'pastry-banana-cake': { sweetness: 3, batchTime: '7:00 AM', pairing: 'Hot Tea', bakersNote: 'Made with 100% ripe native cavendish bananas.' },
  'pastry-pianono': { sweetness: 4, batchTime: '8:00 AM', pairing: 'Americano', bakersNote: 'Featherlight sponge roll with granulated sugar dust.' },
  'pastry-brownies': { sweetness: 5, batchTime: '9:00 AM', pairing: 'Cold Milk', bakersNote: 'Dark cocoa with crinkle top crust and fudgy center.' },
  'pastry-cheese-mamon': { sweetness: 3, batchTime: '6:00 AM', pairing: 'Spanish Latte', bakersNote: 'Cloud chiffon brushed with pure dairy butter.' },
  'pastry-egg-pie': { sweetness: 4, batchTime: '7:30 AM', pairing: 'Barako Brew', bakersNote: 'Signature toasted caramelized top crust.' },
  'pastry-custard-cake': { sweetness: 4, batchTime: '8:30 AM', pairing: 'Iced Coffee', bakersNote: 'Silky smooth leche flan layer on vanilla chiffon.' },
  'pastry-torta': { sweetness: 3, batchTime: '6:15 AM', pairing: 'Hot Tsokolate', bakersNote: 'Heritage Visayan recipe flavored with anise seeds.' },
  'pastry-butter-cake': { sweetness: 4, batchTime: '7:15 AM', pairing: 'Latte Float', bakersNote: 'Golden crumb with velvety melt-in-mouth texture.' },
  'pastry-cheese-ensaymada': { sweetness: 4, batchTime: '5:45 AM', pairing: 'Hot Chocolate', bakersNote: 'Bestseller: Mounded with aged Queso de Bola.' },
  'pastry-yema-cake': { sweetness: 5, batchTime: '9:30 AM', pairing: 'Brewed Coffee', bakersNote: 'Town famous! Dripping with golden yema custard.' },
  'pastry-choco-cake': { sweetness: 5, batchTime: '10:00 AM', pairing: 'Espresso', bakersNote: 'Masterpiece dark chocolate fudge ganache.' },
};

export const PeekCarousel: React.FC<PeekCarouselProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cakes' | 'merienda'>('all');

  const filtered = PASTRY_DATABASE.filter((item) => {
    if (selectedCategory === 'cakes') return item.name.toLowerCase().includes('cake') || item.name.toLowerCase().includes('pie');
    if (selectedCategory === 'merienda') return !item.name.toLowerCase().includes('whole');
    return true;
  });

  return (
    <div className="w-full my-4 select-none">
      {/* Header & Category Switcher */}
      <div className="px-4 flex items-center justify-between mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Manay&apos;s 12 Best Sellers
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Swipe horizontally to inspect candidate drops
          </p>
        </div>

        {/* Compact Segmented Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
          {(['all', 'cakes', 'merienda'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Item Candidate Row (Horizontal Peek Carousel with Overhang) */}
      <div className="flex overflow-x-auto gap-3.5 px-4 pb-3 pt-1 no-scrollbar snap-x snap-mandatory">
        {filtered.map((item, idx) => {
          const specs = ITEM_SPECS[item.id] || { sweetness: 4, batchTime: '7:00 AM', pairing: 'Coffee', bakersNote: 'Fresh bake' };
          const isLegendary = item.rarity === 'legendary';

          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectItem?.(item)}
              className="snap-start shrink-0 w-[240px] bg-white border border-slate-200/90 hover:border-amber-400 rounded-3xl p-3.5 shadow-xs flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group"
            >
              {/* Subtle top indicator */}
              <div
                className={`absolute top-0 inset-x-0 h-1.5 ${
                  isLegendary
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                    : item.rarity === 'rare'
                    ? 'bg-purple-400'
                    : 'bg-slate-300'
                }`}
              />

              {/* Top Asset Preview */}
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isLegendary
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : item.rarity === 'rare'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {item.rarity}
                </span>

                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> {specs.batchTime}
                </span>
              </div>

              {/* Center Asset & Label */}
              <div className="my-2.5 flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                  {item.emoji}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 leading-tight truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-black text-amber-700 font-mono mt-0.5">
                    ₱{item.retailPricePhp.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Key Specifications Modular Chips */}
              <div className="grid grid-cols-2 gap-1.5 my-1 text-[10px] text-slate-600">
                <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-200/60 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">Sweet: {specs.sweetness}/5</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-1.5 border border-slate-200/60 flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-700 shrink-0" />
                  <span className="truncate">{specs.pairing}</span>
                </div>
              </div>

              {/* Decision Logic: "Baker's Note" */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <p className="text-slate-500 line-clamp-1 italic">
                  &ldquo;{specs.bakersNote}&rdquo;
                </p>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
