import React from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface ArtigoCardProps {
  post: Article;
  showAuthor?: boolean;
}

const ArtigoCard: React.FC<ArtigoCardProps> = ({ post, showAuthor = true }) => {
  return (
    <>
      
      {/* Featured Image with Title Overlay */}
      <div className="mb-16 w-full">
        <div className="relative w-full aspect-video md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <Image
            src={post.image || "/images/placeholder.jpg"}
            alt={post.title ? post.title : "Imagem do artigo"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          {/* Title and Metadata on top of image */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full capitalize tracking-wide">
                  {post.category}
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
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
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-white/80" />
                      <span>{post.readTime} de leitura</span>
                    </div>
                  </>
                )}
              </div>

              <h1
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg"
                style={{width: "100%", maxWidth: "95%"}}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p
                  className="text-base md:text-lg text-white/90 leading-relaxed"
                  style={{width: "100%", maxWidth: "95%"}}
                >
                  {post.excerpt}
                </p>
              )}
              {showAuthor ? (
                <div className="flex items-center gap-3 pt-2">
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
                  <Link href={`/artigos/${post.slug}`}
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
    </>
  );
};

export default ArtigoCard;
