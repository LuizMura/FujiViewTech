-- ⚠️ WARNING: This script will delete the existing hero_content table and recreate it.
-- This is necessary to fix the column name mismatches.

-- 1. Drop the existing table
DROP TABLE IF EXISTS public.hero_content;

-- 2. Create the table with the correct lowercase column names
CREATE TABLE public.hero_content (
  id INT PRIMARY KEY,
  badge TEXT,
  maintitle TEXT,
  gradienttitle TEXT,
  description TEXT,
  buttontext TEXT,
  buttonlink TEXT,
  imageurl TEXT,
  imagealt TEXT,
  topcard JSONB,
  bottomcard JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
-- Allow public read access
CREATE POLICY "Enable read access for all users" ON public.hero_content
  FOR SELECT
  USING (true);

-- Allow authenticated users (service role) to insert/update
CREATE POLICY "Enable insert/update for authenticated users" ON public.hero_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Insert default data
INSERT INTO public.hero_content (
  id, 
  badge, 
  maintitle, 
  gradienttitle, 
  description, 
  buttontext, 
  buttonlink, 
  imageurl, 
  imagealt,
  topcard,
  bottomcard
)
VALUES (
  1, 
  'Destaque da Semana', 
  'Os 10 celulares mais vendidos', 
  'no Brasil em 2025', 
  'Descubra quais smartphones dominam as vendas e nossa análise honesta sobre quais REALMENTE valem a pena comprar.', 
  'Ver Matéria Completa', 
  '/reviews/celulares-mais-vendidos-brasil-2025', 
  '/images/bestselling-phones-brazil.jpg', 
  'Celulares Mais Vendidos Brasil 2025',
  '{"category": "Notícia", "title": "Apple Vision Pro 2 é lançado — o que mudou?", "imageUrl": "/images/posts/visionpro2.jpg", "imageAlt": "Apple Vision Pro 2", "link": "/noticias/apple-vision-pro-2-lancamento", "categoryColor": "sky"}',
  '{"category": "Tutorial", "title": "10 dicas para aumentar a vida útil do seu smartphone", "imageUrl": "/images/posts/dicas-smartphone.jpg", "imageAlt": "Dicas Smartphone", "link": "/tutoriais/como-aumentar-vida-util-do-seu-smartphone", "categoryColor": "emerald"}'
);
