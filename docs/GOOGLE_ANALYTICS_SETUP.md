# Google Analytics - Guia de Implementação

## Status: ✅ Completo

O Google Analytics foi implementado completamente no FujiViewTech com rastreamento detalhado de eventos.

## 📊 Configuração Básica

### Google Tag Manager

- **ID do GA4**: `G-RTSWWHK7YW`
- **Localização**: [app/layout.tsx](../app/layout.tsx)
- **Estratégia**: `afterInteractive` (carregamento otimizado)

### Configurações Avançadas Ativadas

- Anonymize IP: Sim
- Allow Google Signals: Sim
- Allow Ad Personalization Signals: Sim
- Conversion Linker: Sim
- Auto Page View: Sim

## 🎯 Eventos Rastreados

### 1. **Engajamento de Artigos**

- `article_click`: Clique em um artigo
  - Parâmetros: `article_slug`, `article_category`, `author`
  - Localização: PostCard, CategoryCard

- `article_read_complete`: Artigo lido completamente (>90% scroll)
  - Parâmetros: `article_slug`, `read_time`
  - Localização: useArticleTracking hook

- `scroll_depth`: Profundidade de scroll em intervalos de 25%
  - Parâmetros: `scroll_percent`, `article_slug`
  - Localização: useArticleTracking hook

- `page_time`: Tempo total na página
  - Parâmetros: `article_slug`, `time_on_page`
  - Localização: useArticleTracking hook

### 2. **Compartilhamento**

- `share_article`: Compartilhamento de artigos
  - Parâmetros: `article_slug`, `platform` (whatsapp, facebook, linkedin, x, clipboard, native_share, copy)
  - Localização: ShareFloatingMenu, Página de Artigos

### 3. **Busca**

- `search`: Buscas realizadas
  - Parâmetros: `search_term`
  - Localização: SearchBar component

### 4. **Afiliados**

- `afiliado_click`: Clique em link de afiliado
  - Parâmetros: `afiliado_id`, `product_name`, `afiliado_name`, `value`
  - Localização: AfiliadosCard component

### 5. **Navegação**

- `category_view`: Visualização de categoria
  - Parâmetros: `page_category`, `category_name`
  - Localização: CategoryCard component

### 6. **Page View (Automático)**

- `page_view`: Disparado automaticamente em cada navegação
  - Parâmetros padrão do GA4

## 🛠️ Arquivos Implementados

### Hooks

1. **useGoogleAnalytics.ts** - Hook principal para rastreamento de eventos
   - `trackEvent()`: Método genérico
   - `trackArticleClick()`: Específico para cliques em artigos
   - `trackArticleReadComplete()`: Leitura completa
   - `trackAfiliadoClick()`: Cliques em afiliados
   - `trackSearch()`: Buscas
   - `trackShare()`: Compartilhamentos
   - `trackCategoryView()`: Visualização de categorias
   - `trackScroll()`: Profundidade de scroll

2. **useArticleTracking.ts** - Hook especializado para páginas de artigos
   - Rastreamento automático de scroll
   - Rastreamento de leitura completa
   - Tempo de permanência

### Tipos

- **gtag.ts** - Tipos globais para TypeScript

### Configuração

- **gaEvents.config.ts** - Documentação centralizada de eventos

### Componentes Atualizados

1. **app/layout.tsx** - Configuração do GA4
2. **app/artigos/[slug]/page.tsx** - Rastreamento de artigos
3. **components/article/ShareFloatingMenu.tsx** - Rastreamento de compartilhamento
4. **components/home/AfiliadosCard.tsx** - Rastreamento de afiliados
5. **components/layout/SearchBar.tsx** - Rastreamento de busca
6. **components/home/CategoryCard.tsx** - Rastreamento de categorias
7. **components/article/PostCard.tsx** - Rastreamento de cliques

## 📈 Métricas Principais para Monitorar

### Engajamento

- Taxa de leitura completa (% de artigos lidos até o fim)
- Profundidade média de scroll
- Tempo médio em página

### Conversão

- Cliques em afiliados
- Compartilhamentos (por plataforma)
- Buscas realizadas

### Retenção

- Usuários que voltam
- Tempo médio em sessão
- Bounce rate

## 🎛️ Próximas Etapas - Configurar no GA4 Dashboard

### 1. Configurar Conversões

Para cada evento importante, marque como conversão:

1. Acesse Admin > Conversões
2. Clique em "Nova Conversão"
3. Selecione:
   - `article_read_complete`
   - `afiliado_click`
   - `share_article`

### 2. Criar Audiências Personalizadas

- Usuários que leem artigos completamente
- Usuários que clicam em afiliados
- Usuários que compartilham

### 3. Configurar Relatórios Personalizados

- Artigos mais lidos
- Plataforma de compartilhamento mais usada
- Afiliados com mais cliques
- Categorias mais populares

### 4. Conectar Google Search Console

- Sincronizar dados de busca orgânica
- Rastrear CTR das páginas no Google

### 5. Configurar Alertas Inteligentes

- Aumentos/quedas anormais de tráfego
- Mudanças em comportamento de usuários

## 🔍 Testando a Implementação

### 1. Verificar no Console do GA4

```bash
# No navegador, abra DevTools > Console
# Execute:
window.gtag('event', 'test_event', {test_param: 'value'});
```

### 2. Usar Assistente de Depuração do GA4

- Instale a extensão: [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
- Navegue pelo site e veja todos os eventos em tempo real

### 3. Verificar aba de Relatórios em Tempo Real

- GA4 Dashboard > Relatórios em tempo real
- Veja eventos conforme são disparados

## 📋 Checklist de Implementação

- [x] Instalar script do GA4 no layout raiz
- [x] Criar hook useGoogleAnalytics
- [x] Implementar rastreamento de artigos (scroll, leitura completa)
- [x] Implementar rastreamento de compartilhamento
- [x] Implementar rastreamento de busca
- [x] Implementar rastreamento de afiliados
- [x] Implementar rastreamento de categorias
- [x] Implementar rastreamento de cliques em artigos
- [x] Criar tipos TypeScript para GA4
- [x] Documentar eventos
- [ ] Configurar conversões no GA4 Dashboard
- [ ] Criar relatórios personalizados
- [ ] Conectar Search Console
- [ ] Configurar alertas

## 🚀 Uso nos Componentes

### Exemplo Básico

```typescript
'use client';
import { useGoogleAnalytics } from '@/lib/hooks/useGoogleAnalytics';

export default function MyComponent() {
  const { trackEvent } = useGoogleAnalytics();

  const handleClick = () => {
    trackEvent('custom_event', {
      param1: 'value1',
      param2: 'value2',
    });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Exemplo com useArticleTracking

```typescript
'use client';
import { useArticleTracking } from '@/lib/hooks/useArticleTracking';

export default function ArticlePage({ slug }: { slug: string }) {
  // Rastreamento automático de scroll, tempo, leitura completa
  useArticleTracking({ articleSlug: slug, readTime: 5 });

  return <article>{/* conteúdo */}</article>;
}
```

## 📞 Suporte

Para adicionar novos eventos:

1. Adicione a função em `useGoogleAnalytics.ts`
2. Documente em `gaEvents.config.ts`
3. Use o hook nos componentes
4. Configure como conversão no GA4 se necessário
