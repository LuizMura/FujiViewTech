import type { FieldConfig } from "@/components/admin/article-form/types";

export const fields: FieldConfig[] = [
  { name: "title", label: "Título", type: "text" },
  { name: "slug", label: "Slug (URL)", type: "text" },
  { name: "excerpt", label: "Resumo", type: "textarea" },
  { name: "image", label: "Imagem (URL)", type: "text" },
  { name: "author", label: "Autor", type: "text" },
  { name: "category", label: "Categoria", type: "text" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["draft", "published", "archived"],
  },
  { name: "publishedAt", label: "Data de Publicação", type: "date" },
  { name: "readTime", label: "Tempo de Leitura", type: "text" },
];

export const extraFields: Record<string, FieldConfig[]> = {
  ArtigoCard: [],
  NoticiasCard: [
    { name: "source", label: "Fonte", type: "text" },
    { name: "publishedAt", label: "Data de Publicação", type: "date" },
  ],
  CategoriaCard: [
    { name: "description", label: "Descrição", type: "textarea" },
  ],
};
