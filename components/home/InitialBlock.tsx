import React from "react";
import ArtigosCarrossel from "@/components/home/ArtigosCarrossel";
import CategoryCard from "@/components/home/CategoryCard";
import PenultimateCategoriesGrid from "@/components/home/PenultimateCategoriesGrid";
import { Article } from "@/lib/types/article";

type InitialBlockProps = {
  latestArticles: Article[];
  noticiasArticles: Article[];
  economiaArticles: Article[];
};

export default function InitialBlock({
  latestArticles,
  noticiasArticles,
  economiaArticles,
}: InitialBlockProps) {
  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-8">
        <div className="md:col-span-3 order-1 md:order-1">
          <div className="-mt-3 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-sm overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <ArtigosCarrossel artigos={latestArticles} />
          </div>

          <div className="mt-4 md:mt-6">
            <PenultimateCategoriesGrid />
          </div>
        </div>

        <div className="md:col-span-1 order-2 md:order-2">
          <React.Suspense fallback={<div>Carregando...</div>}>
            <CategoryCard
              artigos={noticiasArticles}
              category="noticias"
              label="Notícias"
              badgeColor="bg-indigo-600"
            />
            <div className="mt-4">
              <CategoryCard
                artigos={economiaArticles}
                category="economia"
                label="Economia"
                badgeColor="bg-green-600"
              />
            </div>
          </React.Suspense>
        </div>
      </div>
    </>
  );
}
