"use client";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { components as mdxComponents } from "@/components/article/MDXComponents";
import React, { useState, useEffect } from "react";
import matter from "gray-matter";
import ArtigoCard from "@/app/artigos/ArtigoCard";
import type { Article } from "@/lib/types/article";

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

interface ArticlePreviewProps {
  cardType: string;
  form: any;
}

export default function ArticlePreview({
  cardType,
  form,
}: ArticlePreviewProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [mdxError, setMdxError] = useState<string | null>(null);

  useEffect(() => {
    async function serializeMdx() {
      if (form.content) {
        try {
          const { content } = matter(form.content);
          const mdx = await serialize(content);
          setMdxSource(mdx);
          setMdxError(null);
        } catch (err) {
          console.error("Error serializing MDX:", err);
          setMdxSource(null);
          setMdxError(err instanceof Error ? err.message : String(err));
        }
      } else {
        setMdxSource(null);
        setMdxError(null);
      }
    }
    serializeMdx();
  }, [form.content]);

  return (
    <div className="sticky top-0 max-h-screen overflow-y-auto bg-[#f3f4f6] flex flex-col justify-start items-stretch p-0 m-0">
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
        <div className="w-full p-6">
          {form.image && (
            <img
              src={form.image}
              alt="Imagem"
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
          )}
          <div className="font-bold text-lg text-[#232946] mb-1">
            {form.title || "Título da Notícia"}
          </div>
          <div className="text-xs text-[#7f8fa6] mb-2">
            {form.category || "Categoria"}
          </div>
          <div className="text-[#232946] mb-2">
            {form.source || "Fonte da notícia"}
          </div>
          <div className="text-xs text-[#232946]">
            Publicado em: {form.publishedAt || "-"}
          </div>
        </div>
      )}

      {cardType === "EconomiaCard" && (
        <div className="w-full p-6">
          {form.image && (
            <img
              src={form.image}
              alt="Imagem"
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
          )}
          <div className="font-bold text-lg text-[#232946] mb-1">
            {form.title || "Título do Card"}
          </div>
          <div className="text-xs text-[#7f8fa6] mb-2">
            {form.category || "Categoria"}
          </div>
          <div className="text-[#232946] mb-2">Preço: R$ {form.price || 0}</div>
          <div className="text-xs text-[#232946]">
            Variação: {form.variation || 0}%
          </div>
        </div>
      )}

      {cardType === "CategoriaCard" && (
        <div className="w-full p-6">
          <div className="font-bold text-lg text-[#232946] mb-1">
            {form.title || "Nome da Categoria"}
          </div>
          <div className="text-[#232946] mb-2">
            {form.description || "Descrição da categoria..."}
          </div>
        </div>
      )}
    </div>
  );
}
