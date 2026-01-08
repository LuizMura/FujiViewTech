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
import matter from "gray-matter";

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
    console.error("Erro ao renderizar MDX:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 p-4 text-sm">
          Não foi possível renderizar o conteúdo deste artigo. Verifique se o
          MDX contém variáveis não definidas (por exemplo, uso de "index" sem
          declaração).
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
          O artigo "{slug}" não foi encontrado em nossa base de dados.
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
      <div className="container-custom">
        <ArtigoCard post={post}>
          {mdx ? (
            <MDXErrorBoundary>
              <MDXRemote {...mdx} components={mdxComponents} />
            </MDXErrorBoundary>
          ) : (
            <div>{post.content}</div>
          )}
        </ArtigoCard>

        {/* Footer / Share / Tags placeholder */}
        <div className="mt-16 pt-8 border-t border-slate-200 px-4 md:px-8">
          <p className="text-slate-200 italic text-center">
            Gostou deste artigo? Compartilhe com seus amigos!
          </p>
        </div>
      </div>
    </article>
  );
}
