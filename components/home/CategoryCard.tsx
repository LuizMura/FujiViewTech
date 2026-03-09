import React from "react";
import Image from "next/image";
import Link from "next/link";
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
        .toLowerCase() === category.toLowerCase(),
  );

  if (filtered.length === 0) return null;

  // Ordena por data de publicação (mais recente primeiro)
  const latest = filtered.slice().sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  })[0];

  if (!latest) return null;

  const summary = latest.excerpt || latest.description || "";

  return (
    <Link href={`/artigos/${latest.slug}`} className="block">
      <div className="-mt-1 md:mt-0 w-full max-w-xl mx-auto relative flex items-stretch min-h-[120px] md:min-h-[215px] bg-white rounded-sm shadow overflow-hidden cursor-pointer">
        <span
          className={`absolute top-3 left-3 z-10 ${badgeColor} text-white text-xs font-semibold px-3 py-1`}
        >
          {label}
        </span>
        {/* Imagem à esquerda */}
        {latest.image ? (
          <div className="flex-shrink-0 w-[110px] md:w-[215px] min-h-[120px] md:min-h-[215px] relative">
            <Image
              src={latest.image}
              alt={latest.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 215px"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-[110px] md:w-[215px] min-h-[120px] md:min-h-[215px] bg-slate-200" />
        )}
        {/* Título e descrição à direita */}
        <div className="flex-1 flex flex-col justify-start pt-3 px-2 pb-3">
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 break-words">
            {latest.title}
          </h3>
          {summary && (
            <p className="text-xs md:text-sm text-slate-600 break-words">
              {summary}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
