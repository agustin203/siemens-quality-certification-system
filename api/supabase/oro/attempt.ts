import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../_lib/session.js';
import { getSupabaseClient } from '../_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseClient();

  try {
    const { requestId, tiempoRegistradoSeg, result } = req.body as {
      requestId?: string;
      tiempoRegistradoSeg?: number;
      result?: 'passed' | 'failed';
    };

    if (!requestId || tiempoRegistradoSeg == null || !result) {
      return res.status(400).json({ error: 'requestId, tiempoRegistradoSeg, result required' });
    }

    const oroProfileId = await getProfileId(supabase, user);
    if (!oroProfileId) return res.status(403).json({ error: 'Profile not found' });

    // Fetch the request to get current attempt number and operation data
    const { data: reqData, error: reqErr } = await supabase
      .from('certification_requests')
      .select(`
        id, attempt_number, max_attempts,
        operation:operations!operation_id(tiempo_estandar_seg)
      `)
      .eq('id', requestId)
      .single();

    if (reqErr || !reqData) return res.status(404).json({ error: 'Request not found' });

    const newAttemptNumber = reqData.attempt_number + 1;
    const tiempoEstandar = (reqData.operation as any)?.tiempo_estandar_seg ?? 0;
    const meetsThreshold = tiempoEstandar > 0
      ? tiempoEstandar / tiempoRegistradoSeg >= 0.8
      : false;

    // Insert the attempt
    const { error: attErr } = await supabase
      .from('certification_attempts')
      .insert({
        request_id: requestId,
        evaluator_id: oroProfileId,
        attempt_number: newAttemptNumber,
        completed_at: new Date().toISOString(),
        tiempo_registrado_seg: tiempoRegistradoSeg,
        meets_threshold: meetsThreshold,
        result,
      });

    if (attErr) throw attErr;

    // Update the request
    const COOLDOWN_DAYS = 7;
    const cooldownUntil = new Date();
    cooldownUntil.setDate(cooldownUntil.getDate() + COOLDOWN_DAYS);

    const newStatus = result === 'passed'
      ? 'approved'
      : newAttemptNumber >= reqData.max_attempts
        ? 'rejected'
        : 'in_progress';

    const expirationDate = result === 'passed'
      ? (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString(); })()
      : null;

    const { error: updateErr } = await supabase
      .from('certification_requests')
      .update({
        status: newStatus,
        attempt_number: newAttemptNumber,
        cooldown_until: result === 'failed' ? cooldownUntil.toISOString() : null,
        expiration_date: expirationDate,
      })
      .eq('id', requestId);

    if (updateErr) throw updateErr;

    return res.status(200).json({ ok: true, newStatus, attemptNumber: newAttemptNumber });
  } catch (err) {
    console.error('[oro/attempt]', err);
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
