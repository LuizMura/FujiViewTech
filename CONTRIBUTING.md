# Contributing to FujiViewTech

Obrigado por considerar contribuir para o FujiViewTech! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

Este projeto adere a um código de conduta. Ao participar, você deve manter um ambiente respeitoso e acolhedor para todos.

### Nossas Promessas

- Usar linguagem acolhedora e inclusiva
- Respeitar pontos de vista e experiências diferentes
- Aceitar críticas construtivas graciosamente
- Focar no que é melhor para a comunidade

---

## 🤝 How Can I Contribute?

### **Reportar Bugs**

Bugs são rastreados como GitHub issues. Ao criar um issue, inclua:

- **Título claro e descritivo**
- **Passos para reproduzir** o problema
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** se aplicável
- **Ambiente** (OS, browser, versão do Node.js)

**Exemplo:**
```markdown
**Descrição:** O botão de modo escuro não funciona no Safari

**Passos para reproduzir:**
1. Abra o site no Safari
2. Clique no botão de modo escuro
3. Nada acontece

**Esperado:** O tema deve mudar para escuro
**Atual:** Nenhuma mudança ocorre

**Ambiente:** macOS 14, Safari 17
```

### **Sugerir Melhorias**

Sugestões de features são bem-vindas! Inclua:

- **Descrição clara** da feature
- **Por que** seria útil
- **Como** deveria funcionar
- **Exemplos** de uso

### **Contribuir com Código**

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie uma branch** para sua feature
4. **Faça suas mudanças**
5. **Teste** suas mudanças
6. **Commit** seguindo as guidelines
7. **Push** para seu fork
8. **Abra um Pull Request**

### **Contribuir com Conteúdo**

Você pode adicionar:

- **Reviews** de produtos
- **Tutoriais** técnicos
- **Notícias** de tecnologia
- **Traduções**

---

## 🛠️ Development Setup

### **Prerequisites**

- Node.js 20+
- npm, yarn, pnpm ou bun
- Git

### **Setup Local**

```bash
# Clone seu fork
git clone https://github.com/SEU-USUARIO/fujiviewtech.git
cd fujiviewtech

# Adicione o repositório original como upstream
git remote add upstream https://github.com/fujiviewtech/fujiviewtech.git

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Estrutura de Branches**

- `main` - Branch de produção (protegida)
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas features
- `fix/*` - Bug fixes
- `docs/*` - Documentação

---

## 💻 Coding Standards

### **TypeScript**

- Use **TypeScript** para todo código novo
- Defina **tipos explícitos** sempre que possível
- Evite `any` - use tipos específicos ou `unknown`

```typescript
// ❌ Evite
function processData(data: any) { }

// ✅ Prefira
interface UserData {
  name: string;
  email: string;
}
function processData(data: UserData) { }
```

### **React Components**

- Use **function components** com hooks
- Prefira **named exports** para componentes
- Mantenha componentes **pequenos e focados**
- Use **TypeScript** para props

```typescript
// ✅ Bom exemplo
interface PostCardProps {
  title: string;
  description: string;
  image: string;
}

export default function PostCard({ title, description, image }: PostCardProps) {
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### **Styling**

- Use **Tailwind CSS** para estilos
- Evite CSS inline ou styled-components
- Mantenha classes organizadas e legíveis
- Use classes customizadas em `globals.css` quando necessário

```tsx
// ✅ Bom
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ❌ Evite
<div style={{ display: 'flex', padding: '16px' }}>
```

### **File Naming**

- **Components**: `PascalCase.tsx` (ex: `PostCard.tsx`)
- **Pages**: `kebab-case` ou `[slug]` (ex: `sobre/page.tsx`)
- **Utilities**: `camelCase.ts` (ex: `formatDate.ts`)
- **Content**: `kebab-case.mdx` (ex: `galaxy-s25-review.mdx`)

### **Code Organization**

```typescript
// 1. Imports externos
import React from 'react';
import Link from 'next/link';

// 2. Imports internos
import PostCard from '@/components/PostCard';
import { formatDate } from '@/utils/formatDate';

// 3. Types/Interfaces
interface Props {
  // ...
}

// 4. Component
export default function MyComponent({ }: Props) {
  // ...
}
```

---

## 📝 Commit Guidelines

Seguimos o padrão **Conventional Commits**.

### **Formato**

```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Types**

- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

### **Exemplos**

```bash
feat(reviews): add Galaxy S25 Ultra review

Add comprehensive review with specs, images, and verdict.

Closes #123

---

fix(header): correct mobile menu alignment

The mobile menu was misaligned on screens < 768px.

---

docs(readme): update installation instructions

Add pnpm and bun as alternative package managers.
```

### **Regras**

- Use **presente** ("add" não "added")
- Primeira linha com **máximo 72 caracteres**
- Corpo opcional para explicar **o que** e **por quê**
- Referencie issues quando aplicável

---

## 🔄 Pull Request Process

### **Antes de Submeter**

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (`npm run lint`)
- [ ] Build funciona (`npm run build`)
- [ ] Commits seguem as guidelines
- [ ] Branch está atualizada com `main`

### **Criando o PR**

1. **Título descritivo** seguindo Conventional Commits
2. **Descrição completa** do que foi feito
3. **Screenshots** se houver mudanças visuais
4. **Issues relacionadas** (ex: "Closes #123")

**Template:**

```markdown
## Descrição
Breve descrição das mudanças.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2

## Screenshots
(se aplicável)

## Checklist
- [ ] Código segue os padrões
- [ ] Testes passam
- [ ] Build funciona
- [ ] Documentação atualizada
```

### **Review Process**

- Pelo menos **1 aprovação** necessária
- **CI/CD** deve passar
- **Conflitos** devem ser resolvidos
- Mantenedores podem solicitar mudanças

### **Após Aprovação**

- Será feito **squash and merge**
- Branch será deletada automaticamente
- Deploy automático para produção (se aplicável)

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Questions?

Se tiver dúvidas, sinta-se à vontade para:

- Abrir uma **Discussion** no GitHub
- Entrar em contato via **email**: contato@fujiviewtech.com
- Perguntar no **PR** ou **Issue**

---

**Obrigado por contribuir! 🙌**
