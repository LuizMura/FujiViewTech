-- Migration: add subcategory to articles
BEGIN;

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS subcategory TEXT;

UPDATE public.articles
SET subcategory = 'geral'
WHERE subcategory IS NULL OR btrim(subcategory) = '';

ALTER TABLE public.articles
ALTER COLUMN subcategory SET DEFAULT 'geral';

ALTER TABLE public.articles
ALTER COLUMN subcategory SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_subcategory
ON public.articles(subcategory);

CREATE INDEX IF NOT EXISTS idx_articles_category_subcategory
ON public.articles(category, subcategory);

COMMIT;
