import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../_lib/session.js';
import { getSupabaseClient } from './_lib.js';

// PATCH /api/supabase/process-status?id=xxx  → publish / archive

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'id required' });

  const supabase = getSupabaseClient();

  try {
    const { status } = req.body as { status?: string };
    if (!status) return res.status(400).json({ error: 'status required' });

    const { error } = await supabase
      .from('processes')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[process-status]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
