"use client";
import { createClient } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/hooks/useArticles";
import React from "react";

interface CardBase {
  title: string;
  image?: string;
  category?: string;
  [key: string]: any;
}

interface ArticleFormProps<T extends CardBase> {
  form: T;
  cardType: string;
  onFormChange: (field: string, value: any) => void;
  onImageUpload: (url: string) => void;
  onMdxImageUpload: (url: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const fields = [
  { name: "title", label: "Título", type: "text" },
  { name: "slug", label: "Slug (URL)", type: "text" },
  { name: "excerpt", label: "Resumo", type: "textarea" },
  { name: "image", label: "Imagem (URL)", type: "text" },
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

const extraFields: Record<string, any[]> = {
  ArtigoCard: [],
  NoticiasCard: [
    { name: "source", label: "Fonte", type: "text" },
    { name: "publishedAt", label: "Data de Publicação", type: "date" },
  ],
  EconomiaCard: [
    { name: "price", label: "Preço", type: "number" },
    { name: "variation", label: "Variação (%)", type: "number" },
  ],
  CategoriaCard: [
    { name: "description", label: "Descrição", type: "textarea" },
  ],
};

export default function ArticleForm<T extends CardBase>({
  form,
  cardType,
  onFormChange,
  onImageUpload,
  onMdxImageUpload,
  onContentChange,
  onSubmit,
}: ArticleFormProps<T>) {
  // Remove campos duplicados pelo name
  const allFieldsMap = new Map();
  [...fields, ...(extraFields[cardType] || [])].forEach((field) => {
    if (!allFieldsMap.has(field.name)) {
      allFieldsMap.set(field.name, field);
    }
  });
  const allFields = Array.from(allFieldsMap.values());

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isMdx: boolean
  ) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const supabase = createClient();
    const file = files[0];
    const filePath = isMdx ? `mdx/${file.name}` : file.name;

    const { data, error } = await supabase.storage
      .from("artigos")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert(`Erro ao fazer upload da imagem: ${error.message}`);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("artigos")
      .getPublicUrl(filePath);

    if (isMdx) {
      onMdxImageUpload(publicUrlData?.publicUrl || "");
    } else {
      onImageUpload(publicUrlData?.publicUrl || "");
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const typedValue = type === "number" ? Number(value) : value;
    onFormChange(name, typedValue);

    // Auto-gerar slug quando título mudar (apenas se slug estiver vazio)
    if (name === "title" && !form.slug) {
      const newSlug = await generateUniqueSlug(value);
      onFormChange("slug", newSlug);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#23272f] p-4 rounded-xl shadow-lg w-full overflow-y-auto"
    >
      {allFields.map((field, index) => {
        // Campos especiais que devem ficar lado a lado
        const isCategoryOrStatus =
          field.name === "category" || field.name === "status";
        const isPublishedAtOrReadTime =
          field.name === "publishedAt" || field.name === "readTime";

        const isSecondOfPair =
          field.name === "status" || field.name === "readTime";

        // Agrupa categoria e status / publishedAt e readTime
        if (isSecondOfPair && index > 0) {
          const prevField = allFields[index - 1];
          const isPrevCategory = prevField.name === "category";
          const isPrevPublishedAt = prevField.name === "publishedAt";

          // Se é status e campo anterior é categoria, ou readTime e anterior é publishedAt
          if (
            (field.name === "status" && isPrevCategory) ||
            (field.name === "readTime" && isPrevPublishedAt)
          ) {
            return null; // já foram renderizados junto com seus pares
          }
        }

        return (
          <div
            key={field.name}
            className={`${
              field.name === "category" || field.name === "publishedAt"
                ? "grid grid-cols-2 gap-2 mb-3"
                : "mb-3"
            }`}
          >
            {/* Campo atual */}
            <div>
              <label className="block text-[#bfc7d5] mb-1" htmlFor={field.name}>
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name] || "published"}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                >
                  {(field.options || []).map((opt: string) => (
                    <option key={opt} value={opt} className="text-black">
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
              )}
            </div>

            {/* Se é categoria, renderiza status ao lado */}
            {field.name === "category" && (
              <div>
                <label className="block text-[#bfc7d5] mb-1" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status || "published"}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                >
                  {["draft", "published", "archived"].map((opt: string) => (
                    <option key={opt} value={opt} className="text-black">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Se é publishedAt, renderiza readTime ao lado */}
            {field.name === "publishedAt" && (
              <div>
                <label className="block text-[#bfc7d5] mb-1" htmlFor="readTime">
                  Tempo de Leitura
                </label>
                <input
                  id="readTime"
                  name="readTime"
                  type="text"
                  value={form.readTime || ""}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Upload imagem principal */}
      <div className="mb-3">
        <label className="block text-[#bfc7d5] mb-1" htmlFor="image-upload">
          Upload Imagem Principal
        </label>
        <input
          id="image-upload"
          name="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, false)}
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
        />
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-2 max-h-40 rounded-lg border border-[#4b6b57]"
          />
        )}
      </div>

      {/* Upload imagem MDX */}
      <div className="mb-3">
        <label className="block text-[#bfc7d5] mb-1" htmlFor="mdx-image-upload">
          Upload Imagem para MDX
        </label>
        <input
          id="mdx-image-upload"
          name="mdx-image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, true)}
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
        />
        {form.mdxImage && (
          <div className="mt-2 flex items-center gap-2">
            <img
              src={form.mdxImage}
              alt="Preview MDX"
              className="max-h-32 rounded border border-[#4b6b57]"
            />
            <button
              type="button"
              className="px-2 py-1 bg-[#eebbc3] text-[#232946] rounded text-xs"
              onClick={() => navigator.clipboard.writeText(form.mdxImage)}
            >
              Copiar URL
            </button>
          </div>
        )}
      </div>

      {/* Editor Markdown */}
      <div className="mb-3">
        <label className="block text-[#bfc7d5] mb-1" htmlFor="content">
          Conteúdo do Artigo (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          value={form.content || ""}
          onChange={(e) => onContentChange(e.target.value)}
          rows={20}
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none font-mono text-sm"
          placeholder="Digite o conteúdo do artigo em Markdown..."
        />
      </div>

      {/* Botões */}
      <button
        type="submit"
        className="w-full mt-4 py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-bold hover:bg-[#596275] transition"
      >
        Salvar
      </button>
      {form.slug && (
        <a
          href={`/artigos/${form.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 py-2 bg-[#eebbc3] text-[#232946] rounded-lg font-bold hover:bg-[#d4a5b3] transition text-center block"
        >
          Ver Artigo
        </a>
      )}
    </form>
  );
}
