"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Article, ArticleDB, articleFromDB } from "@/lib/types/article";

interface TopTenListProps {
  currentSlug?: string;
}

export default function TopTenList({ currentSlug }: TopTenListProps) {
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const [recent, setRecent] = useState<Article[]>([]);
  const [popular, setPopular] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchLists() {
      setLoading(true);
      try {
        const supabase = createClient();
        const [rRes, pRes] = await Promise.all([
          supabase
            .from("articles")
            .select("*")
            .eq("status", "published")
            .neq("slug", currentSlug || "")
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("articles")
            .select("*")
            .eq("status", "published")
            .neq("slug", currentSlug || "")
            .order("views", { ascending: false })
            .limit(10),
        ]);

        if (!mounted) return;

        setRecent((rRes.data || []).map((d) => articleFromDB(d as ArticleDB)));
        setPopular((pRes.data || []).map((d) => articleFromDB(d as ArticleDB)));
      } catch (err) {
        console.error("Error fetching top lists:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLists();

    return () => {
      mounted = false;
    };
  }, [currentSlug]);

  const list = tab === "recent" ? recent : popular;

  return (
    <aside className="p-4 bg-white rounded-lg ml-4 mt-8">
      <div className="flex items-center gap-2 mb-3 text-sm">
        <button
          onClick={() => setTab("recent")}
          className={`px-2 py-1 ${
            tab === "recent"
              ? "text-green-800 border-b-2 border-green-800 font-semibold"
              : "text-slate-600"
          }`}
        >
          Recentes
        </button>
        <span className="text-slate-400">|</span>
        <button
          onClick={() => setTab("popular")}
          className={`px-2 py-1 ${
            tab === "popular"
              ? "text-green-800 border-b-2 border-green-800 font-semibold"
              : "text-slate-600"
          }`}
        >
          Mais visitados
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Carregando...</div>
      ) : (
        <ol className="list-none space-y-2 text-base">
          {list.slice(0, 10).map((a, idx) => (
            <li
              key={a.id}
              className="font-semibold flex items-center py-3 border-b border-gray-200 h-12"
            >
              <span className="inline-block w-6 text-green-700 font-bold mr-4">
                {idx + 1}
              </span>
              <Link
                href={`/artigos/${a.slug}`}
                className="text-sm text-slate-800 hover:text-indigo-600 line-clamp-2"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
