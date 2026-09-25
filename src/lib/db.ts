import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { VoucherRecord, PastryReward, VoucherPerk } from '@/types/voucher';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleSub?: string;
  createdAt: string;
  lastLoginAt: string;
  voucherId?: string | null;
}

export interface DatabaseSchema {
  users: UserRecord[];
  vouchers: VoucherRecord[];
}

const IS_SERVERLESS = !!process.env.VERCEL;
const DATA_DIR = IS_SERVERLESS ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'pandeloot_store.json');

// In-memory fallback cache for serverless environments
let MEMORY_CACHE: DatabaseSchema | null = null;

// Initialize local file storage
function ensureDatabaseFile(): DatabaseSchema {
  if (MEMORY_CACHE) return MEMORY_CACHE;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      // Check if seeded file exists in project repository
      const seedFile = path.join(process.cwd(), 'data', 'pandeloot_store.json');
      if (fs.existsSync(seedFile)) {
        const seedContent = fs.readFileSync(seedFile, 'utf-8');
        fs.writeFileSync(DB_FILE, seedContent, 'utf-8');
        MEMORY_CACHE = JSON.parse(seedContent) as DatabaseSchema;
        return MEMORY_CACHE;
      }

      const initial: DatabaseSchema = { users: [], vouchers: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      MEMORY_CACHE = initial;
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    MEMORY_CACHE = JSON.parse(content) as DatabaseSchema;
    return MEMORY_CACHE;
  } catch (error) {
    console.error('Error initializing database file:', error);
    MEMORY_CACHE = { users: [], vouchers: [] };
    return MEMORY_CACHE;
  }
}

function saveDatabaseFile(data: DatabaseSchema): void {
  MEMORY_CACHE = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Atomic write to avoid corruption
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error saving database file:', error);
  }
}

// Supabase client instance (if configured)
let supabaseAdmin: SupabaseClient | null = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } catch {
    supabaseAdmin = null;
  }
}

// ----------------------------------------------------
// USER OPERATIONS
// ----------------------------------------------------

export async function upsertUser(userData: {
  email: string;
  name?: string;
  picture?: string;
  googleSub?: string;
  id?: string;
}): Promise<UserRecord> {
  const db = ensureDatabaseFile();
  const normalizedEmail = userData.email.trim().toLowerCase();
  const now = new Date().toISOString();

  let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (user) {
    user.name = userData.name || user.name || normalizedEmail.split('@')[0];
    if (userData.picture) user.picture = userData.picture;
    if (userData.googleSub) user.googleSub = userData.googleSub;
    user.lastLoginAt = now;
  } else {
    user = {
      id: userData.id || userData.googleSub || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: userData.name || normalizedEmail.split('@')[0],
      picture: userData.picture || undefined,
      googleSub: userData.googleSub || undefined,
      createdAt: now,
      lastLoginAt: now,
      voucherId: null,
    };
    db.users.push(user);
  }

  saveDatabaseFile(db);

  // Background sync to Supabase if table exists
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('users').upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        google_sub: user.googleSub,
        last_login_at: user.lastLoginAt,
      });
    } catch {
      // Supabase table may not exist yet; local database persists seamlessly
    }
  }

  return user;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const db = ensureDatabaseFile();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const db = ensureDatabaseFile();
  return db.users.find((u) => u.id === id) || null;
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const db = ensureDatabaseFile();
  return db.users;
}

// ----------------------------------------------------
// VOUCHER OPERATIONS (1 USER = 1 VOUCHER ENFORCEMENT)
// ----------------------------------------------------

export async function getVoucherByEmail(email: string): Promise<VoucherRecord | null> {
  const db = ensureDatabaseFile();
  const normalized = email.trim().toLowerCase();
  return (
    db.vouchers.find(
      (v) => (v.userEmail && v.userEmail.toLowerCase() === normalized) || v.userId.toLowerCase() === normalized
    ) || null
  );
}

export async function getVoucherById(id: string): Promise<VoucherRecord | null> {
  const db = ensureDatabaseFile();
  return db.vouchers.find((v) => v.id === id) || null;
}

export async function saveVoucher(voucher: VoucherRecord): Promise<VoucherRecord> {
  const db = ensureDatabaseFile();
  const index = db.vouchers.findIndex((v) => v.id === voucher.id);

  if (index >= 0) {
    db.vouchers[index] = voucher;
  } else {
    db.vouchers.push(voucher);
  }

  // Update user record with voucher link
  if (voucher.userEmail) {
    const user = db.users.find((u) => u.email.toLowerCase() === voucher.userEmail!.toLowerCase());
    if (user) {
      user.voucherId = voucher.id;
    }
  }

  saveDatabaseFile(db);

  // Background sync to Supabase if table exists
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('vouchers').upsert({
        id: voucher.id,
        user_id: voucher.userId,
        user_email: voucher.userEmail,
        item_id: voucher.itemId,
        claim_code: voucher.claimCode,
        status: voucher.status,
        expires_at: voucher.expiresAt,
        perk: voucher.perk,
        final_price_php: voucher.finalPricePhp,
      });
    } catch {
      // Supabase table may not exist yet; local database persists seamlessly
    }
  }

  return voucher;
}

export async function redeemVoucher(voucherId: string, cashierId: string = 'counter-cashier-1'): Promise<VoucherRecord | null> {
  const db = ensureDatabaseFile();
  const voucher = db.vouchers.find((v) => v.id === voucherId);

  if (!voucher) return null;

  const updated: VoucherRecord = {
    ...voucher,
    status: 'REDEEMED',
  };

  const index = db.vouchers.findIndex((v) => v.id === voucherId);
  db.vouchers[index] = updated;
  saveDatabaseFile(db);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('vouchers')
        .update({
          status: 'REDEEMED',
          redeemed_at: new Date().toISOString(),
          redeemed_by_cashier_id: cashierId,
        })
        .eq('id', voucherId);
    } catch {
      // Supabase table may not exist yet; local database persists seamlessly
    }
  }

  return updated;
}
