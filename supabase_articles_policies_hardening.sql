-- =====================================================
-- Hardening de policies da tabela public.articles
-- Cenário: site público com escrita apenas via API server (service_role)
-- =====================================================

BEGIN;

-- 1) Garantir RLS ativo
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 2) Remover TODAS as policies atuais (evita conflitos/OR entre regras antigas)
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'articles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.articles;', p.policyname);
  END LOOP;
END $$;

-- 3) Política mínima e segura: leitura pública apenas de artigos publicados
CREATE POLICY "public_can_read_published_articles"
ON public.articles
FOR SELECT
TO public
USING (status = 'published');

COMMIT;

-- =====================================================
-- Verificação rápida (rode depois)
-- =====================================================
-- SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'articles'
-- ORDER BY policyname;

-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public' AND tablename = 'articles';
