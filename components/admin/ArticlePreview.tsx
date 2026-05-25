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

const articlePreviewMdxClass = `
  max-w-3xl mt-8 rounded-b-3xl bg-white px-5 py-8 md:px-6
  prose prose-base md:prose-lg
  prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
  prose-p:text-slate-800
  prose-li:marker:text-indigo-500
  prose-img:rounded-xl md:prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-6 md:prose-img:my-10
  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/60
  prose-blockquote:py-3 prose-blockquote:px-4 md:prose-blockquote:px-6
  prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-900 prose-blockquote:font-medium
  [&_a]:font-semibold [&_a]:text-indigo-600 [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:text-indigo-800
  [&_h1]:mt-4 [&_h1]:mb-3 [&_h1]:text-2xl md:[&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:leading-tight
  [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl md:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:scroll-mt-24
  [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg md:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight
  [&_li]:text-slate-800 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 md:[&_ul]:pl-6
  [&_p]:mb-4 md:[&_p]:mb-6 [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-7 md:[&_p]:leading-8 [&_p]:max-w-prose
  [&_strong]:font-semibold [&_strong]:text-slate-900
  [&_table]:my-8 [&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:shadow-sm
  [&_thead]:bg-slate-900 [&_thead]:text-white
  [&_th]:p-4 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold
  [&_td]:border-t [&_td]:p-4 [&_td]:text-sm
  [&_tbody_tr]:transition [&_tbody_tr:hover]:bg-slate-50
`;

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
        const rawContent = String(form.content);
        let contentToSerialize = rawContent;

        try {
          const parsed = matter(rawContent);
          contentToSerialize = parsed.content;
        } catch (matterError) {
          // If frontmatter is malformed, keep preview working with raw MDX.
          console.warn(
            "Frontmatter inválido no preview, usando conteúdo bruto.",
            matterError,
          );
        }

        try {
          const mdx = await serialize(contentToSerialize, {
            mdxOptions: { remarkPlugins: [remarkGfm] },
          });
          setMdxSource(mdx);
          setMdxError(null);
        } catch {
          const normalized = normalizeMdxContainers(contentToSerialize);
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
            <div className={articlePreviewMdxClass}>
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
