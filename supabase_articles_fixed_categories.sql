-- Migration: force fixed categories + dynamic subcategories table
BEGIN;

CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT 'geral';

UPDATE public.articles
SET category = CASE
  WHEN lower(unaccent(category)) IN ('reviews', 'review') THEN 'reviews'
  WHEN lower(unaccent(category)) IN ('produto', 'produtos') THEN 'produtos'
  WHEN lower(unaccent(category)) IN ('noticia', 'noticias') THEN 'noticias'
  WHEN lower(unaccent(category)) IN ('novidade', 'novidades') THEN 'novidades'
  WHEN lower(unaccent(category)) IN ('tutorial', 'tutoriais', 'dicas') THEN 'novidades'
  WHEN lower(unaccent(category)) IN ('economia', 'saude', 'viagens', 'filmes-e-series') THEN 'noticias'
  ELSE 'novidades'
END;

UPDATE public.articles
SET subcategory = 'geral'
WHERE subcategory IS NULL OR btrim(subcategory) = '';

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_category_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_category_check
  CHECK (category IN ('reviews', 'produtos', 'noticias', 'novidades'));

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS unique_slug_category;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'unique_slug'
      AND conrelid = 'public.articles'::regclass
  ) THEN
    ALTER TABLE public.articles
      ADD CONSTRAINT unique_slug UNIQUE (slug);
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.article_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT article_subcategories_category_check
    CHECK (category IN ('reviews', 'produtos', 'noticias', 'novidades')),
  CONSTRAINT unique_article_subcategory UNIQUE (category, slug)
);

CREATE INDEX IF NOT EXISTS idx_article_subcategories_category
  ON public.article_subcategories(category);

INSERT INTO public.article_subcategories (category, name, slug)
SELECT DISTINCT
  a.category,
  a.subcategory,
  regexp_replace(lower(unaccent(a.subcategory)), '[^a-z0-9]+', '-', 'g')
FROM public.articles a
WHERE btrim(a.subcategory) <> ''
ON CONFLICT (category, slug) DO NOTHING;

COMMIT;
