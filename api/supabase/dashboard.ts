import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../_lib/session.js';
import { getSupabaseClient } from './_lib.js';

// GET /api/supabase/dashboard?role=supervisor  → supervisor stats
// GET /api/supabase/dashboard?role=admin       → admin certification matrix

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const role = req.query.role as string;
  const supabase = getSupabaseClient();

  try {
    // ── Supervisor dashboard ─────────────────────────────────────────
    if (role === 'supervisor') {
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
    }

    // ── Admin dashboard ──────────────────────────────────────────────
    if (role === 'admin') {
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
    }

    return res.status(400).json({ error: 'role must be supervisor or admin' });
  } catch (err) {
    console.error('[dashboard]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
