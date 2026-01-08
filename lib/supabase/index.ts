/**
 * Supabase Client Library
 *
 * Exports centralizados para clientes Supabase.
 * Escolha o cliente correto baseado no contexto:
 *
 * - `createClient()`: Client Components e hooks
 * - `createServerSupabaseClient()`: Server Components, generateMetadata, etc
 * - `createAdminClient()`: API Routes com operações privilegiadas
 */

export { createClient } from "./client";
export { createServerSupabaseClient } from "./server";
export { createAdminClient } from "./admin";
