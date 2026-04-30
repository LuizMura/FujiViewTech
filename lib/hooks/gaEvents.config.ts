// Configuração dos eventos do Google Analytics para o FujiViewTech
// Este arquivo documenta todos os eventos personalizados que são rastreados

export const GA_EVENTS = {
  // Eventos de Artigos
  ARTICLE_CLICK: "article_click",
  ARTICLE_READ_COMPLETE: "article_read_complete",
  SCROLL_DEPTH: "scroll_depth",
  PAGE_TIME: "page_time",

  // Eventos de Compartilhamento
  SHARE_ARTICLE: "share_article",

  // Eventos de Busca
  SEARCH: "search",

  // Eventos de Afiliados
  AFILIADO_CLICK: "afiliado_click",

  // Eventos de Navegação
  CATEGORY_VIEW: "category_view",

  // Eventos de Visualização
  PAGE_VIEW: "page_view",
} as const;

/**
 * Documentação dos eventos rastreados:
 *
 * 1. article_click
 *    - Disparado quando usuário clica em um artigo
 *    - Parâmetros: article_slug, article_category, author
 *    - Localização: PostCard, CategoryCard
 *
 * 2. article_read_complete
 *    - Disparado quando usuário rola 90% do artigo
 *    - Parâmetros: article_slug, read_time
 *    - Localização: useArticleTracking hook
 *
 * 3. scroll_depth
 *    - Disparado em intervalos de 25% de scroll
 *    - Parâmetros: scroll_percent, article_slug
 *    - Localização: useArticleTracking hook
 *
 * 4. page_time
 *    - Disparado ao sair da página com tempo gasto
 *    - Parâmetros: article_slug, time_on_page (em segundos)
 *    - Localização: useArticleTracking hook
 *
 * 5. share_article
 *    - Disparado quando usuário compartilha um artigo
 *    - Parâmetros: article_slug, platform (whatsapp, facebook, linkedin, x, clipboard)
 *    - Localização: ShareFloatingMenu, página de artigos
 *
 * 6. search
 *    - Disparado quando usuário faz uma busca
 *    - Parâmetros: search_term
 *    - Localização: SearchBar component
 *
 * 7. afiliado_click
 *    - Disparado quando usuário clica em um link de afiliado
 *    - Parâmetros: afiliado_id, product_name, afiliado_name
 *    - Localização: AfiliadosCard component
 *
 * 8. category_view
 *    - Disparado quando usuário visualiza uma categoria
 *    - Parâmetros: page_category, category_name
 *    - Localização: CategoryCard component
 *
 * 9. page_view
 *    - Disparado automaticamente pelo GA4 em cada navegação
 *    - Parâmetros padrão do GA4
 *    - Localização: layout.tsx (configuração automática)
 */

export const GA_CONVERSION_EVENTS = [
  "article_read_complete",
  "afiliado_click",
  "share_article",
] as const;

/**
 * Para configurar eventos como conversões no GA4 dashboard:
 * 1. Vá em Admin > Conversões
 * 2. Clique em "Nova Conversão"
 * 3. Selecione os eventos da lista acima
 * 4. Salve as configurações
 */
