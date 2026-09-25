export type VoucherErrorCode =
  | 'NOT_FOUND'
  | 'ALREADY_REDEEMED'
  | 'EXPIRED'
  | 'INVALID_SIGNATURE'
  | 'INVALID_INPUT';

export class VoucherError extends Error {
  constructor(
    message: string,
    public readonly code: VoucherErrorCode
  ) {
    super(message);
    this.name = 'VoucherError';
  }
}