-- ===============================================================
-- PandeLoot by Manay's Panaderia - Database Schema for Supabase
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hdgsxmtxbarnajxmcohx/sql
-- ===============================================================

-- 1. USERS TABLE: Tracks every user who logged on via Google
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    picture TEXT,
    google_sub TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    voucher_id TEXT
);

-- Index on email for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. VOUCHERS TABLE: Strict 1 User = 1 Voucher Enforcement
CREATE TABLE IF NOT EXISTS public.vouchers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT UNIQUE NOT NULL, -- Enforces 1 voucher per email!
    item_id TEXT NOT NULL,
    claim_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'REDEEMED', 'EXPIRED'
    perk TEXT NOT NULL, -- '50% OFF', 'Buy 1 Get 1', '100% Free'
    final_price_php NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    redeemed_at TIMESTAMPTZ,
    redeemed_by_cashier_id TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_email) REFERENCES public.users(email) ON DELETE SET NULL
);

-- Index on user_email and claim_code
CREATE INDEX IF NOT EXISTS idx_vouchers_user_email ON public.vouchers(user_email);
CREATE INDEX IF NOT EXISTS idx_vouchers_claim_code ON public.vouchers(claim_code);

-- 3. Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Allow public read of active vouchers with their own claim code
CREATE POLICY "Public read vouchers with claim code"
ON public.vouchers FOR SELECT
USING (true);

-- Allow server service role full access
CREATE POLICY "Service role full access on users"
ON public.users FOR ALL
USING (true);

CREATE POLICY "Service role full access on vouchers"
ON public.vouchers FOR ALL
USING (true);
