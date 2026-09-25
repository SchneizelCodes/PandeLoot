import { PastryReward } from '@/types/voucher';

export interface ExtendedPastryReward extends PastryReward {
  readonly description: string;
  readonly emoji: string;
  readonly discountText?: string;
  readonly isFreeItem?: boolean;
}

// Exactly the 12 best selling items requested by the user:
// 1. Choco Cake
// 2. Yema Cake
// 3. Egg Pie
// 4. Pianono
// 5. Cheese Mamon
// 6. Custard Cake
// 7. Banana Cake
// 8. Cheese Cup Cake
// 9. Brownies
// 10. Torta
// 11. Butter Cake
// 12. Cheese Ensaymada

export const PASTRY_DATABASE: ExtendedPastryReward[] = [
  {
    id: 'pastry-cheese-cupcake',
    name: '1x Cheese Cup Cake',
    rarity: 'common',
    retailPricePhp: 25,
    emoji: '🧁',
    description: 'Moist and sweet bite-sized cake topped with grated cheddar cheese.',
    isFreeItem: true,
  },
  {
    id: 'pastry-banana-cake',
    name: '1x Banana Cake',
    rarity: 'common',
    retailPricePhp: 30,
    emoji: '🍌',
    description: 'Dense, moist, and naturally sweet cake made with ripe bananas.',
    isFreeItem: true,
  },
  {
    id: 'pastry-pianono',
    name: '1x Pianono',
    rarity: 'common',
    retailPricePhp: 28,
    emoji: '🍰',
    description: 'Soft and fluffy Filipino sponge cake roll dusted with sweet granulated sugar.',
    isFreeItem: true,
  },
  {
    id: 'pastry-brownies',
    name: '1x Brownies',
    rarity: 'common',
    retailPricePhp: 32,
    emoji: '🍫',
    description: 'Rich, dense, and chewy chocolate brownies with a crisp crinkle top.',
    isFreeItem: true,
  },
  {
    id: 'pastry-cheese-mamon',
    name: '1x Cheese Mamon',
    rarity: 'rare',
    retailPricePhp: 45,
    emoji: '🧀',
    description: 'Cloud-soft chiffon mamon brushed with rich butter and showered with cheese.',
    isFreeItem: true,
  },
  {
    id: 'pastry-egg-pie',
    name: '1x Egg Pie',
    rarity: 'rare',
    retailPricePhp: 55,
    emoji: '🥧',
    description: 'Silky smooth egg custard filling with that signature browned, toasted top crust.',
    isFreeItem: true,
  },
  {
    id: 'pastry-custard-cake',
    name: '1x Custard Cake',
    rarity: 'rare',
    retailPricePhp: 65,
    emoji: '🍮',
    description: 'Creamy golden leche flan layered over fluffy sponge cake.',
    isFreeItem: true,
  },
  {
    id: 'pastry-torta',
    name: '1x Torta',
    rarity: 'rare',
    retailPricePhp: 50,
    emoji: '🧁',
    description: 'Traditional rich native torta cake flavored with anise, egg yolks, and pure lard.',
    isFreeItem: true,
  },
  {
    id: 'pastry-butter-cake',
    name: '1x Butter Cake',
    rarity: 'rare',
    retailPricePhp: 60,
    emoji: '🧈',
    description: 'Decadent, melt-in-your-mouth yellow butter cake with a golden crumb.',
    isFreeItem: true,
  },
  {
    id: 'pastry-cheese-ensaymada',
    name: '1x Cheese Ensaymada',
    rarity: 'legendary',
    retailPricePhp: 95,
    emoji: '🌟',
    description: 'Ultra-fluffy pastry smothered in whipped butter and mounds of aged Queso de Bola.',
    isFreeItem: true,
  },
  {
    id: 'pastry-yema-cake',
    name: '1x Yema Cake',
    rarity: 'legendary',
    retailPricePhp: 380,
    emoji: '👑',
    description: 'Chiffon cake smothered in luscious condensed milk custard sauce & cheese.',
    isFreeItem: true,
  },
  {
    id: 'pastry-choco-cake',
    name: '1x Choco Cake',
    rarity: 'legendary',
    retailPricePhp: 450,
    emoji: '🎂',
    description: 'Intense dark chocolate fudge cake layered with velvety ganache. The town bestseller!',
    isFreeItem: true,
  },
];
