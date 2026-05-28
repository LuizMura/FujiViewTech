-- Adiciona colunas dedicadas para links de afiliados (Amazon e Mercado Livre)
-- Execute este script no SQL Editor do Supabase.

ALTER TABLE public.afiliados
ADD COLUMN IF NOT EXISTS afiliado1_url text,
ADD COLUMN IF NOT EXISTS afiliado2_url text;

-- Backfill inicial usando o campo legado afiliado_url.
-- Se for Mercado Livre, preenche afiliado2_url; caso contrário preenche afiliado1_url.
UPDATE public.afiliados
SET
  afiliado1_url = CASE
    WHEN (afiliado_url ILIKE '%mercadolivre%' OR afiliado_url ILIKE '%mercadolibre%') THEN NULL
    ELSE afiliado_url
  END,
  afiliado2_url = CASE
    WHEN (afiliado_url ILIKE '%mercadolivre%' OR afiliado_url ILIKE '%mercadolibre%') THEN afiliado_url
    ELSE NULL
  END
WHERE
  (afiliado1_url IS NULL OR btrim(afiliado1_url) = '')
  AND (afiliado2_url IS NULL OR btrim(afiliado2_url) = '')
  AND afiliado_url IS NOT NULL
  AND btrim(afiliado_url) <> '';

-- Índices opcionais para consultas por presença de links
CREATE INDEX IF NOT EXISTS idx_afiliados_afiliado1_url ON public.afiliados (afiliado1_url);
CREATE INDEX IF NOT EXISTS idx_afiliados_afiliado2_url ON public.afiliados (afiliado2_url);
