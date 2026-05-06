import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../../_lib/session.js';
import { getSupabaseClient } from '../_lib.js';

// Handles:
//   PATCH /api/supabase/processes/:id          → edit metadata
//   PATCH /api/supabase/processes/:id/status   → publish / archive

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const raw = req.query.segments;
  const segments = Array.isArray(raw) ? raw : [raw ?? ''];
  const id = segments[0];
  const sub = segments[1]; // 'status' or undefined

  if (!id) return res.status(400).json({ error: 'id required' });

  const supabase = getSupabaseClient();

  try {
    // ── PATCH /processes/:id/status ──────────────────────────────
    if (sub === 'status') {
      const { status } = req.body as { status?: string };
      if (!status) return res.status(400).json({ error: 'status required' });

      const { error } = await supabase
        .from('processes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    // ── PATCH /processes/:id (edit metadata) ─────────────────────
    const { nombre, modelo, familia, linea, turno } = req.body as {
      nombre?: string; modelo?: string; familia?: string;
      linea?: string; turno?: string;
    };

    const updates: Record<string, unknown> = {};
    if (nombre !== undefined) updates.name = nombre;
    if (modelo !== undefined) updates.modelo = modelo;
    if (familia !== undefined) updates.familia = familia;
    if (linea !== undefined) updates.linea = linea;
    if (turno !== undefined) updates.turno = turno;

    const { data, error } = await supabase
      .from('processes')
      .update(updates)
      .eq('id', id)
      .select('id, name, modelo, familia, linea, turno, version, status, created_at')
      .single();

    if (error) throw error;

    return res.status(200).json({
      data: {
        id: data.id,
        nombre: data.name,
        modelo: data.modelo ?? '',
        familia: data.familia ?? '',
        linea: data.linea ?? '',
        turno: data.turno ?? '',
        version: data.version ?? 1,
        status: data.status ?? 'draft',
        createdAt: data.created_at,
      },
    });
  } catch (err) {
    console.error('[processes/[...segments]]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
