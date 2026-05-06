import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../_lib/session.js';
import { getSupabaseClient } from '../_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = getSupabaseClient();

  try {
    const { data: requests, error } = await supabase
      .from('certification_requests')
      .select(`
        id, status,
        operator:profiles!operator_id(id, name),
        operation:operations!operation_id(
          id, name,
          process:processes!process_id(id, name)
        )
      `);
    if (error) throw error;

    const byProcess: Record<string, {
      processId: string; processName: string;
      operations: { id: string; name: string }[];
      operators: Record<string, { operatorId: string; operatorName: string; certifications: Record<string, string> }>;
    }> = {};

    for (const r of (requests ?? [])) {
      const op = r.operation as any;
      const proc = op?.process;
      const operator = r.operator as any;
      if (!proc || !operator) continue;

      if (!byProcess[proc.id]) {
        byProcess[proc.id] = { processId: proc.id, processName: proc.name, operations: [], operators: {} };
      }

      const pg = byProcess[proc.id];
      if (!pg.operations.find((o) => o.id === op.id)) pg.operations.push({ id: op.id, name: op.name });
      if (!pg.operators[operator.id]) {
        pg.operators[operator.id] = { operatorId: operator.id, operatorName: operator.name, certifications: {} };
      }

      const existing = pg.operators[operator.id].certifications[op.id];
      const rank: Record<string, number> = { approved: 3, in_progress: 2, rejected: 1, cancelled: 0 };
      if (!existing || (rank[r.status] ?? -1) > (rank[existing] ?? -1)) {
        pg.operators[operator.id].certifications[op.id] = r.status;
      }
    }

    return res.status(200).json({ data: Object.values(byProcess) });
  } catch (err) {
    console.error('[dashboard/admin]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
