import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Generates an HMAC-SHA256 signature for a given voucher ID.
 */
export function generateVoucherSignature(voucherId: string, secretKey: string): string {
  if (!voucherId || !secretKey) {
    throw new Error('voucherId and secretKey are required to generate signature');
  }

  return createHmac('sha256', secretKey)
    .update(voucherId)
    .digest('hex');
}

/**
 * Validates the HMAC signature using timingSafeEqual to prevent timing attacks.
 */
export function verifyVoucherSignature(
  voucherId: string,
  providedSignature: string,
  secretKey: string
): boolean {
  if (!voucherId || !providedSignature || !secretKey) {
    return false;
  }

  const computedSignature = generateVoucherSignature(voucherId, secretKey);

  const computedBuffer = Buffer.from(computedSignature, 'hex');
  const providedBuffer = Buffer.from(providedSignature, 'hex');

  if (computedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(computedBuffer, providedBuffer);
}