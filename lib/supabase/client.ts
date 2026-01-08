import { createBrowserClient } from "@supabase/ssr";

/**
 * Cria um cliente Supabase para Client Components
 * Mantém sessão do usuário no browser com cookies
 * Usa anon key (seguro para exposição pública)
 * @returns Cliente Supabase configurado para browser
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
