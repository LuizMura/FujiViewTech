import React from "react";
import Image from "next/image";
import { Article } from "@/lib/types/article";

interface CategoryCardProps {
  artigos: Article[];
  category: string;
  label: string;
  badgeColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  artigos,
  category,
  label,
  badgeColor,
}) => {
  const filtered = artigos.filter(
    (artigo) =>
      artigo.category &&
      artigo.category
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase() === category.toLowerCase()
  );

  if (filtered.length === 0) return null;

  // Ordena por data de publicação (mais recente primeiro)
  const latest = filtered.slice().sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  })[0];

  if (!latest) return null;

  return (
    <div className="-mt-1 md:mt-0 w-full max-w-xl mx-auto relative flex items-start h-[120px] md:h-[215px] bg-white rounded-sm md:rounded-2xl shadow border overflow-hidden">
      <span
        className={`absolute top-3 left-3 z-10 ${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}
      >
        {label}
      </span>
      {/* Imagem à esquerda */}
      {latest.image ? (
        <div className="flex-shrink-0 h-full aspect-[14/9] md:aspect-square relative">
          <Image
            src={latest.image}
            alt={latest.title}
            fill
            className="object-cover rounded-xl max-md:rounded-none"
            sizes="(max-width: 768px) 100vw, 215px"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 h-full aspect-square bg-slate-200 rounded-xl ml-2" />
      )}
      {/* Título e descrição à direita */}
      <div className="flex-1 flex flex-col justify-start pt-3 px-2">
        <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 mb-1">
          {latest.title}
        </h3>
        {latest.excerpt && (
          <p className="text-xs md:text-sm text-slate-600 line-clamp-2">
            {latest.excerpt}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
