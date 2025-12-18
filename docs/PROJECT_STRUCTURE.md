# Project Structure

Documentação detalhada da estrutura do projeto FujiViewTech.

## 📁 Directory Overview

```
fujiviewtech/
├── app/                    # Next.js App Router (rotas e páginas)
├── components/             # Componentes React reutilizáveis
├── content/                # Conteúdo MDX (artigos, reviews)
├── public/                 # Assets estáticos (imagens, ícones)
├── docs/                   # Documentação do projeto
└── [config files]          # Arquivos de configuração
```

---

## 🗂️ Detailed Structure

### `/app` - Application Routes

O diretório `app/` usa o **Next.js App Router** (Next.js 13+).

```
app/
├── layout.tsx              # Layout raiz (Header, Footer, metadata)
├── page.tsx                # Homepage (/)
├── globals.css             # Estilos globais e Tailwind
├── favicon.ico             # Favicon do site
│
├── categoria/              # Rotas de categorias
│   └── [category]/
│       └── page.tsx        # /categoria/reviews, /categoria/noticias
│
├── noticias/               # Seção de notícias
│   ├── page.tsx            # Lista de notícias
│   └── [slug]/
│       └── page.tsx        # Artigo individual
│
├── reviews/                # Seção de reviews
│   ├── page.tsx            # Lista de reviews
│   └── [slug]/
│       └── page.tsx        # Review individual (MDX)
│
├── post/                   # Posts gerais
│   └── [slug]/
│       └── page.tsx        # Post dinâmico
│
├── sobre/                  # Página "Sobre"
│   └── page.tsx
│
├── tecnologia/             # Artigos de tecnologia
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
├── robots.txt/             # SEO - robots.txt
│   └── route.ts
│
└── sitemap.xml/            # SEO - sitemap
    └── route.ts
```

#### **Key Files**

**`layout.tsx`**

- Layout raiz da aplicação
- Define metadata global (SEO, Open Graph, Twitter Cards)
- Inclui Header e Footer
- Configura fontes e estilos globais

**`page.tsx`**

- Homepage do site
- Exibe Hero section
- Lista posts recentes
- Grid de artigos em destaque

**`[slug]/page.tsx`** (Dynamic Routes)

- Rotas dinâmicas para conteúdo
- Usa `generateStaticParams()` para SSG
- Renderiza conteúdo MDX
- Inclui metadata específica da página

---

### `/components` - React Components

Componentes reutilizáveis da aplicação.

```
components/
├── Header.tsx              # Navegação principal
├── Footer.tsx              # Rodapé com links
├── Hero.tsx                # Seção hero da homepage
├── PostCard.tsx            # Card de artigo/post
├── BestPhones2025.tsx      # Componente de comparação de phones
├── MDXComponents.tsx       # Componentes customizados para MDX
├── DarkToggle.tsx          # Toggle de modo escuro
└── AdSense.tsx             # Integração Google AdSense
```

#### **Component Descriptions**

| Component        | Descrição                                  | Props          |
| ---------------- | ------------------------------------------ | -------------- |
| `Header`         | Barra de navegação com logo e menu         | -              |
| `Footer`         | Rodapé com links, redes sociais, copyright | -              |
| `Hero`           | Banner principal da homepage com CTA       | -              |
| `PostCard`       | Card para exibir preview de artigo         | `post: Post`   |
| `BestPhones2025` | Comparação detalhada de smartphones        | -              |
| `MDXComponents`  | Componentes React para usar em MDX         | -              |
| `DarkToggle`     | Botão para alternar tema claro/escuro      | -              |
| `AdSense`        | Wrapper para anúncios Google AdSense       | `slot: string` |

---

### `/content` - MDX Content

Conteúdo em formato MDX (Markdown + JSX).

```
content/
├── reviews/
│   ├── melhor-smartphone-2025.mdx
│   ├── galaxy-s25-ultra-review.mdx
│   └── iphone-17-pro-review.mdx
│
└── tecnologia/
    └── quantum-computing.mdx
```

#### **MDX Frontmatter**

Cada arquivo MDX deve ter frontmatter:

```mdx
---
title: "Título do Artigo"
date: "2025-11-25"
description: "Descrição breve para SEO"
image: "/images/posts/thumbnail.jpg"
category: "reviews"
author: "Nome do Autor"
readTime: "8 min"
---

# Conteúdo aqui...
```

#### **Using Components in MDX**

```mdx
import { Affiliate } from "../../components/MDXComponents";

<Affiliate url="https://amazon.com/produto">Comprar na Amazon</Affiliate>
```

---

### `/public` - Static Assets

Assets estáticos servidos diretamente.

```
public/
├── images/
│   ├── hero.jpg                # Imagem do hero
│   ├── logo.png                # Logo do site
│   ├── og-default.png          # Open Graph image
│   │
│   ├── posts/                  # Thumbnails de posts
│   │   ├── s25ultra.jpg
│   │   ├── visionpro2.jpg
│   │   └── dicas-smartphone.jpg
│   │
│   └── phones/                 # Imagens de produtos
│       ├── galaxy-s25-ultra.png
│       ├── iphone-17-pro-max.png
│       └── pixel-10-pro.png
│
├── favicon.ico
└── robots.txt
```

#### **Image Guidelines**

- **Posts**: 1200x630px (Open Graph ratio)
- **Phones**: 800x800px (square, transparent background)
- **Hero**: 1920x1080px (16:9)
- **Format**: WebP preferido, fallback para JPG/PNG
- **Optimization**: Usar Next.js Image component

---

### `/docs` - Documentation

Documentação adicional do projeto.

```
docs/
├── PROJECT_STRUCTURE.md    # Este arquivo
├── API.md                  # Documentação de APIs (se houver)
└── DEPLOYMENT.md           # Guia de deployment
```

---

## 🔧 Configuration Files

### **`package.json`**

Dependências e scripts do projeto.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

### **`next.config.ts`**

Configuração do Next.js.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações aqui
};

export default nextConfig;
```

### **`tsconfig.json`**

Configuração do TypeScript.

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true
    // ...
  }
}
```

### **`tailwind.config.ts`**

Configuração do Tailwind CSS.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Customizações
    },
  },
};

export default config;
```

### **`eslint.config.mjs`**

Configuração do ESLint.

```javascript
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

---

## 🚀 Routing System

### **File-based Routing**

Next.js usa roteamento baseado em arquivos:

| File Path                     | URL                   | Descrição         |
| ----------------------------- | --------------------- | ----------------- |
| `app/page.tsx`                | `/`                   | Homepage          |
| `app/sobre/page.tsx`          | `/sobre`              | Página sobre      |
| `app/reviews/page.tsx`        | `/reviews`            | Lista de reviews  |
| `app/reviews/[slug]/page.tsx` | `/reviews/galaxy-s25` | Review específico |
| `app/artigos/[slug]/page.tsx` | `/artigos/meu-artigo` | Artigo específico |

### **Dynamic Routes**

Rotas dinâmicas usam `[slug]`:

```typescript
// app/reviews/[slug]/page.tsx
export async function generateStaticParams() {
  // Retorna lista de slugs para gerar páginas estáticas
  return [{ slug: "galaxy-s25-ultra" }, { slug: "iphone-17-pro" }];
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  // Renderiza review baseado no slug
}
```

---

## 📦 Data Flow

### **Content Loading**

1. **MDX Files** → Armazenados em `/content`
2. **gray-matter** → Parse frontmatter
3. **next-mdx-remote** → Renderiza MDX como React
4. **Components** → Exibem conteúdo formatado

### **Image Optimization**

1. **Images** → Armazenadas em `/public/images`
2. **Next.js Image** → Otimização automática
3. **Lazy Loading** → Carregamento sob demanda
4. **WebP** → Conversão automática

---

## 🎨 Styling Architecture

### **Tailwind CSS**

- **Utility-first** approach
- Classes definidas em JSX
- Customizações em `tailwind.config.ts`
- Temas em `globals.css`

### **Global Styles**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@theme {
  /* Customizações */
}
```

---

## 🔍 SEO Structure

### **Metadata**

- **Global**: `app/layout.tsx`
- **Page-specific**: Cada `page.tsx`
- **Dynamic**: Gerado por conteúdo MDX

### **Sitemap & Robots**

- `app/sitemap.xml/route.ts` → Gera sitemap dinâmico
- `app/robots.txt/route.ts` → Configura crawling

---

## 📚 Additional Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Last Updated**: 2025-11-25
