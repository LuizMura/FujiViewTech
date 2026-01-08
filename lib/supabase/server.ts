import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria um cliente Supabase para Server Components e Server Actions
 * Usa cookies() do Next.js para manter sessão do usuário
 * @returns Cliente Supabase configurado para servidor
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignora erros em Server Components (cookies são read-only)
          }
        },
      },
    }
  );
}
