import React from "react";
import Image from "next/image";
import { Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface ArtigoCardProps {
  post: Article;
  showAuthor?: boolean;
  showCoverAuthor?: boolean;
  children?: React.ReactNode;
}

const ArtigoCard: React.FC<ArtigoCardProps> = ({
  post,
  showAuthor = true,
  showCoverAuthor = true,
  children,
}) => {
  const summary = post.excerpt || post.description || "";

  return (
    <>
      {/* HEADER DO ARTIGO */}
      <header className="w-full bg-white text-slate-900">
        {/* META */}
        <div className="px-3 md:px-0 py-3 md:py-5 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-600">
          <Link
            href={`/categorias/${post.category}`}
            className="px-3 py-1 bg-slate-900 text-white font-semibold rounded-full capitalize tracking-wide hover:bg-slate-800 transition"
          >
            {post.category}
          </Link>

          {post.subcategory && (
            <span className="px-3 py-1 bg-slate-100 text-slate-800 font-medium rounded-full capitalize">
              {post.subcategory}
            </span>
          )}

          <span className="w-1 h-1 bg-slate-300 rounded-full" />

          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400 hidden md:inline" />
            <span>
              {post.updatedAt
                ? new Date(post.updatedAt).toLocaleDateString("pt-BR")
                : ""}
            </span>
          </div>

          {post.readTime && (
            <>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>{post.readTime}</span>
              </div>
            </>
          )}

          {showAuthor && (
            <>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-slate-400" />
                <span className="text-slate-800 font-medium">
                  {post.authorId || "Autor"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* CAPA */}
        <div className="relative w-full aspect-video md:h-[500px] overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={post.image || "/images/placeholder.jpg"}
            alt={post.title || "Imagem do artigo"}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-6 md:pb-10 max-w-4xl">
            <h1 className="hidden md:block text-2xl md:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              {post.title}
            </h1>

            {summary && (
              <p className="hidden md:block mt-2 text-base md:text-lg text-white/90 leading-relaxed max-w-2xl">
                {summary}
              </p>
            )}

            {showCoverAuthor ? (
              <div className="hidden md:flex items-center gap-3 mt-5">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <User size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {post.authorId || "Autor"}
                  </p>
                  <p className="text-xs text-white/70">
                    Redação • FujiViewTech
                  </p>
                </div>
              </div>
            ) : !showAuthor ? (
              <div className="pt-0 flex justify-start mt-5">
                <Link
                  href={`/artigos/${post.slug}`}
                  className="inline-block px-5 py-2 bg-white/80 text-black font-semibold rounded-full shadow hover:bg-indigo-400 transition-colors"
                >
                  Ver matéria
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:hidden pl-3 pr-1 pt-3">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
            {post.title}
          </h1>
          {summary && (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      {children && (
        <article
          className={`
          pt-5 pb-10 px-3 md:py-10 md:px-4
          bg-white text-slate-800
          w-full max-w-none md:max-w-4xl md:mx-auto

          prose prose-base md:prose-lg max-w-none

          prose-headings:font-bold
          prose-headings:text-slate-900
          prose-headings:tracking-tight

          prose-p:text-slate-800

          prose-a:text-indigo-600
          prose-a:font-semibold
          prose-a:underline
          prose-a:underline-offset-4
          hover:prose-a:text-indigo-800

          [&_p]:leading-7 md:[&_p]:leading-8
          [&_p]:mb-5
          [&_p]:max-w-none

          [&_h1]:text-2xl md:[&_h1]:text-4xl [&_h1]:mt-2 [&_h1]:mb-3
          [&_h2]:text-xl md:[&_h2]:text-3xl [&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:scroll-mt-24
          [&_h3]:text-lg md:[&_h3]:text-2xl [&_h3]:mt-4 [&_h3]:mb-2

          prose-li:marker:text-indigo-500

          prose-img:rounded-2xl
          prose-img:shadow-lg
          prose-img:my-8

          prose-blockquote:border-l-4
          prose-blockquote:border-indigo-500
          prose-blockquote:bg-indigo-50/60
          prose-blockquote:px-6
          prose-blockquote:py-4
          prose-blockquote:rounded-r-lg
          prose-blockquote:not-italic

          [&_table]:w-full
          [&_table]:border-separate
          [&_table]:border-spacing-0
          [&_table]:my-10
          [&_table]:rounded-xl
          [&_table]:overflow-hidden
          [&_table]:shadow-sm

          [&_thead]:bg-slate-900
          [&_thead]:text-white

          [&_th]:p-4
          [&_th]:text-sm
          [&_th]:font-semibold
          [&_td]:p-4
          [&_td]:text-sm
          [&_td]:border-t

          [&_tbody_tr:hover]:bg-slate-50
          `}
        >
          {children}
        </article>
      )}
    </>
  );
};

export default ArtigoCard;
