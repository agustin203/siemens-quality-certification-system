import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../../_lib/session.js';
import { getSupabaseClient } from '../../_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'id required' });

  const supabase = getSupabaseClient();

  try {
    const profileId = await getProfileId(supabase, user);
    if (!profileId) return res.status(403).json({ error: 'Profile not found' });

    const { error } = await supabase
      .from('certification_requests')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('operator_id', profileId)
      .eq('status', 'in_progress');

    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[certifications/cancel]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProfileId(supabase: any, user: { supabaseProfileId?: string; email?: string }): Promise<string | null> {
  if (user.supabaseProfileId) return user.supabaseProfileId;
  if (!user.email) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', user.email)
    .single();
  return data?.id ?? null;
}
