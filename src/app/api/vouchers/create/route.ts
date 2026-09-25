import { NextRequest, NextResponse } from 'next/server';
import { generateVoucherSignature } from '@/services/cryptoService';
import { VoucherRecord, VoucherPerk } from '@/types/voucher';
import { PASTRY_DATABASE } from '@/data/pastries';
import { getVoucherByEmail, saveVoucher, upsertUser } from '@/lib/db';

const PERKS: VoucherPerk[] = ['50% OFF', 'Buy 1 Get 1', '100% Free'];

export async function POST(req: NextRequest) {
  try {
    const {
      pastryId,
      userId = 'guest_user',
      userEmail,
      userName,
      perk: requestedPerk,
    } = await req.json();

    const identityKey = userEmail ? userEmail.trim().toLowerCase() : userId.trim().toLowerCase();

    // 1. Ensure user is in database
    if (userEmail) {
      await upsertUser({
        email: identityKey,
        name: userName,
      });
    }

    // 2. STRICT RULE: "Only 1 user can get 1 voucher" (checked from persistent database)
    const existing = await getVoucherByEmail(identityKey);
    if (existing) {
      return NextResponse.json({
        success: true,
        isExisting: true,
        message: 'You already claimed your 1 voucher limit.',
        voucher: existing,
      });
    }

    const pastry = PASTRY_DATABASE.find((p) => p.id === pastryId) || PASTRY_DATABASE[0];
    const voucherId = `vch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const secretKey = process.env.VOUCHER_SIGNING_KEY || 'default-signing-key-ph';
    const signature = generateVoucherSignature(voucherId, secretKey);

    // Random perk selection: "50% OFF", "Buy 1 Get 1", "100% Free"
    const perk: VoucherPerk = requestedPerk && PERKS.includes(requestedPerk)
      ? requestedPerk
      : PERKS[Math.floor(Math.random() * PERKS.length)];

    let finalPricePhp = 0;
    if (perk === '50% OFF') {
      finalPricePhp = Math.round(pastry.retailPricePhp * 0.5);
    } else if (perk === 'Buy 1 Get 1') {
      finalPricePhp = pastry.retailPricePhp;
    } else {
      finalPricePhp = 0;
    }

    // Same-day expiry (until 8:00 PM today)
    const today8pm = new Date();
    today8pm.setHours(20, 0, 0, 0);
    // If it's already past 8:00 PM, set it for next day 8:00 PM
    if (today8pm.getTime() <= Date.now()) {
      today8pm.setDate(today8pm.getDate() + 1);
    }
    const expiresAt = today8pm.toISOString();

    const claimCode = `MANAY-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: VoucherRecord = {
      id: voucherId,
      userId: identityKey,
      userEmail: userEmail || identityKey,
      itemId: pastry.id,
      claimCode,
      status: 'ACTIVE',
      expiresAt,
      perk,
      finalPricePhp,
      googleMapsUrl: 'https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7',
      storeHours: '7:00 AM – 8:00 PM (Same-day pickup only)',
      guideText: 'You can comment on the Facebook post if the bread is available. If yes, you can only receive it within that day between 7:00 AM – 8:00 PM.',
      pastryReward: {
        id: pastry.id,
        name: pastry.name,
        rarity: pastry.rarity,
        retailPricePhp: pastry.retailPricePhp,
      },
    };

    // 3. Save to persistent database
    await saveVoucher(record);

    const qrPayload = JSON.stringify({
      voucherId,
      signature,
      claimCode,
      perk,
      bread: pastry.name,
      location: 'https://maps.app.goo.gl/dhg1VcLtAYsrEjJC7',
      hours: '7am-8pm',
    });

    return NextResponse.json({
      success: true,
      voucher: record,
      signature,
      qrPayload,
    });
  } catch (error: unknown) {
    console.error('Failed to create voucher:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
