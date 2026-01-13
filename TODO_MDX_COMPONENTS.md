# 📝 Lembrete: Componentes para MDX

## O que fazer:
Criar/melhorar componentes customizados para renderização de MDX nos artigos.

## Localização atual:
- **Componentes MDX**: [components/article/MDXComponents.tsx](components/article/MDXComponents.tsx)
- **Preview renderiza MDX**: [components/admin/ArticlePreview.tsx](components/admin/ArticlePreview.tsx)
- **Artigos usam MDX**: [app/artigos/[slug]/page.tsx](app/artigos/%5Bslug%5D/page.tsx)

## Componentes que podem ser criados:
- [ ] **ProductCard** - Card de produto com imagem, preço, botão
- [ ] **InfoBox** - Caixa de destaque (info, warning, success, error)
- [ ] **VideoEmbed** - Embed de YouTube/Vimeo
- [ ] **ImageGallery** - Galeria de imagens
- [ ] **Tabs** - Abas com conteúdo
- [ ] **Accordion** - Acordeão para FAQ
- [ ] **CodeBlock** - Bloco de código com syntax highlighting
- [ ] **Table** - Tabela customizada
- [ ] **Quote** - Citação estilizada
- [ ] **Button/CTA** - Botões customizados

## Exemplo de uso no MDX:
```mdx
# Título do Artigo

Texto normal...

<ProductCard 
  name="iPhone 15 Pro"
  price="R$ 7.299"
  image="/images/iphone15.jpg"
  link="/produtos/iphone-15-pro"
/>

<InfoBox type="warning">
  Este produto está em falta!
</InfoBox>
```

## Referências:
- next-mdx-remote: https://github.com/hashicorp/next-mdx-remote
- MDX docs: https://mdxjs.com/
