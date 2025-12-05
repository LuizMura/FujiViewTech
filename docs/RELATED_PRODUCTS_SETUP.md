# SQL para Criar Tabela Related Products no Supabase

Execute este SQL no Editor SQL do Supabase:

```sql
-- Criar tabela related_products
CREATE TABLE related_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  affiliate_link_1 TEXT,
  affiliate_text_1 TEXT DEFAULT 'Comprar',
  affiliate_link_2 TEXT,
  affiliate_text_2 TEXT DEFAULT 'Ver Mais',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índice para consultas rápidas por article_id
CREATE INDEX idx_related_products_article_id ON related_products(article_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE related_products ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read access" ON related_products
  FOR SELECT USING (true);

-- Política para permitir inserção autenticada
CREATE POLICY "Allow authenticated insert" ON related_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização autenticada
CREATE POLICY "Allow authenticated update" ON related_products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir exclusão autenticada
CREATE POLICY "Allow authenticated delete" ON related_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_related_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_related_products_timestamp
  BEFORE UPDATE ON related_products
  FOR EACH ROW
  EXECUTE FUNCTION update_related_products_updated_at();
```

## Como Usar

### 1. Execute o SQL no Supabase

1. Vá para o painel do Supabase
2. Clique em **SQL Editor**
3. Copie e cole o SQL acima
4. Clique em **Run**

### 2. Acesse o Admin Dashboard

1. Vá para `/admin`
2. Clique na aba **🛍️ Related Products**
3. Selecione um artigo
4. Clique em **Adicionar Produto**
5. Preencha os dados do produto relacionado
6. Salve

### 3. Visualize no Site

Os produtos relacionados aparecerão automaticamente no final de cada artigo que tiver produtos cadastrados!

## Campos da Tabela

| Campo              | Tipo      | Obrigatório | Descrição                                      |
| ------------------ | --------- | ----------- | ---------------------------------------------- |
| `id`               | UUID      | Sim (auto)  | ID único do produto                            |
| `article_id`       | TEXT      | Sim         | Slug do artigo (ex: "galaxy-s25-ultra-review") |
| `title`            | TEXT      | Sim         | Título do produto (ex: "Samsung Galaxy S25")   |
| `subtitle`         | TEXT      | Sim         | Subtítulo (ex: "A opção acessível")            |
| `description`      | TEXT      | Sim         | Descrição breve do produto                     |
| `image`            | TEXT      | Sim         | URL da imagem do produto                       |
| `affiliate_link_1` | TEXT      | Não         | Link de afiliado 1                             |
| `affiliate_text_1` | TEXT      | Não         | Texto do botão 1 (padrão: "Comprar")           |
| `affiliate_link_2` | TEXT      | Não         | Link de afiliado 2                             |
| `affiliate_text_2` | TEXT      | Não         | Texto do botão 2 (padrão: "Ver Mais")          |
| `order`            | INTEGER   | Não         | Ordem de exibição (padrão: 0)                  |
| `created_at`       | TIMESTAMP | Sim (auto)  | Data de criação                                |
| `updated_at`       | TIMESTAMP | Sim (auto)  | Data de atualização                            |

## Exemplo de Dados

```json
{
  "article_id": "galaxy-s25-ultra-review",
  "title": "Samsung Galaxy S25",
  "subtitle": "A opção acessível",
  "description": "Galaxy S25 com Snapdragon 8 Elite em tamanho compacto. Câmera de 50MP e bateria de 4000mAh.",
  "image": "/images/posts/s25.jpg",
  "affiliate_link_1": "https://amazon.com.br/Samsung-Galaxy-S25/s",
  "affiliate_text_1": "Comprar",
  "affiliate_link_2": "https://samsung.com.br/celulares/galaxy-s25",
  "affiliate_text_2": "Ver Mais",
  "order": 0
}
```

## Recursos Implementados

✅ **Dashboard Completo** - Interface visual para gerenciar produtos
✅ **CRUD Completo** - Criar, ler, atualizar e deletar produtos
✅ **Upload de Imagens** - Suporte para upload via Supabase Storage
✅ **Renderização Automática** - Produtos aparecem automaticamente nos artigos
✅ **Ordem Customizável** - Controle a ordem de exibição dos cards
✅ **Múltiplos Links** - Até 2 links de afiliados por produto
✅ **Responsivo** - Cards se adaptam ao tamanho da tela
✅ **Integração Completa** - Funciona em Reviews, Notícias e Tutoriais
