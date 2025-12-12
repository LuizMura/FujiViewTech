"use client";

import { ReactNode } from "react";
import ArticleList from "./ArticleList";
import ArticleEditor from "./ArticleEditor";
import DashboardHome from "./DashboardHome";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Article } from "@/lib/types/article";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Array<string>>([]);

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
        // Extrai categorias únicas
        const unique = Array.from(new Set((data || []).map((a) => a.category)));
        setCategories(unique);
      }
    }
    fetchCategories();
  }, []);

  // Função para buscar artigo pelo id
  async function fetchArticle(id: string) {
    const res = await fetch(`/api/admin/articles/${id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedArticle(data);
    }
  }

  // Handler para seleção de artigo
  function handleSelectArticle(id: string) {
    setSelectedArticleId(id);
    fetchArticle(id);
  }
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/articles/new", label: "Novo Artigo", icon: "➕" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/settings", label: "Configurações", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#18181b] text-white transition-colors duration-300 mt-6">
      {/* Header */}
      <header className="bg-[#23232a] border-b border-[#23232a] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="text-2xl font-bold"
              style={{ color: "#4b6b57" }}
            >
              FujiviewTech DashBoard
            </Link>
            <nav className="flex items-center gap-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive ? "" : "text-white hover:bg-[#23232a]"
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: "#4b6b57", color: "#fff" }
                        : {}
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm transition"
              style={{ color: "#4b6b57" }}
            >
              Ver Site →
            </Link>
            <button
              style={{ backgroundColor: "#4b6b57", color: "#fff" }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-[#355040]"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar apenas para Artigos */}
        <aside className="w-80 bg-black-100 border-r border-[#4b6b57] min-h-[calc(100vh-73px)] sticky top-0">
          <nav className="p-4 space-y-1">
            <div className="">
              {/* Lista de artigos */}
              <ArticleList
                onSelect={handleSelectArticle}
                selectedId={selectedArticleId}
              />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#18181b] text-white">
          {selectedArticle ? (
            <div>
              {/* ArticleEditor recebe o artigo selecionado */}
              <ArticleEditor article={selectedArticle} />
            </div>
          ) : (
            <DashboardHome />
          )}
        </main>
      </div>
    </div>
  );
}
