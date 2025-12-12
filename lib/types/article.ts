// =====================================================
// TypeScript Types - Articles
// =====================================================

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  // Identificação
  id: string;
  slug: string;
  // Conteúdo
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  category: string;

  // Metadata
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

  // Analytics
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
  excerpt: string | null;
  content: string | null;
  image: string | null;
  category: string;
  author_id: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  title_color: string;
  title_font_size: number;
  excerpt_color: string;
  excerpt_font_size: number;
  bg_color: string;
  bg_opacity: number;
  show_button: boolean;
  button_text: string;
  button_bg_color: string;
  button_text_color: string;
  button_font_size: number;
  button_border_radius: number;
  views: number;
  clicks: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  read_time: string;
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
    excerpt: db.excerpt,
    content: db.content,
    image: db.image,
    category: db.category,
    authorId: db.author_id,
    status: db.status as ArticleStatus,
    publishedAt: db.published_at,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    titleColor: db.title_color,
    titleFontSize: db.title_font_size,
    excerptColor: db.excerpt_color,
    excerptFontSize: db.excerpt_font_size,
    bgColor: db.bg_color,
    bgOpacity: db.bg_opacity,
    showButton: db.show_button,
    buttonText: db.button_text,
    buttonBgColor: db.button_bg_color,
    buttonTextColor: db.button_text_color,
    buttonFontSize: db.button_font_size,
    buttonBorderRadius: db.button_border_radius,
    views: db.views,
    clicks: db.clicks,
    metaTitle: db.meta_title,
    metaDescription: db.meta_description,
    ogImage: db.og_image,
    subComponent: null,
    readTime: db.read_time,
  };
}

// Converter Article -> ArticleDB (camelCase -> snake_case)
export function articleToDB(
  article: CreateArticleInput | UpdateArticleInput
): Partial<ArticleDB> {
  return {
    ...("id" in article && { id: article.id }),
    slug: article.slug!,
    title: article.title!,
    excerpt: article.excerpt || null,
    content: article.content || null,
    image: article.image || null,
    category: article.category!,
    status: article.status || "draft",
    title_color: article.titleColor || "#1e293b",
    title_font_size: article.titleFontSize || 18,
    excerpt_color: article.excerptColor || "#64748b",
    excerpt_font_size: article.excerptFontSize || 14,
    bg_color: article.bgColor || "#ffffff",
    bg_opacity: article.bgOpacity || 100,
    show_button: article.showButton || false,
    button_text: article.buttonText || "Ver mais",
    button_bg_color: article.buttonBgColor || "#3b82f6",
    button_text_color: article.buttonTextColor || "#ffffff",
    button_font_size: article.buttonFontSize || 14,
    button_border_radius: article.buttonBorderRadius || 8,
    meta_title: article.metaTitle || null,
    meta_description: article.metaDescription || null,
    og_image: article.ogImage || null,
    // sub_component removido pois não existe em ArticleDB
    read_time: article.readTime || "5 min",
  };
}

// Dashboard Stats
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
