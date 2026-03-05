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
import { components as mdxComponents } from "@/components/article/MDXComponents";
import TopTenList from "@/components/article/TopTenList";
import matter from "gray-matter";
import { Share2 } from "lucide-react";

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
          const mdxSource = await serialize(content);
          setMdx(mdxSource);
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
      {/* Estrutura em 4 colunas no desktop: conteúdo principal ocupa 3. */}
      <div className="container-custom bg-white">
        <div className="md:grid md:grid-cols-4 md:gap-0">
          <div className="md:col-span-3 bg-white">
            <ArtigoCard post={post}>
              {mdx ? (
                <MDXErrorBoundary>
                  <MDXRemote {...mdx} components={mdxComponents} />
                </MDXErrorBoundary>
              ) : (
                <div>{post.content}</div>
              )}
            </ArtigoCard>

            {/* Rodapé do artigo com CTA de compartilhamento */}
            <div className="mt-16 py-8 border-t border-slate-200 px-4 md:px-8">
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
          </div>
          <div className="hidden md:block bg-white">
            <TopTenList currentSlug={slug} />
          </div>
        </div>
      </div>
    </article>
  );
}
