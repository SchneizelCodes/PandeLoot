import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VoucherError } from '@/errors/voucherErrors';
import { processVoucherRedemption } from '@/services/voucherService';
import { RedeemVoucherPayload } from '@/types/voucher';

// We use the Service Role key here because verifying and redeeming 
// requires administrative bypass of standard user RLS policies.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

// Boundary validation: Never trust client input
function validateRedemptionPayload(input: unknown): RedeemVoucherPayload {
  if (typeof input !== 'object' || input === null) {
    throw new VoucherError('Malformed JSON payload', 'INVALID_INPUT');
  }

  const { voucherId, signature, cashierId } = input as Record<string, unknown>;

  if (typeof voucherId !== 'string' || voucherId.trim().length === 0) {
    throw new VoucherError('Field "voucherId" is required and must be a string.', 'INVALID_INPUT');
  }
  if (typeof signature !== 'string' || signature.trim().length === 0) {
    throw new VoucherError('Field "signature" is required and must be a string.', 'INVALID_INPUT');
  }
  if (typeof cashierId !== 'string' || cashierId.trim().length === 0) {
    throw new VoucherError('Field "cashierId" is required and must be a string.', 'INVALID_INPUT');
  }

  return { voucherId, signature, cashierId };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawJson = await request.json();
    const validatedPayload = validateRedemptionPayload(rawJson);

    const redeemedVoucher = await processVoucherRedemption(supabaseAdmin, validatedPayload);

    return NextResponse.json({ success: true, data: redeemedVoucher }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof VoucherError) {
      // Map domain errors to appropriate HTTP status codes
      const statusMap: Record<VoucherError['code'], number> = {
        INVALID_INPUT: 400,
        INVALID_SIGNATURE: 403,
        NOT_FOUND: 404,
        ALREADY_REDEEMED: 409,
        EXPIRED: 410,
      };

      return NextResponse.json(
        { success: false, code: error.code, message: error.message },
        { status: statusMap[error.code] ?? 400 }
      );
    }

    console.error('[UNHANDLED_REDEMPTION_ERROR]:', error);
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}