"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkGfm from "remark-gfm";
import ArtigoCard from "@/app/artigos/ArtigoCard";
import { components as mdxComponents } from "@/components/article/MDXComponents";
import type { Article } from "@/lib/types/article";

function normalizeMdxContainers(raw: string): string {
  const repaired = raw.replace(
    /<ProductRow\s*\n\s*image="\s*\n\s*>/g,
    '<ProductRow\n  title="Nome do produto"\n  image=""\n>',
  );

  const escapeTag = (line: string) =>
    line.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const rawLines = repaired.replace(/\r\n?/g, "\n").split("\n");
  const guarded: string[] = [];
  let pendingTagLines: string[] | null = null;

  for (const line of rawLines) {
    if (pendingTagLines) {
      pendingTagLines.push(line);
      const isTagClosed = /^\s*.*(?:>|\/>)\s*$/.test(line);
      const enteredMarkdownBeforeClosing =
        /^\s{0,3}(?:#{1,6}\s|[-+*]\s|\d+\.\s|>)/.test(line) && !isTagClosed;

      if (isTagClosed || enteredMarkdownBeforeClosing) {
        const block = pendingTagLines.join("\n");
        const hasUnbalancedDoubleQuotes =
          ((block.match(/"/g) || []).length & 1) === 1;
        const malformed =
          hasUnbalancedDoubleQuotes || enteredMarkdownBeforeClosing;

        if (malformed) {
          guarded.push(...pendingTagLines.map(escapeTag));
        } else {
          guarded.push(...pendingTagLines);
        }

        pendingTagLines = null;
      }

      continue;
    }

    const opensMultilineJsxTag =
      /^\s*<[A-Z][\w.-]*(?:\s.*)?$/.test(line) &&
      !/^\s*.*(?:>|\/>)\s*$/.test(line);

    if (opensMultilineJsxTag) {
      pendingTagLines = [line];
      continue;
    }

    guarded.push(line);
  }

  if (pendingTagLines) {
    guarded.push(...pendingTagLines.map(escapeTag));
  }

  const lines = guarded;
  const output: string[] = [];

  for (const line of lines) {
    const liftedFromContainer = line.replace(
      /^\s*(?:>\s*|(?:[-+*]|\d+\.)\s+)(<\/?[A-Z][\w.-]*(?:\s|>|\/).*)$/,
      "$1",
    );
    const trimmed = liftedFromContainer.trimStart();
    const isJsxComponentLine = /^<\/?[A-Z][\w.-]*(\s|>|\/)/.test(trimmed);

    if (isJsxComponentLine) {
      let idx = output.length - 1;
      while (idx >= 0 && output[idx].trim() === "") idx -= 1;

      if (idx >= 0) {
        const prev = output[idx].trimStart();
        const isBlockQuoteContext = /^>/.test(prev);
        const isListContext = /^(?:\d+\.|[-+*])\s/.test(prev);

        if (isBlockQuoteContext || isListContext) {
          output.push("");
        }
      }
    }

    output.push(liftedFromContainer);
  }

  return output.join("\n");
}

type PreviewForm = Partial<Omit<Article, "status">> & {
  status?: Article["status"] | string;
  source?: string;
  price?: number | string;
  variation?: number | string;
  [key: string]: unknown;
};

class MDXErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage?: string }
> {
  constructor(props: { children: React.ReactNode }) {
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-bold">Erro ao renderizar conteudo MDX:</p>
          <p className="mt-2 text-xs text-red-700">{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function getPreviewArticle(form: PreviewForm): Article {
  const normalizedStatus =
    form.status === "published" ||
    form.status === "draft" ||
    form.status === "archived"
      ? form.status
      : "draft";

  return {
    id: form.id || "preview-id",
    slug: form.slug || "preview-slug",
    title: form.title || "Titulo do Artigo",
    description: form.description || form.excerpt || "Resumo do artigo...",
    excerpt: form.excerpt || "Resumo do artigo...",
    content: form.content || "",
    image: form.image || "",
    category: form.category || "Categoria",
    subcategory: form.subcategory || "geral",
    authorId: (form.authorId as string) || (form.author as string) || "Autor",
    status: normalizedStatus,
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
    tags: Array.isArray(form.tags) ? (form.tags as string[]) : [],
    brand: (form.brand as string) || null,
  };
}

interface ArticlePreviewProps {
  cardType: string;
  form: PreviewForm;
}

export default function ArticlePreview({
  cardType,
  form,
}: ArticlePreviewProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [mdxError, setMdxError] = useState<string | null>(null);

  useEffect(() => {
    async function serializeMdx() {
      if (!form.content) {
        setMdxSource(null);
        setMdxError(null);
        return;
      }

      try {
        const parsed = matter(String(form.content));

        try {
          const mdx = await serialize(parsed.content, {
            mdxOptions: { remarkPlugins: [remarkGfm] },
          });
          setMdxSource(mdx);
          setMdxError(null);
        } catch {
          const normalized = normalizeMdxContainers(parsed.content);
          const mdx = await serialize(normalized, {
            mdxOptions: { remarkPlugins: [remarkGfm] },
          });
          setMdxSource(mdx);
          setMdxError(null);
        }
      } catch (error) {
        console.error("Erro ao serializar MDX no preview:", error);
        setMdxSource(null);
        setMdxError(error instanceof Error ? error.message : String(error));
      }
    }

    void serializeMdx();
  }, [form.content]);

  return (
    <div className="sticky top-0 m-0 flex max-h-screen flex-col items-stretch justify-start overflow-y-auto bg-[#f3f4f6] p-0">
      {cardType === "ArtigoCard" && (
        <div className="p-6">
          <ArtigoCard post={getPreviewArticle(form)} showAuthor={true} />

          {form.content && (
            <div className="max-w-none rounded-b-3xl bg-white px-2 py-8 mt-8 [&_*]:text-black [&_a]:font-semibold [&_a]:text-indigo-600 [&_h1]:mb-6 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:text-black [&_p]:mb-6 [&_p]:text-lg [&_p]:leading-8 [&_strong]:font-bold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-slate-300 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
              {mdxError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
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
                  Digite conteudo para preview...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {cardType === "NoticiasCard" && (
        <div className="w-full p-6">
          {form.image && (
            <Image
              src={String(form.image)}
              alt="Imagem"
              width={800}
              height={160}
              unoptimized
              className="mb-3 h-40 w-full rounded-lg object-cover"
            />
          )}

          <div className="mb-1 text-lg font-bold text-[#232946]">
            {form.title || "Titulo da Noticia"}
          </div>
          <div className="mb-2 text-xs text-[#7f8fa6]">
            {form.category || "Categoria"}
          </div>
          <div className="mb-2 text-[#232946]">
            {form.source || "Fonte da noticia"}
          </div>
          <div className="text-xs text-[#232946]">
            Publicado em: {form.publishedAt || "-"}
          </div>
        </div>
      )}

      {cardType === "CategoriaCard" && (
        <div className="w-full p-6">
          <div className="mb-1 text-lg font-bold text-[#232946]">
            {form.title || "Nome da Categoria"}
          </div>
          <div className="text-[#232946]">
            {form.description || "Descricao da categoria..."}
          </div>
        </div>
      )}
    </div>
  );
}
