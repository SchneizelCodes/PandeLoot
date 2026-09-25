import { NextResponse } from 'next/server';
import { getAllUsers, getVoucherByEmail } from '@/lib/db';

export async function GET() {
  try {
    const users = await getAllUsers();

    // Attach voucher details
    const usersWithVouchers = await Promise.all(
      users.map(async (u) => {
        const voucher = await getVoucherByEmail(u.email);
        return {
          ...u,
          voucher: voucher || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: usersWithVouchers,
    });
  } catch (error) {
    console.error('Failed to get users:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
