
"use client";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Article } from "@/lib/types/article";
import { getArticles } from "@/lib/hooks/useArticles";
import { createClient } from "@/lib/supabase/client";


export interface ArticleListRef {
  reload: () => void;
}

interface ArticleListProps {
  onSelect?: (id: string, data?: Article) => void;
  selectedId?: string | null;
  category?: string;
  onNew?: () => void;
  onDelete?: () => void;
  loadingAction?: boolean;
}


const ArticleList = forwardRef<ArticleListRef, ArticleListProps>(function ArticleList({
  onSelect,
  selectedId,
  category: externalCategory,
  onNew,
  onDelete,
  loadingAction,
}, ref) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(externalCategory || "");
  const [categories, setCategories] = useState<string[]>([]);

  // Sincronizar filtro externo com interno
  useEffect(() => {
    if (externalCategory !== undefined && externalCategory !== category) {
      setCategory(externalCategory);
    }
  }, [externalCategory]);

  // Buscar categorias únicas do Supabase
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("articles")
        .select("category")
        .neq("category", "")
        .order("category", { ascending: true });
      if (error) {
        setCategories([]);
      } else {
        const unique = Array.from(
          new Set((data || []).map((a) => a.category))
        );
        setCategories(unique);
      }
    }
    fetchCategories();
  }, []);

  // Carregar artigos filtrados
  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles(category ? { category } : undefined);
      setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    reload: loadArticles,
  }));

  useEffect(() => {
    loadArticles();
  }, [category]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-400">Lista de Artigos</h2>
      <div className="flex flex-col gap-2 mb-4">
        <button
          className="w-full py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-bold hover:bg-[#596275] transition"
          onClick={onNew}
          disabled={loadingAction}
        >
          Novo Artigo
        </button>
        {selectedId && (
          <>
            <button
              className="w-full py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-700 transition"
              onClick={() => setShowConfirm(true)}
              disabled={loadingAction}
            >
              Excluir Artigo
            </button>
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
                <div className="bg-white rounded shadow-lg p-4 w-72 flex flex-col items-center border border-gray-200">
                  <h3 className="text-base font-bold mb-2 text-red-600">Confirmar exclusão</h3>
                  <p className="mb-4 text-gray-700 text-center text-sm">Excluir este artigo?</p>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 text-sm"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-700 text-sm"
                      onClick={() => {
                        setShowConfirm(false);
                        onDelete?.();
                      }}
                      disabled={loadingAction}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="category-select"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Filtrar por categoria:
        </label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Carregando artigos...</div>
        </div>
      ) : (
        <ul className=" h-180 overflow-auto space-y-px border border-[#4b6b57] rounded-lg bg-[#18181b]">
          {articles.map((article) => (
            <li key={article.id}>
              <button
                className={`w-full text-left px-4 py-1 rounded-lg transition flex flex-col border ${
                  selectedId === article.id
                    ? "bg-[#4b6b57] text-white border-[#4b6b57] shadow-lg"
                    : "bg-[#18181b] text-white border-transparent hover:bg-[#23232a] hover:border-[#4b6b57]"
                }`}
                onClick={() => onSelect?.(article.id, article)}
              >
                <span className="font-semibold text-base mb-1">
                  {article.title}
                </span>
                <span className="text-xs text-gray-400">
                  {article.category}
                </span>
              </button>
            </li>
          ))}
          {articles.length === 0 && (
            <li className="text-gray-500 px-3 py-2">
              Nenhum artigo encontrado
            </li>
          )}
        </ul>
      )}
    </div>
  );
});

export default ArticleList;
