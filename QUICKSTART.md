# 🎯 Quick Start: Supabase + Vercel Setup

## O que foi feito no projeto

✅ **APIs atualizadas:**
- `app/api/upload/route.ts` → agora faz upload para Supabase Storage
- `app/api/hero/route.ts` → agora salva/carrega do Postgres (Supabase)

✅ **Cliente Supabase:**
- `lib/supabase.ts` → helper para criar clientes de servidor e cliente

✅ **Documentação:**
- `.env.local.example` → template de variáveis de ambiente
- `docs/DEPLOY_SUPABASE_VERCEL.md` → guia completo passo-a-passo

## Próximos Passos (3 minutos)

### 1. Criar Supabase (1 minuto)
```
https://supabase.com → Sign Up → New Project
```
- Salve: `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Crie bucket `uploads` em Storage (público)
- Execute SQL para tabela (veja `docs/DEPLOY_SUPABASE_VERCEL.md`)

### 2. Configurar Localmente (1 minuto)
```bash
# Copiar template
cp .env.local.example .env.local

# Editar .env.local com suas credenciais do Supabase
# Depois salve e reinicie o servidor:
npm run dev
```

### 3. Deploy Vercel (1 minuto)
```
https://vercel.com → New Project → Conectar repositório → Adicionar env vars
```
- Adicione as mesmas variáveis de `.env.local` no Vercel Settings → Environment Variables

---

## Validação

Depois de tudo pronto, teste:
1. Abra `http://localhost:3000` (ou seu URL Vercel)
2. Clique Settings no hero
3. Mude um texto e clique "Salvar"
4. Recarregue a página — a mudança deve aparecer

Se tudo funcionar, parabéns! 🎉 Seu site está online!

---

Ver `docs/DEPLOY_SUPABASE_VERCEL.md` para guia detalhado com screenshots/troubleshooting.
