import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hdgsxmtxbarnajxmcohx.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZ3N4bXR4YmFybmFqeG1jb2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjc0ODQsImV4cCI6MjEwNTkwMzQ4NH0.QhEg3oxVjpbdsVdB5KSP3HFrT_NyI3gcJIeR2x9V1jM';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
