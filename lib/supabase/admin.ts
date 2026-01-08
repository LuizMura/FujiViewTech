import { createClient } from "@supabase/supabase-js";

/**
 * Cria um cliente Supabase com privilégios de administrador
 * ⚠️ APENAS PARA USO EM SERVER SIDE (API Routes, Server Actions)
 * ⚠️ NUNCA exponha este cliente ao browser
 *
 * Usa service_role key para bypassing RLS e operações privilegiadas
 * @returns Cliente Supabase com permissões de admin
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
