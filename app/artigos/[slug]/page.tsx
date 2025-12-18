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

export default function PostPage() {
  const params = useParams() || {};
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";
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
          const mdxSource = await serialize(data.content);
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
    <article className="pb-20 px-32 rounded-3xl shadow-xl">
      <ArtigoCard post={post} />
      {/* Content */}
      <div className="container-custom max-w-3xl mx-auto">
        <div
          className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:text-indigo-900
          prose-p:text-slate-600 prose-p:leading-8 prose-p:mb-6
          prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-700
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
          prose-li:text-slate-600 prose-li:marker:text-indigo-400
          prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-slate-700"
        >
          {mdx ? (
            <MDXRemote {...mdx} components={mdxComponents} />
          ) : (
            <div>{post.content}</div>
          )}
        </div>

        {/* Footer / Share / Tags placeholder */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-200 italic text-center">
            Gostou deste artigo? Compartilhe com seus amigos!
          </p>
        </div>
      </div>
    </article>
  );
}

    <main className="container-custom py-12 px-[10px]">
      {/* ...existing code... */}
    </main>
