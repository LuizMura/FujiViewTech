"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { Article } from "@/lib/types/article";
import { getArticleById } from "@/lib/hooks/useArticles";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams() as { id?: string } | null;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const loadArticle = async () => {
    if (!params || !params.id) return;
    setLoading(true);
    try {
      const data = await getArticleById(params.id);
      setArticle(data);
    } catch (error) {
      console.error("Error loading article:", error);
      alert("Erro ao carregar artigo");
      router.push("/admin/articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handleSave = (updatedArticle: Article) => {
    console.log("Article updated:", updatedArticle);
    setArticle(updatedArticle);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-gray-500 text-lg">Carregando artigo...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Artigo não encontrado</p>
          <button
            onClick={() => router.push("/admin/articles")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Voltar para artigos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ArticleEditor article={article} onSave={handleSave} />
    </div>
  );
}
