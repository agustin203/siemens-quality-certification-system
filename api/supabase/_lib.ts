import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export type UserRole = 'operator' | 'oro' | 'admin' | 'supervisor';

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
};
