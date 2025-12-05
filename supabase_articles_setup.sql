-- Create articles table for storing MDX content
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
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
  
  -- Unique constraint on slug + category
  CONSTRAINT unique_slug_category UNIQUE (slug, category)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.articles(published_date DESC);

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
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
