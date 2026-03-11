"use client";
import React, { useEffect, useState } from "react";
import ArtigoCard from "@/app/artigos/ArtigoCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticleBySlug } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";
import { MDXRemote } from "next-mdx-remote";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { components as mdxComponents } from "@/components/article/MDXComponents";
import TopTenList from "@/components/article/TopTenList";
import AfterArticle from "@/components/article/AfterArticle";
import ShareFloatingMenu from "@/components/article/ShareFloatingMenu";
import AdSense from "@/components/AdSense";
import AfiliadosCarrossel from "@/components/home/AfiliadosCarrossel";
import matter from "gray-matter";
import { Share2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

function normalizeMdxContainers(raw: string): string {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimStart();
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

    output.push(line);
  }

  return output.join("\n");
}

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
    console.error("Erro ao renderizar MDX:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 p-4 text-sm">
          Não foi possível renderizar o conteúdo deste artigo. Verifique se o
          MDX contém variáveis não definidas (por exemplo, uso de
          &quot;index&quot; sem declaração).
          <div className="mt-2 text-xs text-amber-700">
            {this.state.errorMessage}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PostPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams() || {};
  const rawSlug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  const [post, setPost] = useState<Article | null>(null);
  const [mdx, setMdx] = useState<MDXRemoteSerializeResult | null>(null);
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = post?.title || "Artigo";

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado para a área de transferência!");
    } catch {
      // usuário pode cancelar o compartilhamento nativo
    }
  };

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const data = await getArticleBySlug(slug);
        setPost(data);
        if (data?.content) {
          // Remover frontmatter do conteúdo antes de serializar
          const { content } = matter(data.content);
          try {
            const mdxSource = await serialize(content, {
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            });
            setMdx(mdxSource);
          } catch (firstError) {
            try {
              const normalized = normalizeMdxContainers(content);
              const mdxSource = await serialize(normalized, {
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              });
              setMdx(mdxSource);
            } catch {
              console.error("Erro ao compilar MDX do artigo:", firstError);
              setMdx(null);
            }
          }
        } else {
          setMdx(null);
        }
      } catch {
        setPost(null);
        setMdx(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-slate-500 mb-8">Carregando artigo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
        <p className="text-slate-500 mb-8">
          O artigo &quot;{slug}&quot; não foi encontrado em nossa base de dados.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Voltar para a home
        </Link>
      </div>
    );
  }

  return (
    <article className="-mt-13 md:mt-0 pb-20 rounded-0 md:rounded-3xl shadow-xl">
      <ShareFloatingMenu
        title={post.title || "Artigo"}
        url={`https://www.fujiviewtech.com/artigos/${encodeURIComponent(slug)}`}
      />

      {/* Estrutura em 4 colunas no desktop: conteúdo principal ocupa 3. */}
      <div className="container-custom bg-white">
        <div className="md:grid md:grid-cols-4 md:gap-0">
          <div className="md:col-span-3 bg-white">
            {!authLoading && user && (
              <div className="sticky top-20 z-30 h-0">
                <div className="flex justify-end px-4 md:px-8 pointer-events-none">
                  <Link
                    href={`/admin/artigos?slug=${encodeURIComponent(slug)}&category=${encodeURIComponent(post.category || "")}&subcategory=${encodeURIComponent(post.subcategory || "geral")}`}
                    className="h-10 px-4 flex items-center justify-center bg-slate-800 text-white rounded-full hover:bg-slate-900 transition-colors pointer-events-auto"
                  >
                    Editar artigo
                  </Link>
                </div>
              </div>
            )}

            <div className="px-4 md:px-8">
              <ArtigoCard post={post}>
                {mdx ? (
                  <MDXErrorBoundary>
                    <MDXRemote {...mdx} components={mdxComponents} />
                  </MDXErrorBoundary>
                ) : (
                  <div>{post.content}</div>
                )}
              </ArtigoCard>
            </div>

            {/* Rodapé do artigo com CTA de compartilhamento */}
            <div className="mt-4 py-8 border-t border-slate-200 px-4 md:px-8">
              <div className="text-gray-500 italic flex items-center justify-center gap-2">
                <span>Gostou deste artigo? Compartilhe!</span>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Compartilhar artigo"
                  title="Compartilhar"
                  className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="px-4 md:px-8">
              <div className="mt-4 mb-2 p-3 border border-slate-200 rounded-sm bg-slate-50 min-h-[120px]">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 text-center">
                  Publicidade
                </p>
                <AdSense slot="1122334455" />
              </div>
            </div>

            <div className="px-4 md:px-8">
              <AfterArticle category={post.category} currentSlug={slug} />
            </div>
          </div>
          <div className="hidden md:block bg-slate-50 md:pl-0 md:sticky md:top-[-1050] self-start h-fit">
            <div className="mt-6 mb-6 p-3 border border-slate-200 rounded-sm bg-slate-50 min-h-[280px]">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 text-center">
                Publicidade
              </p>
              <AdSense slot="1234567890" />
            </div>
            <TopTenList currentSlug={slug} />
            <div className="mt-8 md:ml-9">
              <AfiliadosCarrossel
                title="AFILIADOS"
                emptyMessage=""
                smallArrows
                compact
              />
            </div>
            <div className="mt-6 mb-6 p-3 border border-slate-200 rounded-sm bg-slate-50 min-h-[280px]">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 text-center">
                Publicidade
              </p>
              <AdSense slot="0987654321" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
