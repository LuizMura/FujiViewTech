import React from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface CarrosselCardProps {
  article: Article;
  showAuthor?: boolean;
}

const CarrosselCard: React.FC<CarrosselCardProps> = ({
  article,
  showAuthor = true,
}) => {
  return (
    <>
      {/* Featured Image with Title Overlay */}
      <div className="mb-6 w-full">
        <div className="relative w-full aspect-video md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
          <Image
            src={article.image || "/images/placeholder.jpg"}
            alt={article.title ? article.title : "Imagem do artigo"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          {/* Title and Metadata on top of image */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-15">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                <span className="text-white font-bold capitalize tracking-wide">
                  {article.category}
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-white/80" />
                  <span>
                    {article.updatedAt
                      ? new Date(article.updatedAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </span>
                </div>
              </div>

              <h1
                className="text-3xl md:text-5xl lg:text-[2.5vw] font-extrabold text-white leading-tight tracking-tight drop-shadow-lg whitespace-normal break-words"
                style={{ width: "100%", maxWidth: "85%" }}
              >
                {article.title}
              </h1>
              {article.excerpt && (
                <p
                  className="text-base text-[1.3vw] text-white/90 leading-relaxed whitespace-normal break-words"
                  style={{ width: "100%", maxWidth: "80%" }}
                >
                  {article.excerpt}
                </p>
              )}

              <div className="pt-0 flex justify-end">
                <Link
                  href={`/artigos/${article.slug}`}
                  className="inline-block px-5 py-1 bg-white/80 text-black font-semibold rounded-full shadow hover:bg-indigo-400 transition-colors"
                >
                  Ver matéria
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
