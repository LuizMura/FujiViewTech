import React from "react";
import Image from "next/image";
import { Article } from "@/lib/types/article";

interface EconomiaCardProps {
  artigos: Article[];
}

const EconomiaCard: React.FC<EconomiaCardProps> = ({ artigos }) => {
  const economia = artigos.filter(
    (artigo) =>
      artigo.category &&
      artigo.category
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase() === "economia"
  );

  if (economia.length === 0) return null;

  // Ordena por data de publicação (mais recente primeiro)
  const economiaMaisRecente = economia.slice().sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  })[0];

  if (!economiaMaisRecente) return null;

  return (
    <div className="w-full max-w-xl mx-auto relative flex items-center h-[120px] md:h-[215px] bg-white rounded-none md:rounded-2xl shadow border overflow-hidden">
      <span className="absolute top-3 left-3 z-10 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
        Economia
      </span>
      {/* Imagem quadrada à esquerda cobrindo 100% da altura */}
      {economiaMaisRecente.image ? (
        <div className="flex-shrink-0 h-full aspect-square relative">
          <Image
            src={economiaMaisRecente.image}
            alt={economiaMaisRecente.title}
            fill
            className="object-cover rounded-xl max-md:rounded-none"
            sizes="(max-width: 768px) 100vw, 215px"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 h-full aspect-square bg-slate-200 rounded-xl ml-2" />
      )}
      {/* Título e descrição à direita */}
      <div className="flex-1 flex flex-col justify-center px-2">
        <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 mb-1">
          {economiaMaisRecente.title}
        </h3>
        {economiaMaisRecente.excerpt && (
          <p className="text-xs md:text-sm text-slate-600 line-clamp-2">
            {economiaMaisRecente.excerpt}
          </p>
        )}
      </div>
    </div>
  );
};

export default EconomiaCard;
