import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface CarrosselCardProps {
  article: Article;
  showAuthor?: boolean;
}

const CarrosselCard: React.FC<CarrosselCardProps> = ({ article }) => {
  return (
    <>
      {/* Capa em destaque com título sobreposto */}
      <div className="w-full">
        <div className="relative w-full aspect-video h-[270px] md:h-[450px] rounded-none md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <Image
            src={article.image || "/images/placeholder.jpg"}
            alt={article.title ? article.title : "Imagem do artigo"}
            fill
            className="object-cover"
            priority
          />
          {/* Gradiente para dar contraste ao texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
          {/* Título e metadados por cima da imagem */}
          <div className="absolute inset-0 flex flex-col justify-start mt-6 p-8 md:p-15">
            <div className="space-y-2 md:space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-medium text-white/90">
                <span className="text-white font-bold capitalize tracking-wide">
                  {article.category}
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-white/80 md:w-4 md:h-4" />
                  <span>
                    {article.updatedAt
                      ? new Date(article.updatedAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          },
                        )
                      : ""}
                  </span>
                </div>
              </div>

              <h1 className="leading-tight text-2xl md:text-5xl lg:text-[2.5vw] font-extrabold text-white leading-tight tracking-tight drop-shadow-lg whitespace-normal break-words max-w-[95%] md:max-w-[85%]">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-2sm md:text-base lg:text-[1.3vw] text-white/90 leading-relaxed whitespace-normal break-words max-w-[95%] md:max-w-[80%]">
                  {article.excerpt}
                </p>
              )}

              <div className="absolute bottom-10 right-5 md:bottom-16 md:right-15">
                <Link
                  href={`/artigos/${article.slug}`}
                  className="inline-block px-4 py-1 md:px-5 md:py-1 bg-white/80 text-black text-xs md:text-sm font-semibold rounded-full shadow hover:bg-indigo-400 transition-colors"
                >
                  Ver Matéria
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarrosselCard;
