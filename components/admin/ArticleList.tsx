"use client";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from "react";
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

const ArticleList = forwardRef<ArticleListRef, ArticleListProps>(
  function ArticleList(
    {
      onSelect,
      selectedId,
      category: externalCategory,
      onNew,
      onDelete,
      loadingAction,
    },
    ref,
  ) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(externalCategory || "");
    const [subcategory, setSubcategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("");

    // Sincronizar filtro externo com interno
    useEffect(() => {
      if (externalCategory !== undefined) {
        setCategory((prev) =>
          prev !== externalCategory ? externalCategory : prev,
        );
      }
    }, [externalCategory]);

    // Buscar categorias e subcategorias únicas do Supabase
    useEffect(() => {
      async function fetchTaxonomy() {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("articles")
          .select("category, subcategory")
          .neq("category", "")
          .order("category", { ascending: true });
        if (error) {
          setCategories([]);
          setSubcategories([]);
        } else {
          const unique = Array.from(
            new Set((data || []).map((a) => a.category)),
          );
          setCategories(unique);

          const uniqueSubs = Array.from(
            new Set(
              (data || [])
                .map((a) => (a.subcategory || "geral").trim())
                .filter(Boolean),
            ),
          );
          setSubcategories(uniqueSubs);
        }
      }
      fetchTaxonomy();
    }, []);

    const visibleSubcategories = subcategories.filter((sub) => {
      if (!category) return true;
      return articles.some(
        (a) => a.category === category && a.subcategory === sub,
      );
    });

    // Carregar artigos filtrados
    const loadArticles = useCallback(async () => {
      setLoading(true);
      try {
        const filters: Record<string, string> = {};
        if (category) filters.category = category;
        if (subcategory) filters.subcategory = subcategory;
        if (statusFilter && statusFilter !== "") filters.status = statusFilter;

        const data = await getArticles(
          Object.keys(filters).length > 0 ? filters : undefined,
        );
        setArticles(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    }, [category, subcategory, statusFilter]);

    useImperativeHandle(ref, () => ({
      reload: loadArticles,
    }));

    useEffect(() => {
      loadArticles();
    }, [loadArticles]);

    return (
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold text-blue-400">LISTA DE ARTIGOS</h2>
          <div className="flex flex-row gap-2">
            <button
              className="px-2 py-1 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-500 transition"
              onClick={onNew}
              disabled={loadingAction}
            >
              Novo Artigo
            </button>
            {selectedId && (
              <button
                className="px-2 py-1 bg-red-900 text-white rounded-lg font-semibold hover:bg-red-500 transition"
                onClick={() => setShowConfirm(true)}
                disabled={loadingAction}
              >
                Excluir Artigo
              </button>
            )}
          </div>
        </div>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white rounded shadow-lg p-4 w-72 flex flex-col items-center border border-gray-200">
              <h3 className="text-base font-bold mb-2 text-red-600">
                Confirmar exclusão
              </h3>
              <p className="mb-4 text-gray-700 text-center text-sm">
                Excluir este artigo?
              </p>
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
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="category-select"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Categoria:
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory("");
              }}
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
          <div className="flex-1">
            <label
              htmlFor="subcategory-select"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Subcategoria:
            </label>
            <select
              id="subcategory-select"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
            >
              <option value="">Todas</option>
              {visibleSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="status-select"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Status:
            </label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Carregando artigos...</div>
          </div>
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="article-select"
              className="block text-sm font-medium text-gray-300"
            >
              Selecione um artigo:
            </label>
            <select
              id="article-select"
              value={selectedId || ""}
              onChange={(e) => {
                const id = e.target.value;
                const selectedArticle = articles.find((a) => a.id === id);
                if (id && selectedArticle) {
                  onSelect?.(id, selectedArticle);
                }
              }}
              className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
            >
              <option value="">Selecione...</option>
              {articles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title} - {article.category}/{article.subcategory}
                </option>
              ))}
            </select>
            {articles.length === 0 && (
              <div className="text-gray-500 px-1 py-1 text-sm">
                Nenhum artigo encontrado
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default ArticleList;
