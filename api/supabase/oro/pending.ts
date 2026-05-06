import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../_lib/session.js';
import { getSupabaseClient } from '../_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('certification_requests')
      .select(`
        id,
        status,
        attempt_number,
        max_attempts,
        cooldown_until,
        created_at,
        operator:profiles!operator_id(id, name),
        operation:operations!operation_id(
          id, name, tiempo_estandar_seg,
          process:processes!process_id(id, name)
        )
      `)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const shaped = (data ?? []).map((r) => ({
      id: r.id,
      operatorName: (r.operator as any)?.name ?? '',
      processId: (r.operation as any)?.process?.id ?? '',
      processName: (r.operation as any)?.process?.name ?? '',
      operationId: (r.operation as any)?.id ?? '',
      operationName: (r.operation as any)?.name ?? '',
      tiempoEstandarSeg: (r.operation as any)?.tiempo_estandar_seg ?? 0,
      requestDate: r.created_at,
      attemptNumber: r.attempt_number,
      maxAttempts: r.max_attempts,
      status: isCooldownActive(r.cooldown_until) ? 'cooldown' : 'available',
      cooldownUntil: r.cooldown_until ?? undefined,
    }));

    return res.status(200).json({ data: shaped });
  } catch (err) {
    console.error('[oro/pending]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function isCooldownActive(cooldownUntil: string | null): boolean {
  if (!cooldownUntil) return false;
  return new Date(cooldownUntil) > new Date();
}
