import type { VercelRequest, VercelResponse } from '@vercel/node';

import { requireUser } from '../_lib/session.js';
import { getSupabaseClient } from './_lib.js';

// PATCH /api/supabase/operation-update?id=xxx  → edit
// DELETE /api/supabase/operation-update?id=xxx → delete

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'id required' });

  const supabase = getSupabaseClient();

  try {
    if (req.method === 'PATCH') {
      const { nombre, tiempoEstandarSeg } = req.body as {
        nombre?: string; tiempoEstandarSeg?: number;
      };

      const updates: Record<string, unknown> = {};
      if (nombre !== undefined) updates.name = nombre;
      if (tiempoEstandarSeg !== undefined) updates.tiempo_estandar_seg = tiempoEstandarSeg;

      const { data, error } = await supabase
        .from('operations')
        .update(updates)
        .eq('id', id)
        .select('id, process_id, name, tiempo_estandar_seg, orden')
        .single();

      if (error) throw error;

      return res.status(200).json({
        data: {
          id: data.id,
          process_id: data.process_id,
          nombre: data.name,
          tiempo_estandar_seg: Number(data.tiempo_estandar_seg),
          orden: data.orden ?? 1,
        },
      });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('operations').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[operation-update]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
