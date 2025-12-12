"use client";
import ArticleList from "@/components/admin/ArticleList";

import { useState } from "react";

const CATEGORIES = [
  { label: "Todos", value: "" },
  { label: "Tecnologia", value: "tecnologia" },
  { label: "Notícias", value: "noticias" },
  { label: "Tutorial", value: "tutorial" },
  { label: "Economia", value: "economia" },
  { label: "Saúde", value: "saude" },
  { label: "Filmes e Séries", value: "filmes-series" },
  { label: "Viagens", value: "viagens" },
];

export default function ArticlesPage() {
  const [category, setCategory] = useState<string>("");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artigos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os artigos do site
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-center py-2">
        <span className="font-medium text-gray-700">Categoria:</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <ArticleList category={category} />
    </div>
  );
}
