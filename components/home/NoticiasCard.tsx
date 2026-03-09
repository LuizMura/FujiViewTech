import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface NoticiasCardProps {
  artigos: Article[];
}

const NoticiasCard: React.FC<NoticiasCardProps> = ({ artigos }) => {
  const noticias = artigos.filter(
    (artigo) =>
      artigo.category &&
      artigo.category
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase() === "noticias",
  );

  if (noticias.length === 0) return null;

  // Ordena por data de publicação (mais recente primeiro)
  const noticiaMaisRecente = noticias.slice().sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  })[0];

  if (!noticiaMaisRecente) return null;

  return (
    <Link href={`/artigos/${noticiaMaisRecente.slug}`} className="block">
      <div className="-mt-1 md:mt-0 w-full max-w-xl mx-auto relative flex items-stretch min-h-[120px] md:min-h-[215px] bg-white shadow overflow-hidden cursor-pointer">
        <span className="absolute top-3 left-3 z-10 bg-indigo-600 text-white text-xs font-semibold px-3 py-1">
          Notícias
        </span>
        {/* Imagem quadrada à esquerda */}
        {noticiaMaisRecente.image ? (
          <div className="flex-shrink-0 w-[110px] md:w-[215px] min-h-[120px] md:min-h-[215px] relative">
            <Image
              src={noticiaMaisRecente.image}
              alt={noticiaMaisRecente.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 110px, 215px"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-[110px] md:w-[215px] min-h-[120px] md:min-h-[215px] bg-slate-200" />
        )}
        {/* Título e descrição à direita */}
        <div className="flex-1 flex flex-col justify-start pt-3 px-2 pb-3">
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 break-words">
            {noticiaMaisRecente.title}
          </h3>
          {noticiaMaisRecente.excerpt && (
            <p className="text-xs md:text-sm text-slate-600 break-words">
              {noticiaMaisRecente.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NoticiasCard;
