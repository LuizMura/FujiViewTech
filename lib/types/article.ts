// =====================================================
// Tipos TypeScript - Artigos
// =====================================================

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  // Identificação
  id: string;
  slug: string;
  // Conteúdo
  title: string;
  description: string | null;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  category: string;

  // Metadados
  authorId: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Estilos do Card
  titleColor: string;
  titleFontSize: number;
  excerptColor: string;
  excerptFontSize: number;
  bgColor: string;
  bgOpacity: number;

  // Botão Customizável
  showButton: boolean;
  buttonText: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonFontSize: number;
  buttonBorderRadius: number;

  // Métricas
  views: number;
  clicks: number;

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;

  // Extra
  subComponent: string | null;
  readTime: string;
}
//
export interface ArticleDB {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  category: string;
  author?: string;
  read_time?: string;
  published_date?: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  author_id?: string | null;
  title_color?: string;
  title_font_size?: number;
  excerpt_color?: string;
  excerpt_font_size?: number;
  bg_color?: string;
  bg_opacity?: number;
  show_button?: boolean;
  button_text?: string;
  button_bg_color?: string;
  button_text_color?: string;
  button_font_size?: number;
  button_border_radius?: number;
  views?: number;
  clicks?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
}

// Dados para criar novo artigo
export interface CreateArticleInput {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category: string;
  status?: ArticleStatus;

  // Estilos (com defaults)
  titleColor?: string;
  titleFontSize?: number;
  excerptColor?: string;
  excerptFontSize?: number;
  bgColor?: string;
  bgOpacity?: number;

  // Botão
  showButton?: boolean;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonFontSize?: number;
  buttonBorderRadius?: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;

  // Extra
  subComponent?: string;
  readTime?: string;
}

// Dados para atualizar artigo
export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  id: string;
}

// Converter ArticleDB -> Article (snake_case -> camelCase)
export function articleFromDB(db: ArticleDB): Article {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    description: db.description || db.excerpt || null,
    excerpt: db.excerpt,
    content: db.content,
    image: db.image,
    category: db.category,
    authorId: db.author_id || db.author || null,
    status: db.status as ArticleStatus,
    publishedAt: db.published_date || null,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    titleColor: db.title_color || "#ffffff",
    titleFontSize: db.title_font_size || 20,
    excerptColor: db.excerpt_color || "#999999",
    excerptFontSize: db.excerpt_font_size || 14,
    bgColor: db.bg_color || "#000000",
    bgOpacity: db.bg_opacity ?? 0.5,
    showButton: db.show_button ?? false,
    buttonText: db.button_text || "Leia Mais",
    buttonBgColor: db.button_bg_color || "#3b82f6",
    buttonTextColor: db.button_text_color || "#ffffff",
    buttonFontSize: db.button_font_size || 14,
    buttonBorderRadius: db.button_border_radius || 4,
    views: db.views || 0,
    clicks: db.clicks || 0,
    metaTitle: db.meta_title || null,
    metaDescription: db.meta_description || null,
    ogImage: db.og_image || null,
    subComponent: null,
    readTime: db.read_time || "5 min",
  };
}

// Converter Article -> ArticleDB (camelCase -> snake_case)
export function articleToDB(
  article: CreateArticleInput | UpdateArticleInput,
): Partial<ArticleDB> {
  const articleWithDate = article as CreateArticleInput & {
    published_date?: string | null;
    publishedAt?: string | null;
  };
  const publishedDate =
    articleWithDate.published_date || articleWithDate.publishedAt || null;

  return {
    ...("id" in article && { id: article.id }),
    slug: article.slug!,
    title: article.title!,
    excerpt: article.excerpt || null,
    content: article.content || null,
    image: article.image || null,
    category: article.category!,
    status: article.status || "published",
    read_time: article.readTime || "5 min",
    published_date: publishedDate,
  } as Partial<ArticleDB>;
}

// Estatísticas do dashboard
export interface DashboardStats {
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
  totalViews: number;
  totalClicks: number;
  categoriesCount: number;
}

// Filtros para listagem
export interface ArticleFilters {
  status?: ArticleStatus;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
