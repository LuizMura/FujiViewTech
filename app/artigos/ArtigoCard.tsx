import React from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
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
  return (
    <>
      {/* Featured Image with Title Overlay */}
      <div className="mb-0 md:mb-0 w-full">
        <div className="relative w-full aspect-video md:h-[450px] rounded-t-none md:rounded-t-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <Image
            src={post.image || "/images/placeholder.jpg"}
            alt={post.title ? post.title : "Imagem do artigo"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          {/* Mobile metadata pinned at the top inside the card */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-10 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-white drop-shadow">
              <span className="px-3 py-1 bg-black/70 text-white font-bold rounded-full capitalize tracking-wide">
                {post.category}
              </span>
              <span className="w-1 h-1 bg-white/60 rounded-full"></span>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-white/80" />
                <span>
                  {post.updatedAt
                    ? new Date(post.updatedAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
              {post.readTime && (
                <>
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-white/80" />
                    <span>{post.readTime} de leitura</span>
                  </div>
                </>
              )}
              {showAuthor && (
                <>
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="text-white/80" />
                    <span className="text-white/90">
                      {post.authorId || "Autor"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Title and Metadata on top of image */}
          <div className="absolute inset-0 flex flex-col justify-end p-0 px-6 md:px-12 mb-5 md:mb-8 md:w-[90%]">
            <div className="space-y-3 ">
              <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-4 text-sm font-medium text-white/90">
                <span className="px-4 py-1 md:py-1.5 bg-black/40 backdrop-blur-sm text-white font-bold rounded-full capitalize tracking-wide">
                  {post.category}
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-white/80" />
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
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-white/80" />
                      <span>{post.readTime} de leitura</span>
                    </div>
                  </>
                )}
                {showAuthor && (
                  <>
                    <span className="w-1 h-1 bg-white/50 rounded-full md:hidden"></span>
                    <div className="md:hidden flex items-center gap-1.5">
                      <User size={16} className="text-white/80" />
                      <span className="text-white/90">
                        {post.authorId || "Autor"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <h1
                className="leading-none text-2xl md:text-5xl lg:text-6xl font-extrabold text-white md:leading-tight tracking-tight drop-shadow-lg"
                style={{ width: "100%", maxWidth: "95%" }}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p
                  className="text-base md:text-lg text-white/90 leading-tight md:leading-relaxed"
                  style={{ width: "100%", maxWidth: "95%" }}
                >
                  {post.excerpt}
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
                      Editor Chefe • FujiViewTech
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
        {/* Autor inline no mobile já renderizado na linha de metadados acima */}
      </div>

      {/* MDX Content colado no ArtigoCard */}
      {children && (
        <div
          className="px-6 md:px-44 py-6 md:py-8 bg-white text-black prose prose-base md:prose-lg max-w-none rounded-b-3xl 
          prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight
          prose-p:text-black prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-700
          prose-strong:text-black prose-strong:font-bold
          prose-li:text-black prose-li:marker:text-indigo-400
          prose-img:rounded-xl md:prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-6 md:prose-img:my-10
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-4 md:prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-black
          [&_h1]:text-2xl md:[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h1]:mt-0 [&_h1]:mb-4 md:[&_h1]:mb-6
          [&_h2]:text-xl md:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-6 md:[&_h2]:mt-10 [&_h2]:mb-3 md:[&_h2]:mb-4
          [&_h3]:text-lg md:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-5 md:[&_h3]:mt-6 [&_h3]:mb-2 md:[&_h3]:mb-3
          [&_p]:text-base md:[&_p]:text-lg [&_p]:leading-7 md:[&_p]:leading-8 [&_p]:mb-4 md:[&_p]:mb-6
          [&_ul]:list-disc [&_ul]:pl-5 md:[&_ul]:pl-6 [&_li]:mb-1 md:[&_li]:mb-2"
        >
          {children}
        </div>
      )}
    </>
  );
};

export default ArtigoCard;
