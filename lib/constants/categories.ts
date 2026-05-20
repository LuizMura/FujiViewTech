export const FIXED_CATEGORIES = [
  { slug: "reviews", label: "Reviews" },
  { slug: "produtos", label: "Produtos" },
  { slug: "noticias", label: "Noticias" },
  { slug: "novidades", label: "Novidades" },
] as const;

export type FixedCategorySlug = (typeof FIXED_CATEGORIES)[number]["slug"];

export const FIXED_CATEGORY_SLUGS = FIXED_CATEGORIES.map((c) => c.slug);

export function normalizeCategorySlug(value: string): string {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isFixedCategory(value: string): value is FixedCategorySlug {
  return FIXED_CATEGORY_SLUGS.includes(
    normalizeCategorySlug(value) as FixedCategorySlug,
  );
}

export function getCategoryLabelBySlug(slug: string): string {
  const normalized = normalizeCategorySlug(slug);
  const found = FIXED_CATEGORIES.find((c) => c.slug === normalized);
  return found?.label || slug;
}
