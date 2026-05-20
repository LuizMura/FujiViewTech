-- Migration: add tags (array) and brand (text) columns to articles
BEGIN;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_brand ON public.articles(brand);
CREATE INDEX IF NOT EXISTS idx_articles_tags  ON public.articles USING GIN(tags);

COMMIT;
