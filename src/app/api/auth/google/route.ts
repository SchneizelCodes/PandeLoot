import { NextRequest, NextResponse } from 'next/server';
import { upsertUser, getVoucherByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, email: manualEmail, name: manualName, picture: manualPicture, sub: manualSub } = body;

    let email = manualEmail;
    let name = manualName;
    let picture = manualPicture;
    let googleSub = manualSub;

    // 1. If Google JWT credential was provided by Google Identity Services, verify it with Google
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!verifyRes.ok) {
          const errText = await verifyRes.text();
          console.error('Google token verification failed:', errText);
          return NextResponse.json(
            { success: false, error: 'Invalid Google credential token' },
            { status: 401 }
          );
        }

        const payload = await verifyRes.json();
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
        googleSub = payload.sub;
      } catch (err) {
        console.error('Network error verifying Google token:', err);
        return NextResponse.json(
          { success: false, error: 'Could not contact Google verification service' },
          { status: 502 }
        );
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required for Google Sign-In' },
        { status: 400 }
      );
    }

    // 2. Save user to working persistent database
    const user = await upsertUser({
      email,
      name,
      picture,
      googleSub,
    });

    // 3. Check if user already claimed their 1 allowed voucher
    const existingVoucher = await getVoucherByEmail(email);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        lastLoginAt: user.lastLoginAt,
      },
      hasClaimedVoucher: !!existingVoucher,
      existingVoucher: existingVoucher || null,
    });
  } catch (error) {
    console.error('Error in Google auth endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal authentication server error' },
      { status: 500 }
    );
  }
}
