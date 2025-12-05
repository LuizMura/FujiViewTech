# 🚀 Migração para Supabase - Guia Completo

## O que mudou?

Todos os artigos MDX agora são armazenados no **Supabase** em vez do sistema de arquivos. Isso permite:

✅ **Edição em produção** - Crie e edite artigos diretamente na Vercel
✅ **Backup automático** - Seus dados estão seguros no banco de dados
✅ **Performance** - Cache e revalidação automática (ISR)
✅ **Busca avançada** - Filtros e ordenação eficientes
✅ **Escalabilidade** - Suporta milhares de artigos

## Passo a Passo da Migração

### 1. Criar a Tabela no Supabase

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Abra o arquivo `supabase_articles_setup.sql`
4. Copie todo o conteúdo
5. Cole no SQL Editor
6. Clique em **Run** (ou pressione Ctrl+Enter)

Isso criará:
- ✅ Tabela `articles`
- ✅ Índices para performance
- ✅ Políticas de segurança (RLS)
- ✅ Trigger para `updated_at`

### 2. Migrar Artigos Existentes

Com o servidor rodando (`npm run dev`), acesse:

```
http://localhost:3000/api/migrate
```

Você verá uma resposta JSON como:

```json
{
  "success": true,
  "message": "Migration completed",
  "results": [
    "✅ Migrated reviews/celulares-mais-vendidos-brasil-2025",
    "✅ Migrated reviews/galaxy-s25-ultra-review",
    "✅ Migrated noticias/apple-macbook-pro-m4",
    "✅ Migrated tutoriais/como-fazer-backup-smartphone"
  ]
}
```

### 3. Verificar a Migração

1. Acesse o Supabase
2. Vá em **Table Editor** → **articles**
3. Verifique se todos os artigos foram importados

### 4. Testar o Sistema

1. Abra o dashboard (ícone 📄 no header)
2. Verifique se os artigos aparecem
3. Tente editar um artigo
4. Crie um novo artigo de teste
5. Acesse as páginas `/reviews`, `/noticias`, `/tutoriais`

## Estrutura da Tabela `articles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único (gerado automaticamente) |
| `slug` | TEXT | URL amigável (ex: "iphone-15-review") |
| `category` | TEXT | Categoria: "reviews", "noticias", "tutoriais" |
| `title` | TEXT | Título do artigo |
| `description` | TEXT | Descrição breve |
| `content` | TEXT | Conteúdo Markdown completo |
| `image` | TEXT | URL da imagem de capa |
| `author` | TEXT | Autor (padrão: "FujiViewTech") |
| `read_time` | TEXT | Tempo de leitura (ex: "10 min") |
| `published_date` | DATE | Data de publicação |
| `status` | TEXT | Status: "published", "draft", "archived" |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data da última atualização |

## Como Funciona Agora

### Criar Artigo
1. Dashboard → Categoria → "Criar Novo Artigo"
2. Preencher campos
3. Salvar → **Vai direto para o Supabase**

### Editar Artigo
1. Dashboard → Clicar em ✏️
2. Modificar conteúdo
3. Salvar → **Atualiza no Supabase**

### Visualizar Artigos
- Páginas buscam do Supabase
- **ISR (Incremental Static Regeneration)**: Cache de 60 segundos
- Artigos novos aparecem automaticamente após 1 minuto

## Vantagens da Nova Arquitetura

### 🚀 Performance
- **ISR**: Páginas são geradas estaticamente e revalidadas a cada 60s
- **Cache**: Supabase tem cache integrado
- **CDN**: Vercel serve páginas do edge

### 🔒 Segurança
- **RLS (Row Level Security)**: Políticas de acesso
- **Service Role**: API usa credenciais seguras
- **Validação**: Dados são validados antes de salvar

### 📊 Recursos Futuros Possíveis
- ✅ Rascunhos (status: "draft")
- ✅ Agendamento de publicação
- ✅ Versionamento de artigos
- ✅ Busca full-text
- ✅ Analytics de visualizações
- ✅ Comentários
- ✅ Tags e categorias dinâmicas

## Troubleshooting

### Erro: "Failed to fetch articles"
- Verifique se a tabela `articles` existe no Supabase
- Confirme que as variáveis de ambiente estão corretas
- Verifique as políticas RLS

### Artigos não aparecem
- Execute `/api/migrate` novamente
- Verifique se `status = 'published'`
- Aguarde 60 segundos (revalidação ISR)

### Erro ao salvar
- Verifique `SUPABASE_SERVICE_ROLE_KEY`
- Confirme que a política RLS permite escrita
- Veja o console do navegador para detalhes

## Próximos Passos

1. ✅ Execute a migração
2. ✅ Teste criar/editar artigos
3. ✅ Faça deploy na Vercel
4. ✅ Configure as variáveis de ambiente na Vercel
5. ✅ Teste em produção

## Backup dos Arquivos MDX

Os arquivos MDX originais em `content/` **não serão deletados automaticamente**. Você pode:

- **Manter como backup** (recomendado por enquanto)
- **Deletar após confirmar** que tudo funciona
- **Usar para versionamento** no Git

---

🎉 **Parabéns!** Agora você tem um CMS completo e funcional em produção!
