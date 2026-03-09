import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/article";

interface CardProps {
  artigos: Article[];
  categoria?: string;
  badgeColor?: string;
  badgeLabel?: string;
}

const UltimasPostagens: React.FC<CardProps> = ({ artigos }) => {
  if (!artigos || artigos.length === 0) return null;

  // Ordena por data de criação (mais novo primeiro) e ignora o destaque do carrossel.
  const sorted = artigos
    .filter((a) => a.status === "published")
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(1); // Remove o mais recente (está no carrossel)

  // Usa os 5 próximos itens após o destaque principal.
  const penultimos = sorted.slice(0, 5);

  if (penultimos.length === 0) return null;

  return (
    <>
      {penultimos.map((artigo) => (
        <Link key={artigo.id} href={`/${artigo.category}/${artigo.slug}`}>
          <div className="relative flex flex-col items-center bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
            {artigo.image ? (
              <div className="w-full h-48 relative">
                <Image
                  src={artigo.image}
                  alt={artigo.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="250px"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-slate-200" />
            )}
            <div className="flex-1 flex flex-col justify-start px-2 py-1 w-full">
              <h3 className="text-sm font-bold text-slate-900 line-clamp-3 text-start">
                {artigo.title}
              </h3>
              {artigo.excerpt && (
                <p className="text-xs text-slate-600 line-clamp-2 text-center mt-1">
                  {artigo.excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default UltimasPostagens;
