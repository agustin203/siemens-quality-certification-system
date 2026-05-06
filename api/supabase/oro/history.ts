import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../_lib/session.js';
import { getSupabaseClient } from '../_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseClient();

  try {
    const oroProfileId = await getProfileId(supabase, user);
    if (!oroProfileId) return res.status(200).json({ data: [] });

    const { data, error } = await supabase
      .from('certification_attempts')
      .select(`
        id,
        attempt_number,
        completed_at,
        tiempo_registrado_seg,
        result,
        request:certification_requests!request_id(
          operator:profiles!operator_id(name),
          operation:operations!operation_id(
            name, tiempo_estandar_seg,
            process:processes!process_id(name)
          )
        )
      `)
      .eq('evaluator_id', oroProfileId)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    const shaped = (data ?? []).map((a) => ({
      id: a.id,
      operatorName: (a.request as any)?.operator?.name ?? '',
      processName: (a.request as any)?.operation?.process?.name ?? '',
      operationName: (a.request as any)?.operation?.name ?? '',
      evaluatedAt: a.completed_at,
      tiempoRegistradoSeg: a.tiempo_registrado_seg,
      tiempoEstandarSeg: (a.request as any)?.operation?.tiempo_estandar_seg ?? 0,
      attemptNumber: a.attempt_number,
      result: a.result,
    }));

    return res.status(200).json({ data: shaped });
  } catch (err) {
    console.error('[oro/history]', err);
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
