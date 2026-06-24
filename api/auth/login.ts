import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { setSessionCookie, signSession, type SessionUser } from '../_lib/session.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { employeeInternalId, password } = (req.body ?? {}) as {
    employeeInternalId?: string;
    password?: string;
  };
  if (!employeeInternalId || !password) {
    return res.status(400).json({ error: 'employeeInternalId and password required' });
  }

  const janusUrl = process.env.JANUS_URL;
  const instanceId = process.env.JANUS_INSTANCE_ID;
  if (!janusUrl || !instanceId) {
    return res.status(500).json({ error: 'JANUS_URL or JANUS_INSTANCE_ID not configured' });
  }

  // 1. Authenticate with Janus
  const upstream = await fetch(`${janusUrl}/cx-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      employeeInternalId,
      instanceId: Number(instanceId),
      password,
    }),
  });

  if (!upstream.ok) {
    // Janus failed — try bypass if configured
    const bypassPassword = process.env.BYPASS_PASSWORD;
    if (bypassPassword && password === bypassPassword) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, name, role, email')
          .eq('email', employeeInternalId)
          .single();
        if (profile) {
          const [firstName, ...rest] = (profile.name as string).split(' ');
          const user: SessionUser = {
            id: 0,
            employeeInternalId,
            firstName: firstName ?? '',
            lastName: rest.join(' '),
            email: profile.email as string,
            instanceId: Number(instanceId),
            role: profile.role as SessionUser['role'],
            supabaseProfileId: profile.id as string,
          };
          const token = await signSession(user);
          setSessionCookie(res, token);
          return res.status(200).json({ user });
        }
      }
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const data = (await upstream.json()) as Omit<SessionUser, 'instanceId' | 'role'> & { instanceId?: number };

  // 2. Upsert profile in Supabase and fetch role
  let role: SessionUser['role'] = 'operator';
  let supabaseProfileId: string | undefined;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Use email from Janus if available, otherwise fall back to employeeInternalId
  const profileEmail = data.email || employeeInternalId;

  if (supabaseUrl && supabaseKey && profileEmail) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const fullName = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();

      // Upsert profile — only update name if record already exists, keep existing role
      const { data: profile } = await supabase
        .from('profiles')
        .upsert(
          { email: profileEmail, name: fullName, role: 'operator' },
          { onConflict: 'email', ignoreDuplicates: true },
        )
        .select('id, role')
        .single();

      if (profile) {
        role = profile.role;
        supabaseProfileId = profile.id;
      } else {
        // If upsert with ignoreDuplicates didn't return data, fetch separately
        const { data: existing } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', profileEmail)
          .single();
        if (existing) {
          role = existing.role;
          supabaseProfileId = existing.id;
        }
      }
    } catch {
      // Non-fatal: default to operator if Supabase is unreachable
    }
  }

  const user: SessionUser = {
    id: data.id,
    employeeInternalId: data.employeeInternalId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email ?? employeeInternalId,
    language: data.language,
    instanceId: data.instanceId ?? Number(instanceId),
    role,
    supabaseProfileId,
  };

  const token = await signSession(user);
  setSessionCookie(res, token);
  return res.status(200).json({ user });
}
