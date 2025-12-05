# 📝 Sistema de Gerenciamento de Conteúdo MDX

## Como Usar o Content Dashboard

### Acessando o Dashboard

1. **Clique no ícone de documento** (📄) no header do site
2. O painel lateral abrirá com três abas: **Reviews**, **Notícias** e **Tutoriais**

### Criando um Novo Artigo

1. **Selecione a categoria** (Reviews, Notícias ou Tutoriais)
2. Clique em **"Criar Novo Artigo"**
3. Preencha os campos:
   - **Título**: Nome do artigo
   - **Descrição**: Resumo breve (aparece nos cards)
   - **Data**: Data de publicação
   - **Tempo de Leitura**: Ex: "10 min"
   - **URL da Imagem**: Caminho para a imagem de capa
   - **Conteúdo**: Texto do artigo em Markdown

4. Clique em **"Salvar Artigo"**

### Editando um Artigo Existente

1. Na lista de artigos, clique no ícone de **edição** (✏️)
2. Faça as alterações necessárias
3. Clique em **"Salvar Artigo"**

### Excluindo um Artigo

1. Clique no ícone de **lixeira** (🗑️) ao lado do artigo
2. Confirme a exclusão

### Visualizando um Artigo

1. Clique no ícone de **olho** (👁️) para abrir o artigo em uma nova aba

## Estrutura do Frontmatter

Cada artigo MDX deve ter um frontmatter no início:

```yaml
---
title: "Título do Artigo"
description: "Descrição breve do conteúdo"
date: "2025-12-03"
category: "Review" # ou "Notícia" ou "Tutorial"
image: "/images/artigo.jpg"
author: "FujiViewTech"
readTime: "10 min"
---
```

## Formatação Markdown

### Títulos
```markdown
# Título Principal (H1)
## Subtítulo (H2)
### Seção (H3)
```

### Texto
```markdown
**Negrito**
*Itálico*
[Link](https://exemplo.com)
```

### Listas
```markdown
- Item 1
- Item 2
- Item 3

1. Primeiro
2. Segundo
3. Terceiro
```

### Imagens
```markdown
![Descrição da imagem](/images/foto.jpg)
```

### Código
```markdown
`código inline`

\`\`\`javascript
// Bloco de código
const exemplo = "código";
\`\`\`
```

### Citações
```markdown
> Texto citado
```

## Componentes Especiais MDX

### ProductReview
```jsx
<ProductReview
  name="iPhone 15 Pro"
  price="R$ 8.999"
  rating={4.5}
  pros={["Câmera excelente", "Performance top"]}
  cons={["Preço alto", "Bateria média"]}
  image="/images/iphone.jpg"
/>
```

### ImageCarousel
```jsx
<ImageCarousel
  images={[
    "/images/foto1.jpg",
    "/images/foto2.jpg",
    "/images/foto3.jpg"
  ]}
/>
```

### Affiliate (Link de afiliado)
```jsx
<Affiliate url="https://amzn.to/produto">
  Comprar na Amazon
</Affiliate>
```

## Dicas

✅ **Use imagens otimizadas** - Prefira JPG/WebP para fotos, PNG para gráficos
✅ **Escreva descrições atraentes** - Elas aparecem nos cards de preview
✅ **Adicione tempo de leitura realista** - Ajuda os leitores a se planejarem
✅ **Use títulos descritivos** - Melhor para SEO e clareza
✅ **Revise antes de publicar** - Use o botão de visualização (👁️)

## Estrutura de Pastas

```
content/
├── reviews/          # Análises de produtos
├── noticias/         # Notícias de tecnologia
└── tutoriais/        # Guias e tutoriais
```

## Automação

✨ **Todos os artigos são automaticamente**:
- Listados nas páginas de categoria
- Ordenados por data (mais recentes primeiro)
- Renderizados com o layout correto
- Otimizados para SEO

Não é necessário editar código para adicionar novos artigos!
