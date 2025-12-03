# 📊 Fluxo de Dados do Dashboard Hero

## Como os dados são salvos e implementados

### 🔄 Fluxo Completo

```
┌──────────────────────────────────────────────────────────┐
│ USUARIO EDITA NO DASHBOARD (HeroDashboard.tsx)           │
│ - Muda título, descrição, imagem, etc.                   │
│ - Clica em "Salvar Mudanças"                             │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ LOCAL STATE ATUALIZADO (React)                            │
│ - setLocalHeroContent, setLocalTopCard, etc.            │
│ - Usuário vê as mudanças imediatamente na interface      │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ CONTEXT API ATUALIZADO (HeroContext.tsx)                │
│ - updateHeroContent(localHeroContent)                   │
│ - updateTopCard(localTopCard)                           │
│ - updateBottomCard(localBottomCard)                     │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ API ROUTE CHAMADA (POST /api/hero)                       │
│ - Envia os dados em JSON                                 │
│ - Valida os dados no servidor                           │
│ - Salva em: public/data/hero.json                       │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ DADOS PERSISTIDOS                                        │
│ - Arquivo salvo no disco                                 │
│ - Dados disponíveis para próximos acessos               │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ PAGINA RECARREGADA (F5 ou novo acesso)                  │
│ - HeroProvider carrega dados via GET /api/hero          │
│ - Se existir hero.json, carrega dados salvos            │
│ - Se não existir, usa valores padrão                    │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ COMPONENTE HERO EXIBE OS DADOS (Hero.tsx)               │
│ - Usa heroContent do Context                            │
│ - Renderiza imagens, textos, cards com dados salvos     │
│ - Mudanças aparecem no site                             │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Arquivos Principais

### 1. **`context/HeroContext.tsx`** - Gerenciador de Estado

```typescript
- Armazena: heroContent, topCard, bottomCard
- Funções: updateHeroContent(), updateTopCard(), updateBottomCard()
- Carrega dados salvos ao inicializar (useEffect)
- Chama API para salvar quando há mudanças
- Fornece: isSaving (boolean), saveError (string | null)
```

**O que faz:**

- ✅ Carrega dados salvos quando o app inicia
- ✅ Atualiza o state quando usuário edita
- ✅ Chama API para persistir mudanças
- ✅ Fornece status de salvamento para UI

### 2. **`components/HeroDashboard.tsx`** - Painel de Edição

```typescript
- Exibe formulários para editar hero content e cards
- Mostra status de salvamento (spinner, confirmação, erro)
- Valida dados localmente antes de salvar
- Integrado com ImageUpload para upload de imagens
```

**O que faz:**

- ✅ Interface para editar conteúdo
- ✅ Feedback visual durante salvamento
- ✅ Suporte a upload de imagens
- ✅ Mostra status "Salvo!", "Salvando...", ou erro

### 3. **`app/api/hero/route.ts`** - Servidor de Dados

```typescript
GET /api/hero
  - Retorna dados salvos em public/data/hero.json
  - Se arquivo não existir, retorna vazio (usa defaults)

POST /api/hero
  - Recebe JSON com heroContent, topCard, bottomCard
  - Valida os dados
  - Salva em public/data/hero.json
  - Retorna { success: true } ou erro
```

**O que faz:**

- ✅ Persistência em arquivo JSON
- ✅ Carregamento ao iniciar
- ✅ Salvamento quando usuário clica em "Salvar"

### 4. **`public/data/hero.json`** - Arquivo de Dados

Exemplo do arquivo gerado:

```json
{
  "heroContent": {
    "badge": "Destaque da Semana",
    "mainTitle": "Os 10 celulares mais vendidos",
    "gradientTitle": "no Brasil em 2025",
    "description": "Descubra...",
    "buttonText": "Ver Matéria Completa",
    "buttonLink": "/reviews/...",
    "imageUrl": "/uploads/image-1733232456789.jpg",
    "imageAlt": "Celulares"
  },
  "topCard": { ... },
  "bottomCard": { ... }
}
```

---

## ⚡ Fluxo de Salvamento Detalhado

### Quando você edita uma imagem:

1. **Upload de Imagem** (ImageUpload.tsx)

   - Usuário clica ou arrasta arquivo
   - Arquivo é enviado para `/api/upload`
   - API retorna URL: `/uploads/image-1733232456789.jpg`

2. **Atualiza Context**

   ```typescript
   onUploadComplete((url) => handleChangeHero("imageUrl", url));
   ```

   - URL é armazenada em `localHeroContent.imageUrl`
   - Imagem aparece no preview

3. **Clica em "Salvar Mudanças"**

   - `handleSave()` é chamado
   - Chama `updateHeroContent(localHeroContent)`
   - Context atualiza state interno

4. **Context chama API (POST)**

   ```typescript
   fetch("/api/hero", {
     method: "POST",
     body: JSON.stringify({ heroContent, topCard, bottomCard }),
   });
   ```

5. **API salva em arquivo**

   - Cria/atualiza `public/data/hero.json`
   - Retorna resposta ao Context

6. **Feedback ao usuário**

   - Se sucesso: mostra "✅ Salvo!" por 2 segundos
   - Se erro: mostra "⚠️ Erro" com mensagem

7. **Próximo acesso**
   - Ao recarregar página, HeroProvider faz GET
   - Carrega `public/data/hero.json`
   - Exibe dados salvos

---

## 🔧 Estados do Salvamento

### Normal

```
┌─────────────────────────────┐
│ Salvar Mudanças (botão)     │
│ (enabled, cursor: pointer)  │
└─────────────────────────────┘
```

### Salvando

```
┌─────────────────────────────┐
│ ⏳ Salvando... (spinner)     │
│ (disabled, opacity: 50%)     │
└─────────────────────────────┘
```

### Salvo com Sucesso

No header: `✅ Salvo!`
(desaparece após 2 segundos)

### Erro ao Salvar

No header: `⚠️ Erro`
(mantém visível até fechar)

---

## 📤 Upload de Imagens

### Fluxo:

1. Usuário arrasta/clica para selecionar imagem
2. `ImageUpload.tsx` valida (tipo, tamanho)
3. POST para `/api/upload`
4. API salva em `public/uploads/image-{timestamp}.{ext}`
5. Retorna URL
6. ImageUpload chama `onUploadComplete(url)`
7. HeroDashboard atualiza `localHeroContent.imageUrl`
8. Preview exibe imagem
9. Usuário clica "Salvar Mudanças"
10. URL é persistida em `hero.json`

---

## 🚀 Como Testar

### Teste 1: Editar e Salvar

1. Abra o dashboard (clique no botão Settings)
2. Mude o título, descrição, etc
3. Clique "Salvar Mudanças"
4. Veja "✅ Salvo!" aparecer
5. **Recarregue a página (F5)**
6. Verifique se os dados foram mantidos ✅

### Teste 2: Upload de Imagem

1. Na aba "Hero Principal", clique em upload
2. Selecione ou arraste uma imagem
3. Veja a imagem fazer upload (spinner)
4. Veja o preview aparecer
5. Clique "Salvar Mudanças"
6. Recarregue - imagem deve estar lá ✅

### Teste 3: Verificar Arquivo

```bash
# No terminal, verifique o arquivo criado:
cat public/data/hero.json
```

---

## 🔒 Segurança Futura

Se quiser adicionar autenticação e banco de dados:

1. **Adicione autenticação** (NextAuth.js)

   - Só admin pode editar
   - Rastreie quem fez mudanças

2. **Use banco de dados** (PostgreSQL, MongoDB)

   ```typescript
   // Em vez de writeFile, usar:
   await db.hero.update({...})
   ```

3. **Adicione versionamento**

   - Guarde histórico de mudanças
   - Permita reverter para versão anterior

4. **Adicione aprovação de conteúdo**
   - Salve em estado "draft"
   - Requer aprovação antes de publicar

---

## 📝 Resumo

| Ação                      | Onde              | Como                    |
| ------------------------- | ----------------- | ----------------------- |
| **Usuário edita**         | HeroDashboard     | Digitação nos inputs    |
| **Estado local atualiza** | React state       | setLocal... functions   |
| **Clica "Salvar"**        | HeroDashboard     | onClick={handleSave}    |
| **Context atualiza**      | HeroContext       | updateHero... functions |
| **API é chamada**         | Context useEffect | fetch POST /api/hero    |
| **Dados persistem**       | Arquivo JSON      | public/data/hero.json   |
| **Próximo acesso**        | HeroProvider      | fetch GET /api/hero     |
| **UI exibe dados**        | Hero component    | useHero() hook          |

---

**Status:** ✅ Sistema completo e funcional!
