# 🚀 Guia de Deploy: Supabase + Vercel

## 📋 Passos para deixar o projeto online

### 1. Criar Projeto Supabase

1. Acesse https://supabase.com e faça login/crie uma conta
2. Clique em "New Project"
3. Selecione sua organização e digite um nome (ex: "fujiviewtech")
4. Escolha a região mais próxima (ex: "South America - São Paulo")
5. Defina a senha do Postgres (salve em lugar seguro)
6. Espere o projeto ser criado (~2 minutos)

### 2. Obter Credenciais Supabase

1. Vá para Settings → API
2. Copie e salve:
   - `SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public anon key)
3. Vá para Settings → Database → API Keys
4. Copie e salve:
   - `SUPABASE_SERVICE_ROLE_KEY` (service role secret)

### 3. Criar Bucket de Storage

1. No dashboard Supabase, vá para Storage
2. Clique em "Create a new bucket"
3. Nome: `uploads`
4. Make it public: ✅ (sim, para exibir imagens publicamente)
5. Clique Create

### 4. Criar Tabela no Postgres

1. No dashboard Supabase, vá para SQL Editor
2. Crie uma nova query e cole:

```sql
create table if not exists public.hero_content (
  id int primary key,
  badge text,
  mainTitle text,
  gradientTitle text,
  description text,
  buttonText text,
  buttonLink text,
  imageUrl text,
  imageAlt text,
  topCard jsonb,
  bottomCard jsonb,
  updated_at timestamp with time zone default now()
);

-- Allow public read access (opcional, para fetch de GET)
alter table public.hero_content enable row level security;

create policy "Enable read access for all users" on public.hero_content
  as (select)
  using (true);
```

3. Execute (Run)

### 5. Configurar Variáveis Localmente

1. Na raiz do projeto, crie `.env.local` copiando `.env.local.example`:

```bash
cp .env.local.example .env.local
```

2. Abra `.env.local` e preencha com suas credenciais Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

3. Salve o arquivo (NÃO commite `.env.local` no Git!)

### 6. Testar Localmente

1. Reinicie o servidor Next.js:

```bash
npm run dev
```

2. Abra http://localhost:3000
3. Teste o dashboard:

   - Clique no botão Settings (hero)
   - Mude algum texto e clique "Salvar Mudanças"
   - Verifique se a mudança aparece no BD Supabase
   - Teste upload de imagem

4. Recarregue a página (F5) e verifique se os dados foram carregados

### 7. Deploy no Vercel

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em "New Project"
3. Selecione o repositório `FujiViewTech` (deve aparecer na lista)
4. Configure Build Settings:
   - Framework Preset: `Next.js`
   - Build Command: deixe padrão
5. Em "Environment Variables", adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = seu valor do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = seu valor do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = seu valor do Supabase (⚠️ este é secreto)
6. Clique "Deploy"
7. Espere a build terminar (~3-5 minutos)

### 8. Teste em Produção

1. Após deploy, Vercel fornecerá uma URL (ex: `fujiviewtech-luizmura.vercel.app`)
2. Abra a URL e teste:
   - Dashboard edições
   - Upload de imagens
   - Recarregar página para verificar persistência

### 9. (Opcional) Adicione Domínio Personalizado

1. Em Vercel → Domains
2. Adicione seu domínio (ex: `fujiviewtech.com`)
3. Atualize DNS do seu registrador com as instruções do Vercel
4. Espere DNS propagar (~5-30 minutos)

## 🔒 Segurança

- ✅ `NEXT_PUBLIC_*` = seguro expor no browser (são públicos)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` = NUNCA exponha (chave admin). Apenas no servidor/Vercel secrets.
- Supabase usa Row Level Security (RLS) — configure policies conforme necessário.

## 🐛 Troubleshooting

**Erro: "SUPABASE_URL or SERVICE_ROLE_KEY missing"**

- Verifique se `.env.local` existe e tem os valores corretos
- Reinicie o servidor Next.js

**Erro: "No bucket named 'uploads'"**

- Crie o bucket `uploads` no Supabase Storage

**Erro: "relation 'public.hero_content' does not exist"**

- Execute o SQL acima para criar a tabela

**Imagens não aparecem após upload**

- Verifique se o bucket `uploads` é público
- Confirme que a URL retornada pela API é acessível no browser

## 📚 Recursos

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

## ✅ Checklist Final

- [ ] Projeto Supabase criado
- [ ] Bucket `uploads` criado
- [ ] Tabela `hero_content` criada
- [ ] `.env.local` preenchido
- [ ] Testes locais passando
- [ ] Repositório commitado e pushado para GitHub
- [ ] Projeto Vercel criado e conectado
- [ ] Variáveis de ambiente adicionadas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Testes em produção passando
