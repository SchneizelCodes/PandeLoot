import { useState, useCallback } from 'react';
import { VoucherRedemptionState, RedeemVoucherPayload } from '@/types/voucher';

export function useVoucherRedemption(cashierId: string) {
  const [redemptionState, setRedemptionState] = useState<VoucherRedemptionState>({ status: 'idle' });

  const redeemVoucher = useCallback(
    async (voucherId: string, signature: string): Promise<void> => {
      // Transition to loading state
      setRedemptionState({ status: 'submitting' });

      try {
        const payload: RedeemVoucherPayload = { voucherId, signature, cashierId };
        const response = await fetch('/api/vouchers/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Handle known API rejections (e.g., Already Redeemed, Invalid Signature)
        if (!response.ok) {
          setRedemptionState({
            status: 'failure',
            error: result.message ?? 'Redemption failed',
            code: result.code ?? 'UNKNOWN_ERROR',
          });
          return;
        }

        // Handle success
        setRedemptionState({ status: 'success', voucher: result.data });
      } catch (err: unknown) {
        // Handle physical network drops or CORS issues
        setRedemptionState({
          status: 'failure',
          error: err instanceof Error ? err.message : 'Network error occurred',
          code: 'CLIENT_NETWORK_ERROR',
        });
      }
    },
    [cashierId]
  );

  const resetState = useCallback((): void => {
    setRedemptionState({ status: 'idle' });
  }, []);

  return { redemptionState, redeemVoucher, resetState };
}