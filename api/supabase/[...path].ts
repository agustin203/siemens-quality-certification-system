import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../_lib/session.js';
import { getSupabaseClient } from './_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const segments = (req.query.path ?? req.query['...path']) as
    | string
    | string[]
    | undefined;
  const parts = Array.isArray(segments)
    ? segments
    : (segments ?? '').split('/').filter(Boolean);
  const path = parts.join('/');

  const supabase = getSupabaseClient();

  try {
    // ─────────────────────────────────────────────
    // GET /api/supabase/profile
    // Returns the current user's profile (role, name)
    // ─────────────────────────────────────────────
    if (path === 'profile' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, role')
        .eq('email', user.email)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return res.status(200).json({ profile: data ?? null });
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/processes
    // ─────────────────────────────────────────────
    if (path === 'processes' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('processes')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return res.status(200).json({ data });
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/operations?processId=<uuid>
    // ─────────────────────────────────────────────
    if (path === 'operations' && req.method === 'GET') {
      const { processId } = req.query as { processId?: string };
      let q = supabase.from('operations').select('id, process_id, name, tiempo_estandar_seg').order('name');
      if (processId) q = q.eq('process_id', processId);
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json({ data });
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/certifications
    // Operator: their own requests
    // ORO / Admin / Supervisor: all requests
    // ─────────────────────────────────────────────
    if (path === 'certifications' && req.method === 'GET') {
      const profile = await getProfile(supabase, user.email);
      const isOperator = !profile || profile.role === 'operator';

      let q = supabase
        .from('certification_requests')
        .select(`
          id,
          status,
          attempt_number,
          max_attempts,
          cooldown_until,
          expiration_date,
          created_at,
          operator:profiles!operator_id(id, name, email),
          operation:operations!operation_id(
            id, name, tiempo_estandar_seg,
            process:processes!process_id(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (isOperator) {
        const profileRow = await getProfile(supabase, user.email);
        if (!profileRow) return res.status(200).json({ data: [] });
        q = q.eq('operator_id', profileRow.id);
      }

      const { data, error } = await q;
      if (error) throw error;

      const shaped = (data ?? []).map(shapeRequest);
      return res.status(200).json({ data: shaped });
    }

    // ─────────────────────────────────────────────
    // POST /api/supabase/certifications
    // Operator creates a new certification request
    // ─────────────────────────────────────────────
    if (path === 'certifications' && req.method === 'POST') {
      const { operationId } = req.body as { operationId?: string };
      if (!operationId) return res.status(400).json({ error: 'operationId required' });

      const profile = await getProfile(supabase, user.email);
      if (!profile) return res.status(403).json({ error: 'Profile not found' });

      const { data, error } = await supabase
        .from('certification_requests')
        .insert({
          operator_id: profile.id,
          operation_id: operationId,
          status: 'in_progress',
          attempt_number: 0,
          max_attempts: 4,
        })
        .select(`
          id,
          status,
          attempt_number,
          max_attempts,
          cooldown_until,
          expiration_date,
          created_at,
          operator:profiles!operator_id(id, name, email),
          operation:operations!operation_id(
            id, name, tiempo_estandar_seg,
            process:processes!process_id(id, name)
          )
        `)
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Ya existe una solicitud activa para esta operación' });
        }
        throw error;
      }

      return res.status(201).json({ data: shapeRequest(data) });
    }

    // ─────────────────────────────────────────────
    // PATCH /api/supabase/certifications/:id/cancel
    // ─────────────────────────────────────────────
    if (parts[0] === 'certifications' && parts[2] === 'cancel' && req.method === 'PATCH') {
      const id = parts[1];
      const profile = await getProfile(supabase, user.email);
      if (!profile) return res.status(403).json({ error: 'Profile not found' });

      const { error } = await supabase
        .from('certification_requests')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('operator_id', profile.id)
        .eq('status', 'in_progress');

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/oro/pending
    // ORO sees all in_progress requests
    // ─────────────────────────────────────────────
    if (path === 'oro/pending' && req.method === 'GET') {
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
    }

    // ─────────────────────────────────────────────
    // POST /api/supabase/oro/attempt
    // ORO submits an evaluation result
    // ─────────────────────────────────────────────
    if (path === 'oro/attempt' && req.method === 'POST') {
      const { requestId, tiempoRegistradoSeg, result } = req.body as {
        requestId?: string;
        tiempoRegistradoSeg?: number;
        result?: 'passed' | 'failed';
      };

      if (!requestId || tiempoRegistradoSeg == null || !result) {
        return res.status(400).json({ error: 'requestId, tiempoRegistradoSeg, result required' });
      }

      const oroProfile = await getProfile(supabase, user.email);
      if (!oroProfile) return res.status(403).json({ error: 'Profile not found' });

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
          evaluator_id: oroProfile.id,
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
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/oro/history
    // ORO sees all attempts they conducted
    // ─────────────────────────────────────────────
    if (path === 'oro/history' && req.method === 'GET') {
      const oroProfile = await getProfile(supabase, user.email);
      if (!oroProfile) return res.status(200).json({ data: [] });

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
        .eq('evaluator_id', oroProfile.id)
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
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/attempts?requestId=<uuid>
    // Attempts for a specific certification request
    // ─────────────────────────────────────────────
    if (path === 'attempts' && req.method === 'GET') {
      const { requestId } = req.query as { requestId?: string };
      if (!requestId) return res.status(400).json({ error: 'requestId required' });

      const { data, error } = await supabase
        .from('certification_attempts')
        .select(`
          id,
          attempt_number,
          completed_at,
          tiempo_registrado_seg,
          meets_threshold,
          result,
          evaluator:profiles!evaluator_id(name)
        `)
        .eq('request_id', requestId)
        .order('attempt_number');

      if (error) throw error;

      const shaped = (data ?? []).map((a) => ({
        id: a.id,
        requestId,
        attemptNumber: a.attempt_number,
        completedAt: a.completed_at,
        tiempoRegistradoSeg: Number(a.tiempo_registrado_seg),
        meetsThreshold: a.meets_threshold,
        result: a.result,
        evaluatorName: (a.evaluator as any)?.name ?? '',
      }));

      return res.status(200).json({ data: shaped });
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/dashboard/supervisor
    // Aggregated stats per process for supervisor
    // ─────────────────────────────────────────────
    if (path === 'dashboard/supervisor' && req.method === 'GET') {
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
        return {
          processId: proc.id,
          processName: proc.name,
          totalOperators: total,
          certified,
          inProgress,
          risk,
        };
      });

      return res.status(200).json({ data: stats });
    }

    // ─────────────────────────────────────────────
    // GET /api/supabase/dashboard/admin
    // Matrix of operators × operations for admin
    // ─────────────────────────────────────────────
    if (path === 'dashboard/admin' && req.method === 'GET') {
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

      // Group by process
      const byProcess: Record<string, {
        processId: string;
        processName: string;
        operations: { id: string; name: string }[];
        operators: Record<string, { operatorId: string; operatorName: string; certifications: Record<string, string> }>;
      }> = {};

      for (const r of (requests ?? [])) {
        const op = r.operation as any;
        const proc = op?.process;
        const operator = r.operator as any;
        if (!proc || !operator) continue;

        if (!byProcess[proc.id]) {
          byProcess[proc.id] = {
            processId: proc.id,
            processName: proc.name,
            operations: [],
            operators: {},
          };
        }

        const pg = byProcess[proc.id];
        if (!pg.operations.find((o) => o.id === op.id)) {
          pg.operations.push({ id: op.id, name: op.name });
        }
        if (!pg.operators[operator.id]) {
          pg.operators[operator.id] = {
            operatorId: operator.id,
            operatorName: operator.name,
            certifications: {},
          };
        }

        // Keep the "best" status per operator+operation
        const existing = pg.operators[operator.id].certifications[op.id];
        const rank: Record<string, number> = { approved: 3, in_progress: 2, rejected: 1, cancelled: 0 };
        if (!existing || (rank[r.status] ?? -1) > (rank[existing] ?? -1)) {
          pg.operators[operator.id].certifications[op.id] = r.status;
        }
      }

      return res.status(200).json({ data: Object.values(byProcess) });
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (err) {
    console.error('[supabase proxy]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProfile(supabase: any, email: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, email, name, role')
    .eq('email', email)
    .single();
  return data ?? null;
}

function isCooldownActive(cooldownUntil: string | null): boolean {
  if (!cooldownUntil) return false;
  return new Date(cooldownUntil) > new Date();
}

function shapeRequest(r: any) {
  return {
    id: r.id,
    processId: r.operation?.process?.id ?? '',
    processName: r.operation?.process?.name ?? '',
    operationId: r.operation?.id ?? '',
    operationName: r.operation?.name ?? '',
    requestDate: r.created_at,
    status: r.status,
    expirationDate: r.expiration_date ?? undefined,
    operatorName: r.operator?.name ?? '',
    attemptNumber: r.attempt_number,
    maxAttempts: r.max_attempts,
    cooldownUntil: r.cooldown_until ?? undefined,
    tiempoEstandarSeg: r.operation?.tiempo_estandar_seg ?? undefined,
  };
}
