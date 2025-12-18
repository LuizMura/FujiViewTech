import React from "react";
import Image from "next/image";
import { Article } from "@/lib/types/article";

interface CardProps {
  artigos: Article[];
  categoria: string;
  badgeColor: string;
  badgeLabel: string;
}

const CategoriaCard: React.FC<CardProps> = ({ artigos, categoria, }) => {
  const filtrados = artigos.filter((artigo) => {
    if (!artigo.category) return false;
    const normalizada = artigo.category
      .normalize("NFD")
      .replace(/\u0300-\u036f/g, "")
      .trim()
      .toLowerCase();
    return (
      normalizada === categoria ||
      normalizada === categoria + "s" ||
      normalizada.startsWith(categoria)
    );
  });

  if (filtrados.length === 0) return null;

  // Mais recente
  const maisRecente = filtrados
    .slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    })[0];

  if (!maisRecente) return <div><h1>Sem artigos disponíveis</h1></div>;

  return (
    <div className="w-full max-w-xs mx-auto relative flex flex-col items-center bg-white rounded-2xl shadow border overflow-hidden">
      {maisRecente.image ? (
        <div className="w-full aspect-square relative">
          <Image
            src={maisRecente.image}
            alt={maisRecente.title}
            fill
            style={{ objectFit: "cover", borderRadius: 12 }}
            sizes="300px"
          />
        </div>
      ) : (
        <div className="w-full aspect-square bg-slate-200 rounded-t-2xl" />
      )}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 w-full">
        <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 mb-1 text-center">{maisRecente.title}</h3>
        {maisRecente.excerpt && (
          <p className="text-xs md:text-sm text-slate-600 line-clamp-2 text-center">{maisRecente.excerpt}</p>
        )}
      </div>
    </div>
  );
};

export default CategoriaCard;
