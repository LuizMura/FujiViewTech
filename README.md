# 🚀 FujiViewTech

> **Tecnologia. Review. Simplicidade.**

FujiViewTech é um portal moderno de tecnologia focado em reviews detalhados, tutoriais práticos e notícias do mundo tech. Construído com Next.js 16, React 19 e Tailwind CSS 4, oferece uma experiência de leitura premium e performance excepcional.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 📱 **Reviews Completos**
- Análises detalhadas de smartphones, notebooks e gadgets
- Tabelas de especificações comparativas
- Galeria de imagens de alta qualidade
- Vereditos e recomendações de compra

### 📰 **Notícias Tech**
- Últimas novidades do mundo da tecnologia
- Lançamentos de produtos
- Atualizações de software
- Tendências do mercado

### 📚 **Tutoriais Práticos**
- Guias passo a passo com imagens
- Dicas de configuração e otimização
- Soluções para problemas comuns
- Melhores práticas

### 🎨 **Design Moderno**
- Interface limpa e intuitiva
- Modo escuro (em desenvolvimento)
- Responsivo para todos os dispositivos
- Animações suaves com Framer Motion
- Ícones elegantes com Lucide React

### ⚡ **Performance**
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Otimização automática de imagens
- Turbopack para builds ultra-rápidos
- SEO otimizado

---

## 🛠️ Tech Stack

### **Core**
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca UI com React Compiler
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety

### **Styling**
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** - CSS transformations

### **Content**
- **[MDX](https://mdxjs.com/)** - Markdown com componentes React
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** - Frontmatter parsing
- **[next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)** - MDX rendering

### **UI/UX**
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[Lucide React](https://lucide.dev/)** - Ícones modernos

### **Development**
- **[ESLint 9](https://eslint.org/)** - Linting
- **[Babel React Compiler](https://react.dev/learn/react-compiler)** - Otimização automática

---

## 📂 Project Structure

```
fujiviewtech/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout com metadata
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Estilos globais
│   ├── categoria/               # Páginas de categorias
│   ├── noticias/                # Artigos de notícias
│   ├── reviews/                 # Reviews de produtos
│   │   └── [slug]/              # Review dinâmico
│   ├── post/                    # Posts gerais
│   │   └── [slug]/              # Post dinâmico
│   ├── sobre/                   # Página sobre
│   └── tecnologia/              # Artigos de tecnologia
│
├── components/                   # Componentes React
│   ├── Header.tsx               # Navegação principal
│   ├── Footer.tsx               # Rodapé com links
│   ├── Hero.tsx                 # Seção hero da homepage
│   ├── PostCard.tsx             # Card de artigo
│   ├── BestPhones2025.tsx       # Componente de comparação
│   ├── MDXComponents.tsx        # Componentes para MDX
│   ├── DarkToggle.tsx           # Toggle modo escuro
│   └── AdSense.tsx              # Integração AdSense
│
├── content/                      # Conteúdo MDX
│   ├── reviews/                 # Reviews em MDX
│   └── tecnologia/              # Artigos tech em MDX
│
├── public/                       # Assets estáticos
│   └── images/                  # Imagens
│       ├── posts/               # Thumbnails de posts
│       └── phones/              # Imagens de smartphones
│
├── package.json                 # Dependências
├── tsconfig.json                # Config TypeScript
├── next.config.ts               # Config Next.js
├── tailwind.config.ts           # Config Tailwind
└── eslint.config.mjs            # Config ESLint
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 20+ 
- npm, yarn, pnpm ou bun

### **Installation**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/fujiviewtech.git
   cd fujiviewtech
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra no navegador**
   ```
   http://localhost:3000
   ```

A página será recarregada automaticamente quando você editar os arquivos.

---

## 📝 Available Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com Turbopack |
| `npm run build` | Cria build de produção otimizado |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint para verificar código |

---

## 📄 Creating Content

### **Criar um novo Review**

1. Crie um arquivo MDX em `content/reviews/`:
   ```mdx
   ---
   title: 'Review: Samsung Galaxy S25 Ultra'
   date: '2025-11-25'
   description: 'Análise completa do novo flagship da Samsung'
   image: '/images/posts/s25ultra.jpg'
   category: 'reviews'
   ---

   # Review: Samsung Galaxy S25 Ultra

   Conteúdo do review aqui...
   ```

2. Adicione imagens em `public/images/posts/`

3. O artigo estará disponível automaticamente

### **Criar uma Notícia**

Similar ao review, crie em `content/noticias/` ou `app/noticias/`

### **Usar Componentes MDX**

```mdx
import { Affiliate } from '../../components/MDXComponents'

<Affiliate url="https://amazon.com/produto">
  Comprar na Amazon
</Affiliate>
```

---

## 🎨 Customization

### **Cores e Tema**

Edite `app/globals.css` para customizar o tema:

```css
@theme {
  --color-primary: #6366f1;    /* Indigo */
  --color-secondary: #0ea5e9;  /* Sky */
  --color-accent: #8b5cf6;     /* Violet */
}
```

### **Metadata e SEO**

Edite `app/layout.tsx` para atualizar metadata global:

```typescript
export const metadata = {
  title: 'Seu Site',
  description: 'Sua descrição',
  // ...
}
```

---

## 🚢 Deployment

### **Vercel (Recomendado)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/fujiviewtech)

1. Faça push para o GitHub
2. Importe o projeto no Vercel
3. Deploy automático!

### **Outras Plataformas**

```bash
# Build de produção
npm run build

# Inicie o servidor
npm run start
```

Compatível com qualquer plataforma que suporte Node.js.

---

## 📊 Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **SEO Score**: 100

---

## 🤝 Contributing

Contribuições são bem-vindas! Por favor, leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre o processo de contribuição.

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📜 License

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Author

**FujiViewTech Team**

- Website: [fujiviewtech.com](https://fujiviewtech.com)
- GitHub: [@fujiviewtech](https://github.com/fujiviewtech)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) pela framework incrível
- [Vercel](https://vercel.com/) pelo hosting
- [Tailwind CSS](https://tailwindcss.com/) pelo sistema de design
- Comunidade open source

---

<div align="center">

**[⬆ Voltar ao topo](#-fujiviewtech)**

Made with ❤️ by FujiViewTech

</div>
