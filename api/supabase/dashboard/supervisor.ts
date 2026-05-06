import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../_lib/session.js';
import { getSupabaseClient } from '../_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseClient();

  try {
    const { data: procs, error: procErr } = await supabase
      .from('processes')
      .select('id, name');
    if (procErr) throw procErr;

    const { data: requests, error: reqErr } = await supabase
      .from('certification_requests')
      .select('id, status, operation:operations!operation_id(process_id)');
    if (reqErr) throw reqErr;

    const stats = (procs ?? []).map((proc) => {
      const procRequests = (requests ?? []).filter(
        (r) => (r.operation as any)?.process_id === proc.id,
      );
      const certified = procRequests.filter((r) => r.status === 'approved').length;
      const inProgress = procRequests.filter((r) => r.status === 'in_progress').length;
      const total = procRequests.length;
      const pct = total > 0 ? certified / total : 0;
      const risk = pct >= 0.8 ? 'ok' : pct >= 0.5 ? 'warning' : 'critical';
      return { processId: proc.id, processName: proc.name, totalOperators: total, certified, inProgress, risk };
    });

    return res.status(200).json({ data: stats });
  } catch (err) {
    console.error('[dashboard/supervisor]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
