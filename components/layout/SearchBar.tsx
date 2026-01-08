import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SearchBar({
  onResultClick,
}: {
  onResultClick?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; title: string; summary: string; url: string }>
  >([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const fetchArticles = async () => {
      if (search.length > 1) {
        setSearching(true);
        // Busca separada em title e summary
        const [titleRes, summaryRes] = await Promise.all([
          supabase
            .from("articles")
            .select("id, title, summary")
            .ilike("title", `%${search}%`),
          supabase
            .from("articles")
            .select("id, title, summary")
            .ilike("summary", `%${search}%`),
        ]);
        const dataTitle = titleRes.data || [];
        const dataSummary = summaryRes.data || [];
        const error = titleRes.error || summaryRes.error;
        // Unir resultados sem duplicatas
        const results = [...dataTitle, ...dataSummary]
          .filter(
            (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            url: `/artigos/${item.id}`,
          }));
        console.log("[SearchBar] Resultados:", results, "Erro:", error);
        if (error) {
          console.error("[SearchBar] Erro Supabase:", error);
          setSearchResults([]);
        } else {
          setSearchResults(results);
        }
        setSearching(false);
      } else {
        setSearchResults([]);
      }
    };
    fetchArticles();
  }, [search]);

  return (
    <form
      className="relative"
      role="search"
      aria-label="Buscar artigos"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative flex items-center">
        <span className="absolute left-3 text-slate-500">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-100 text-slate-900 w-full"
          aria-label="Buscar artigos"
        />
      </div>
      {/* Resultados da busca */}
      {search.length > 1 && (
        <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          {searching ? (
            <div className="p-4 text-center text-slate-500">Buscando...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  className="border-b border-slate-100 last:border-none"
                >
                  <Link
                    href={`/artigos/${result.id}`}
                    className="block px-4 py-3 hover:bg-indigo-50 text-slate-700 cursor-pointer"
                    onClick={() => {
                      setSearch("");
                      if (onResultClick) onResultClick();
                    }}
                  >
                    <span className="font-bold">{result.title}</span>
                    <br />
                    <span className="text-xs text-slate-500">
                      {result.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-slate-500">
              Nenhum artigo encontrado.
            </div>
          )}
        </div>
      )}
    </form>
  );
}
