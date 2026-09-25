import { SupabaseClient } from '@supabase/supabase-js';
import { VoucherError } from '@/errors/voucherErrors';
import { verifyVoucherSignature } from '@/services/cryptoService';
import { VoucherRecord, RedeemVoucherPayload } from '@/types/voucher';
import { getVoucherById, redeemVoucher } from '@/lib/db';

const HMAC_SECRET_KEY = process.env.VOUCHER_SIGNING_KEY || 'default-signing-key-ph';

export async function processVoucherRedemption(
  supabase: SupabaseClient,
  payload: RedeemVoucherPayload
): Promise<VoucherRecord> {
  const isAuthentic = verifyVoucherSignature(payload.voucherId, payload.signature, HMAC_SECRET_KEY);
  if (!isAuthentic) {
    throw new VoucherError('Voucher signature is forged or corrupted.', 'INVALID_SIGNATURE');
  }

  // 1. Check persistent database
  const voucher = await getVoucherById(payload.voucherId);

  if (!voucher) {
    throw new VoucherError('Voucher not found in system.', 'NOT_FOUND');
  }

  if (voucher.status === 'REDEEMED') {
    throw new VoucherError('This voucher has already been claimed.', 'ALREADY_REDEEMED');
  }

  const isExpired = new Date(voucher.expiresAt).getTime() < Date.now();
  if (isExpired || voucher.status === 'EXPIRED') {
    throw new VoucherError('This voucher has already expired.', 'EXPIRED');
  }

  // 2. Mark as redeemed in persistent database
  const updated = await redeemVoucher(payload.voucherId, payload.cashierId);

  return updated || voucher;
}