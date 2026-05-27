import React from "react";
import ArtigosCarrossel from "@/components/home/ArtigosCarrossel";
import CategoryCard from "@/components/home/CategoryCard";
import ArtigosEmGrid from "@/components/home/ArtigosEmGrid";
import LivePrices from "@/components/layout/LivePrices";
import { Article } from "@/lib/types/article";
import DebugComponentTag from "@/components/home/DebugComponentTag";

type InitialBlockProps = {
  latestArticles: Article[];
  noticiasArticles: Article[];
  novidadesArticles: Article[];
  showComponentLabels?: boolean;
};

export default function InitialBlock({
  latestArticles,
  noticiasArticles,
  novidadesArticles,
  showComponentLabels = false,
}: InitialBlockProps) {
  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-8">
        <div className="md:col-span-3 order-1 md:order-1">
          <div className="-mt-3 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-sm overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <DebugComponentTag
              name="ArtigosCarrossel"
              enabled={showComponentLabels}
            />
            <ArtigosCarrossel artigos={latestArticles} />
          </div>

          <div className="mt-6 md:mt-10 relative">
            <DebugComponentTag
              name="ArtigosEmGrid"
              enabled={showComponentLabels}
            />
            <ArtigosEmGrid />
          </div>
        </div>

        <div className="md:col-span-1 order-2 md:order-2">
          <div className="space-y-4 md:space-y-6">
            <div className="hidden md:block relative">
              <DebugComponentTag
                name="LivePrices"
                enabled={showComponentLabels}
              />
              <LivePrices />
            </div>

            <React.Suspense fallback={<div>Carregando...</div>}>
              <div className="relative">
                <DebugComponentTag
                  name="CategoryCard (Notícias)"
                  enabled={showComponentLabels}
                />
                <CategoryCard
                  artigos={noticiasArticles}
                  category="noticias"
                  label="Notícias"
                  badgeColor="bg-indigo-600"
                />
              </div>
            </React.Suspense>

            <React.Suspense fallback={<div>Carregando...</div>}>
              <div className="relative">
                <DebugComponentTag
                  name="CategoryCard (Novidades)"
                  enabled={showComponentLabels}
                />
                <CategoryCard
                  artigos={novidadesArticles}
                  category="novidades"
                  label="Novidades"
                  badgeColor="bg-emerald-600"
                />
              </div>
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
