import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import ImageCarousel from "@/components/ImageCarousel";
import ProductReview from "@/components/ProductReview";
import { Affiliate } from "@/components/MDXComponents";

const components = {
  ImageCarousel,
  ProductReview,
  Affiliate,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-indigo-600 underline hover:text-indigo-800" />
  ),
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
        <p className="text-slate-500 mb-8">O artigo "{slug}" não foi encontrado em nossa base de dados.</p>
        <Link href="/" className="text-indigo-600 hover:underline font-semibold">
          Voltar para a home
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-20">
      {/* Back Button */}
      <div className="pt-10 container-custom max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 group font-medium"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>
      </div>

      {/* Featured Image with Title Overlay */}
      <div className="container-custom max-w-5xl mx-auto mb-16">
        <div className="relative w-full aspect-video md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          
          {/* Title and Metadata on top of image */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full capitalize tracking-wide">
                  {post.category}
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-white/80" />
                  <span>{new Date(post.date).toLocaleDateString("pt-BR", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {post.readTime && (
                  <>
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-white/80" />
                      <span>{post.readTime} de leitura</span>
                    </div>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                {post.title}
              </h1>
              
              {post.description && (
                <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl">
                  {post.description}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white drop-shadow">{post.author}</p>
                  <p className="text-xs text-white/80">Editor Chefe • FujiViewTech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom max-w-3xl mx-auto">
        <div className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:text-indigo-900
          prose-p:text-slate-600 prose-p:leading-8 prose-p:mb-6
          prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-700
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
          prose-li:text-slate-600 prose-li:marker:text-indigo-400
          prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-slate-700">
          <MDXRemote source={post.content} components={components} />
        </div>

        {/* Footer / Share / Tags placeholder */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500 italic text-center">
            Gostou deste artigo? Compartilhe com seus amigos!
          </p>
        </div>
      </div>
    </article>
  );
}
