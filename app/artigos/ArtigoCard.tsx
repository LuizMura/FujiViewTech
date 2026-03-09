import React from "react";
import Image from "next/image";
import { Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface ArtigoCardProps {
  post: Article;
  showAuthor?: boolean;
  children?: React.ReactNode;
}

const ArtigoCard: React.FC<ArtigoCardProps> = ({
  post,
  showAuthor = true,
  children,
}) => {
  const summary = post.excerpt || post.description || "";

  return (
    <>
      {/* Capa do artigo com título sobreposto */}
      <div className="mb-0 md:mb-0 w-full bg-white text-black">
        {/* Metadados exibidos acima da imagem */}
        <div className="px-2 md:px-0 py-2 md:py-4 flex flex-wrap items-center gap-1 md:gap-3 text-xs md:text-sm font-medium text-slate-700 overflow-x-auto">
          <Link
            href={`/categorias/${post.category}`}
            className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-300 text-black font-bold rounded-full capitalize tracking-wide text-xs md:text-sm"
          >
            {post.category}
          </Link>

          <span className="w-1 h-1 bg-slate-300 rounded-full" />

          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar size={14} className="text-slate-500 hidden md:inline" />
            <span>
              {post.updatedAt
                ? new Date(post.updatedAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>

          {post.readTime && (
            <>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock size={16} className="text-slate-500" />
                <span>{post.readTime}</span>
              </div>
            </>
          )}

          {showAuthor && (
            <>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-slate-600">
                <User size={16} className="text-slate-500" />
                <span className="text-slate-800">
                  {post.authorId || "Autor"}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="relative w-full aspect-video md:h-[450px] overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <Image
            src={post.image || "/images/placeholder.jpg"}
            alt={post.title ? post.title : "Imagem do artigo"}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-end p-0 px-6 md:px-12 mb-5 md:mb-8 md:w-[90%]">
            <div className="space-y-3 ">
              <h1
                className="leading-none text-3xl md:text-4xl lg:text-5xl font-semi-bold text-white md:leading-tight tracking-tight drop-shadow-lg"
                style={{ width: "100%", maxWidth: "95%" }}
              >
                {post.title}
              </h1>

              {summary && (
                <p
                  className="text-base md:text-lg text-white/90 leading-tight md:leading-relaxed"
                  style={{ width: "100%", maxWidth: "95%" }}
                >
                  {summary}
                </p>
              )}

              {showAuthor ? (
                <div className="hidden md:flex items-center gap-3 pt-0 md:pt-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <User size={20} />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-bold text-white drop-shadow">
                      {post.authorId || "Autor"}
                    </p>
                    <p className="text-xs text-white/80">
                      Redação • FujiViewTech
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pt-0 flex justify-end">
                  <Link
                    href={`/artigos/${post.slug}`}
                    className="inline-block px-5 py-2 bg-white/80 text-black font-semibold rounded-full shadow hover:bg-indigo-400 transition-colors"
                  >
                    Ver matéria
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo MDX */}
      {children && (
        <div
          className={`py-8 px-5 md:pl-6 bg-white text-black prose prose-base md:prose-lg max-w-none rounded-b-3xl

          prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight
          prose-p:text-black
          prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-700
          prose-strong:text-black prose-strong:font-semibold
          prose-li:text-black prose-li:marker:text-indigo-400

          prose-img:rounded-xl md:prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-6 md:prose-img:my-10

          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50
          prose-blockquote:py-2 prose-blockquote:px-4 md:prose-blockquote:px-6
          prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-black

          [&_h1]:text-2xl md:[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h1]:mt-0 [&_h1]:mb-4 md:[&_h1]:mb-6
          [&_h2]:text-xl md:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-6 md:[&_h2]:mt-10 [&_h2]:mb-3 md:[&_h2]:mb-4
          [&_h3]:text-lg md:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-5 md:[&_h3]:mt-6 [&_h3]:mb-2 md:[&_h3]:mb-3
          [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-7 md:[&_p]:leading-8 [&_p]:mb-4 md:[&_p]:mb-6

          [&_ul]:list-disc [&_ul]:pl-5 md:[&_ul]:pl-6
          [&_li]:mb-1 md:[&_li]:mb-2

          /* estilos para tabela */
          [&_table]:w-full
          [&_table]:border-collapse
          [&_table]:my-6
          [&_thead]:bg-slate-100
          [&_th]:p-3
          [&_th]:text-left
          [&_th]:font-semibold
          [&_th]:border
          [&_td]:p-3
          [&_td]:border
          [&_tbody_tr:nth-child(even)]:bg-slate-50

[&_table]:w-full
[&_table]:border-separate
[&_table]:border-spacing-0
[&_table]:overflow-hidden
[&_table]:rounded-xl
[&_table]:shadow-sm

[&_thead]:bg-slate-900
[&_thead]:text-white

[&_th]:p-4
[&_th]:text-left
[&_th]:font-semibold
[&_th]:text-sm

[&_td]:p-4
[&_td]:text-sm
[&_td]:border-t

[&_tbody_tr]:transition
[&_tbody_tr:hover]:bg-slate-50

          `}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default ArtigoCard;
