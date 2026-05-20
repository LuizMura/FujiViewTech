-- Create articles table for storing MDX content
-- Fixed categories: reviews, produtos, noticias, novidades
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT 'geral',
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  image TEXT,
  author TEXT DEFAULT 'FujiViewTech',
  read_time TEXT DEFAULT '5 min',
  published_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'published', -- 'draft', 'published', 'archived'
  
  -- Slug should be unique globally because public route is /artigos/[slug]
  CONSTRAINT unique_slug UNIQUE (slug)
);

-- Create index for faster queries
-- Ensure columns exist even if table already existed with older schema
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'FujiViewTech';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS read_time TEXT DEFAULT '5 min';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS published_date DATE;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT 'geral';

-- Normalize old categories to the new fixed set
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

-- Normalize empty subcategories
UPDATE public.articles
SET subcategory = 'geral'
WHERE subcategory IS NULL OR btrim(subcategory) = '';

-- Enforce fixed categories
ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_category_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_category_check
  CHECK (category IN ('reviews', 'produtos', 'noticias', 'novidades'));

-- Keep old unique constraint compatibility and then enforce global slug uniqueness
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

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_subcategory ON public.articles(subcategory);
CREATE INDEX IF NOT EXISTS idx_articles_category_subcategory ON public.articles(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.articles(published_date DESC);

-- Dynamic subcategories scoped by category
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

ALTER TABLE public.article_subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for article_subcategories" ON public.article_subcategories;
CREATE POLICY "Enable read access for article_subcategories" ON public.article_subcategories
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Enable all operations for authenticated users on article_subcategories" ON public.article_subcategories;
CREATE POLICY "Enable all operations for authenticated users on article_subcategories" ON public.article_subcategories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published articles
CREATE POLICY "Enable read access for published articles" ON public.articles
  FOR SELECT
  USING (status = 'published');

-- Policy: Allow all operations for authenticated users (service role)
CREATE POLICY "Enable all operations for authenticated users" ON public.articles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
