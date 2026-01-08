# 🏗️ ESTRUTURA DE CLIENTES SUPABASE

## 📁 Organização

```
lib/supabase/
  ├── client.ts      → Browser Client (Client Components)
  ├── server.ts      → Server Client (Server Components)
  ├── admin.ts       → Admin Client (API Routes)
  └── index.ts       → Exports centralizados
```

---

## 🎯 Quando usar cada cliente?

### **1. `createClient()` - Client Components**

✅ **Use em:**

- Client Components (`"use client"`)
- React hooks customizados
- Event handlers do browser
- Operações que precisam de autenticação do usuário

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function MyComponent() {
  const supabase = createClient();
  // Usa anon key - seguro para browser
}
```

---

### **2. `createServerSupabaseClient()` - Server Components**

✅ **Use em:**

- Server Components (sem `"use client"`)
- `generateMetadata()`
- `generateStaticParams()`
- Fetch de dados em páginas

```tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  // Acessa cookies do Next.js - mantém sessão
}
```

---

### **3. `createAdminClient()` - API Routes**

⚠️ **Use APENAS em:**

- API Routes (`app/api/**/route.ts`)
- Server Actions com operações privilegiadas
- Migrations e scripts de setup

🚨 **NUNCA exponha ao cliente!**

```tsx
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = createAdminClient();
  // Usa service_role key - bypassa RLS
}
```

---

## 🔒 Segurança

| Cliente                        | Key          | Exposição      | RLS          |
| ------------------------------ | ------------ | -------------- | ------------ |
| `createClient()`               | anon         | ✅ Seguro      | ✅ Ativo     |
| `createServerSupabaseClient()` | anon         | ✅ Seguro      | ✅ Ativo     |
| `createAdminClient()`          | service_role | ❌ NUNCA expor | ❌ Bypassado |

---

## ✅ Migração Completa

### **Antes (3 arquivos confusos):**

```
lib/
  ├── supabase.ts          ❌ Deletado
  ├── supabaseClient.ts    ❌ Deletado
  └── supabase/
      └── client.ts
```

### **Depois (estrutura limpa):**

```
lib/supabase/
  ├── client.ts      ✅ Browser
  ├── server.ts      ✅ Server Components
  ├── admin.ts       ✅ Admin
  └── index.ts       ✅ Exports
```

---

## 📚 Imports

```tsx
// Opção 1: Import direto
import { createClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Opção 2: Import do index (recomendado)
import {
  createClient,
  createServerSupabaseClient,
  createAdminClient,
} from "@/lib/supabase";
```

---

## 🔄 Arquivos Atualizados

✅ Todos os imports atualizados:

- `app/context/AuthContext.tsx`
- `app/api/**/*.ts` (todas as APIs)
- `components/**/*.tsx` (SearchBar, etc)

✅ Arquivos removidos:

- `lib/supabase.ts`
- `lib/supabaseClient.ts`
- `pages/` (Pages Router legacy)
- `context/` (duplicado)

---

## 🎉 Benefícios

1. **Clareza:** Cada cliente tem propósito específico
2. **Segurança:** Separação clara entre anon e service_role
3. **Manutenibilidade:** Imports consistentes
4. **Type Safety:** TypeScript completo
5. **Documentação:** Código auto-explicativo

---

**Data da refatoração:** Janeiro 2026
