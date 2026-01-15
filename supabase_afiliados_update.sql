-- Adiciona colunas button_text e button_color na tabela afiliados

ALTER TABLE public.afiliados 
ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'COMPRAR';

ALTER TABLE public.afiliados 
ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#3b82f6';

-- Atualiza registros existentes que não têm valor
UPDATE public.afiliados 
SET button_text = 'COMPRAR' 
WHERE button_text IS NULL;

UPDATE public.afiliados 
SET button_color = '#3b82f6' 
WHERE button_color IS NULL;
