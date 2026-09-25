export type PastryRarity = 'common' | 'rare' | 'legendary';

export type VoucherPerk = '50% OFF' | 'Buy 1 Get 1' | '100% Free';

export interface PastryReward {
  readonly id: string;
  readonly name: string;
  readonly rarity: PastryRarity;
  readonly retailPricePhp: number;
  readonly imageUrl?: string;
}

export type VoucherStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED';

export interface VoucherRecord {
  readonly id: string;
  readonly userId: string;
  readonly userEmail?: string;
  readonly itemId: string;
  readonly claimCode: string;
  readonly status: VoucherStatus;
  readonly expiresAt: string;
  readonly pastryReward: PastryReward;
  readonly perk: VoucherPerk;
  readonly finalPricePhp: number;
  readonly googleMapsUrl: string;
  readonly storeHours: string;
  readonly guideText: string;
}

export type VoucherRedemptionState =
  | { readonly status: 'idle' }
  | { readonly status: 'scanning' }
  | { readonly status: 'submitting' }
  | { readonly status: 'success'; readonly voucher: VoucherRecord }
  | { readonly status: 'failure'; readonly error: string; readonly code: string };

export interface RedeemVoucherPayload {
  readonly voucherId: string;
  readonly signature: string;
  readonly cashierId: string;
}