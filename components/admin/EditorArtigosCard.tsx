"use client";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { components as mdxComponents } from "@/components/article/MDXComponents";
import React, { useState, useEffect } from "react";
class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("Erro ao renderizar MDX no preview:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
          <p className="font-bold">Erro ao renderizar conteúdo MDX:</p>
          <p className="mt-2 text-xs text-red-700">{this.state.errorMessage}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

import matter from "gray-matter";
import ArtigoCard from "@/app/artigos/ArtigoCard";
import type { Article } from "@/lib/types/article";
import { createClient } from "@/lib/supabase/client";

// Gera um objeto Article válido para preview, preenchendo campos obrigatórios com valores mock/default
function getPreviewArticle(form: any): Article {
  return {
    id: form.id || "preview-id",
    slug: form.slug || "preview-slug",
    title: form.title || "Título do Artigo",
    description: form.description || form.excerpt || "Resumo do artigo...",
    excerpt: form.excerpt || "Resumo do artigo...",
    content: form.content || "",
    image: form.image || "",
    category: form.category || "Categoria",
    authorId: form.authorId || "Autor",
    status: form.status || "draft",
    publishedAt: form.publishedAt || new Date().toISOString(),
    createdAt: form.createdAt || new Date().toISOString(),
    updatedAt: form.updatedAt || new Date().toISOString(),
    titleColor: form.titleColor || "#232946",
    titleFontSize: form.titleFontSize || 24,
    excerptColor: form.excerptColor || "#393e5c",
    excerptFontSize: form.excerptFontSize || 16,
    bgColor: form.bgColor || "#fff",
    bgOpacity: form.bgOpacity || 1,
    showButton: form.showButton ?? true,
    buttonText: form.buttonText || "Ver mais",
    buttonBgColor: form.buttonBgColor || "#eebbc3",
    buttonTextColor: form.buttonTextColor || "#232946",
    buttonFontSize: form.buttonFontSize || 16,
    buttonBorderRadius: form.buttonBorderRadius || 8,
    views: form.views || 0,
    clicks: form.clicks || 0,
    metaTitle: form.metaTitle || null,
    metaDescription: form.metaDescription || null,
    ogImage: form.ogImage || null,
    subComponent: form.subComponent || null,
    readTime: form.readTime || "1 min",
  };
}

// Função de type guard para garantir que form é Article
function isArticle(obj: any): obj is Article {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.title === "string" &&
    typeof obj.slug === "string" &&
    "excerpt" in obj &&
    "content" in obj
  );
}

// Tipos genéricos para os cards
interface CardBase {
  title: string;
  image?: string;
  category?: string;
  [key: string]: any;
}

interface EditorProps<T extends CardBase> {
  cardType: string;
  initialData?: T;
  onSave: (data: T) => void;
}

interface EditorArtigosCardProps<T extends CardBase> extends EditorProps<T> {
  previewOnTop?: boolean;
}

export default function EditorArtigosCard<T extends CardBase>({
  cardType,
  initialData,
  onSave,
  previewOnTop = false,
}: EditorArtigosCardProps<T>) {
  const [form, setForm] = useState<T>(
    initialData || ({ status: "published" } as unknown as T)
  );
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [mdxError, setMdxError] = useState<string | null>(null);
  // Serialize MDX when form.content changes
  useEffect(() => {
    async function serializeMdx() {
      if (form.content) {
        try {
          const { content } = matter(form.content);
          const mdx = await serialize(content);
          setMdxSource(mdx);
        } catch (err) {
          console.error("Error serializing MDX:", err);
          setMdxSource(null);
        }
      } else {
        setMdxSource(null);
      }
    }
    serializeMdx();
  }, [form.content]);

  // Atualiza o formulário quando initialData muda (ex: ao selecionar artigo)
  useEffect(() => {
    setForm(initialData || ({ status: "published" } as unknown as T));
  }, [initialData]);

  // Campos comuns
  const fields = [
    { name: "title", label: "Título", type: "text" },
    { name: "slug", label: "Slug (URL)", type: "text" },
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
    { name: "authorId", label: "Autor", type: "text" },
    { name: "excerpt", label: "Resumo", type: "textarea" },
    { name: "showAuthor", label: "Mostrar Autor", type: "checkbox" },
  ];

  // Campos específicos por tipo
  const extraFields: Record<string, any[]> = {
    ArtigoCard: [
      { name: "excerpt", label: "Resumo", type: "textarea" },
      { name: "views", label: "Visualizações", type: "number" },
    ],
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

  // Remove campos duplicados pelo name
  const allFieldsMap = new Map();
  [...fields, ...(extraFields[cardType] || [])].forEach((field) => {
    if (!allFieldsMap.has(field.name)) {
      allFieldsMap.set(field.name, field);
    }
  });
  const allFields = Array.from(allFieldsMap.values());

  async function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (type === "file" && files && files[0]) {
      const supabase = createClient();
      const file = files[0];
      // Usar o nome original do arquivo
      const filePath = file.name;

      // Upload para o bucket 'artigos'
      const { data, error } = await supabase.storage
        .from("artigos")
        .upload(filePath, file, { upsert: true });

      if (error) {
        alert("Erro ao fazer upload da imagem: " + error.message);
        return;
      }

      // Gerar URL pública
      const { data: publicUrlData } = supabase.storage
        .from("artigos")
        .getPublicUrl(filePath);

      setForm((prev) => ({
        ...prev,
        image: publicUrlData?.publicUrl || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  }

  // Handler específico para o conteúdo markdown
  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setForm((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Preview à esquerda */}
      <div className="flex-[2.5]  h-full bg-[#f3f4f6] flex flex-col justify-start items-stretch p-0 m-0">
        {/* Preview ocupa todo o espaço */}
        {cardType === "ArtigoCard" && (
          <div className="p-6">
            <ArtigoCard post={getPreviewArticle(form)} showAuthor={true} />
            {form.content && (
              <div className="max-w-none mt-8 px-2 bg-white rounded-b-3xl py-8 [&_*]:text-black [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:mb-6 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-lg [&_p]:leading-8 [&_p]:mb-6 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-black [&_a]:text-indigo-600 [&_a]:font-semibold">
                {mdxError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
                    <p className="font-bold">Erro ao compilar MDX:</p>
                    <p className="mt-2 text-xs text-red-700">{mdxError}</p>
                  </div>
                )}
                {!mdxError && mdxSource && (
                  <MDXErrorBoundary>
                    <MDXRemote {...mdxSource} components={mdxComponents} />
                  </MDXErrorBoundary>
                )}
                {!mdxError && !mdxSource && (
                  <div className="text-slate-400">
                    Digite conteúdo para preview...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {cardType === "NoticiasCard" && (
          <div className="w-full">
            {form.image && (
              <img
                src={form.image}
                alt="Imagem"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <div className="font-bold text-lg text-[#e3e8f0] mb-1">
              {form.title || "Título da Notícia"}
            </div>
            <div className="text-xs text-[#7f8fa6] mb-2">
              {form.category || "Categoria"}
            </div>
            <div className="text-[#bfc7d5] mb-2">
              {form.source || "Fonte da notícia"}
            </div>
            <div className="text-xs text-[#bfc7d5]">
              Publicado em: {form.publishedAt || "-"}
            </div>
          </div>
        )}
        {cardType === "EconomiaCard" && (
          <div className="w-full">
            {form.image && (
              <img
                src={form.image}
                alt="Imagem"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <div className="font-bold text-lg text-[#e3e8f0] mb-1">
              {form.title || "Título do Card"}
            </div>
            <div className="text-xs text-[#7f8fa6] mb-2">
              {form.category || "Categoria"}
            </div>
            <div className="text-[#bfc7d5] mb-2">
              Preço: R$ {form.price || 0}
            </div>
            <div className="text-xs text-[#bfc7d5]">
              Variação: {form.variation || 0}%
            </div>
          </div>
        )}
        {cardType === "CategoriaCard" && (
          <div className="w-full">
            <div className="font-bold text-lg text-[#e3e8f0] mb-1">
              {form.title || "Nome da Categoria"}
            </div>
            <div className="text-[#bfc7d5] mb-2">
              {form.description || "Descrição da categoria..."}
            </div>
          </div>
        )}
      </div>
      {/* Formulário à direita */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#23272f] p-4 rounded-xl shadow-lg w-full max-w-2xl mx-auto"
      >
        {allFields.map((field) => (
          <div className="mb-3" key={field.name}>
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
            ) : field.name === "image" ? (
              <>
                <input
                  id={field.name}
                  name={field.name}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-2 max-h-40 rounded-lg border border-[#4b6b57]"
                  />
                )}
              </>
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
        ))}
        {/* Upload para pasta mdx do bucket artigos */}
        <div className="mb-3">
          <label
            className="block text-[#bfc7d5] mb-1"
            htmlFor="mdx-image-upload"
          >
            Upload imagem para MDX
          </label>
          <input
            id="mdx-image-upload"
            name="mdx-image-upload"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const supabase = createClient();
              const file = e.target.files?.[0];
              if (!file) return;
              const filePath = `mdx/${file.name}`;
              const { data, error } = await supabase.storage
                .from("artigos")
                .upload(filePath, file, { upsert: true });
              if (error) {
                alert("Erro ao fazer upload da imagem MDX: " + error.message);
                return;
              }
              const { data: publicUrlData } = supabase.storage
                .from("artigos")
                .getPublicUrl(filePath);
              setForm((prev) => ({
                ...prev,
                mdxImage: publicUrlData?.publicUrl || "",
              }));
            }}
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
          />
          {/* Preview da imagem MDX */}
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
        {/* Editor markdown para conteúdo do artigo */}
        <div className="mb-3">
          <label className="block text-[#bfc7d5] mb-1" htmlFor="content">
            Conteúdo do Artigo (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            value={form.content || ""}
            onChange={handleContentChange}
            rows={10}
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none font-mono"
            placeholder={"Digite o conteúdo do artigo em Markdown..."}
          />
        </div>
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
        )}{" "}
      </form>
    </div>
  );
}
