import { ExtendedPastryReward, PASTRY_DATABASE } from './pastries';

export interface OvenCrate {
  readonly id: string;
  readonly name: string;
  readonly category: 'free' | 'popular' | 'rare' | 'jackpot';
  readonly pricePhp: number;
  readonly isDailyFree?: boolean;
  readonly badge?: 'NEW' | 'HOT' | 'POPULAR';
  readonly description: string;
  readonly boxColor: string;
  readonly accentColor: string;
  readonly possibleDrops: ExtendedPastryReward[];
}

// Convenient indexed mapping to the 12 best sellers:
// [0] Cheese Cup Cake
// [1] Banana Cake
// [2] Pianono Roll
// [3] Brownie Bar
// [4] Cheese Mamon
// [5] Egg Pie Slice
// [6] Custard Cake
// [7] Special Torta
// [8] Butter Cake
// [9] Cheese Ensaymada (Legendary)
// [10] Yema Cake (Legendary)
// [11] Choco Cake (Legendary)

export const OVEN_CRATES: OvenCrate[] = [
  {
    id: 'crate-morning-warmup',
    name: 'The Morning Warmup',
    category: 'free',
    pricePhp: 0,
    isDailyFree: true,
    badge: 'POPULAR',
    description: 'Free daily roll. Fresh out of the oven: Cheese Cupcakes, Pianono, Banana Cake, & Ensaymada.',
    boxColor: 'from-amber-600/30 to-amber-950/50',
    accentColor: 'border-amber-500/40 text-amber-400',
    possibleDrops: [
      PASTRY_DATABASE[0], // Cheese Cup Cake
      PASTRY_DATABASE[1], // Banana Cake
      PASTRY_DATABASE[2], // Pianono Roll
      PASTRY_DATABASE[4], // Cheese Mamon
      PASTRY_DATABASE[9], // Cheese Ensaymada (Legendary drop in free crate!)
    ],
  },
  {
    id: 'crate-merienda-classics',
    name: 'The Merienda Classics Vault',
    category: 'popular',
    pricePhp: 45,
    badge: 'HOT',
    description: 'Authentic Pinoy merienda drops: Egg Pie, Fudgy Brownies, Special Torta, & Butter Cake.',
    boxColor: 'from-orange-900/30 to-amber-950/60',
    accentColor: 'border-orange-500/50 text-orange-400',
    possibleDrops: [
      PASTRY_DATABASE[3], // Brownie Bar
      PASTRY_DATABASE[5], // Egg Pie Slice
      PASTRY_DATABASE[7], // Special Torta
      PASTRY_DATABASE[8], // Butter Cake
      PASTRY_DATABASE[6], // Custard Cake
      PASTRY_DATABASE[9], // Cheese Ensaymada
    ],
  },
  {
    id: 'crate-celebration-cake-jackpot',
    name: 'Celebration Cake Jackpot',
    category: 'jackpot',
    pricePhp: 99,
    badge: 'NEW',
    description: 'High roller oven drop! Massive multiplier odds for Whole Yema Cakes & Whole Choco Cakes.',
    boxColor: 'from-yellow-600/30 to-amber-950/70',
    accentColor: 'border-yellow-400/60 text-yellow-300',
    possibleDrops: [
      PASTRY_DATABASE[6],  // Custard Cake
      PASTRY_DATABASE[8],  // Butter Cake
      PASTRY_DATABASE[9],  // Cheese Ensaymada
      PASTRY_DATABASE[10], // Whole Yema Cake
      PASTRY_DATABASE[11], // Whole Choco Cake
    ],
  },
  {
    id: 'crate-cheese-egg-vault',
    name: 'Cheese & Custard Vault',
    category: 'popular',
    pricePhp: 55,
    badge: 'HOT',
    description: 'All about melted cheddar and rich custard: Egg Pie, Cheese Mamon, & Special Ensaymada.',
    boxColor: 'from-amber-800/30 to-yellow-950/60',
    accentColor: 'border-yellow-500/50 text-yellow-400',
    possibleDrops: [
      PASTRY_DATABASE[0],  // Cheese Cup Cake
      PASTRY_DATABASE[4],  // Cheese Mamon
      PASTRY_DATABASE[5],  // Egg Pie
      PASTRY_DATABASE[6],  // Custard Cake
      PASTRY_DATABASE[9],  // Cheese Ensaymada
      PASTRY_DATABASE[10], // Whole Yema Cake
    ],
  },
  {
    id: 'crate-chocolate-sugar-rush',
    name: 'Choco & Fudgy Rush',
    category: 'rare',
    pricePhp: 65,
    badge: 'POPULAR',
    description: 'For sweet tooths: Fudgy Brownies, Pianono, Banana Cake, and Whole Choco Cake drops.',
    boxColor: 'from-rose-950/40 to-stone-950/70',
    accentColor: 'border-rose-500/50 text-rose-400',
    possibleDrops: [
      PASTRY_DATABASE[2],  // Pianono
      PASTRY_DATABASE[3],  // Brownie Bar
      PASTRY_DATABASE[1],  // Banana Cake
      PASTRY_DATABASE[8],  // Butter Cake
      PASTRY_DATABASE[11], // Whole Choco Cake
    ],
  },
  {
    id: 'crate-bakers-secret-vault',
    name: "The Baker's Secret Vault",
    category: 'rare',
    pricePhp: 79,
    badge: 'HOT',
    description: 'Premium master baker batch. High drop rates for Egg Pie, Yema Cake, and Ensaymada.',
    boxColor: 'from-purple-900/30 to-indigo-950/60',
    accentColor: 'border-purple-500/50 text-purple-400',
    possibleDrops: [
      PASTRY_DATABASE[5],  // Egg Pie
      PASTRY_DATABASE[6],  // Custard Cake
      PASTRY_DATABASE[7],  // Special Torta
      PASTRY_DATABASE[9],  // Cheese Ensaymada
      PASTRY_DATABASE[10], // Whole Yema Cake
      PASTRY_DATABASE[11], // Whole Choco Cake
    ],
  },
];
