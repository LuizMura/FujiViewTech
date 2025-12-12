"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import CategoryEditor from "./CategoryEditor";
import AffiliateEditor from "./AffiliateEditor";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Plane,
  Film,
  DollarSign,
  Heart,
  Newspaper,
  BookOpen,
  TrendingUp,
  LogOut,
} from "lucide-react";

type MainTab = "categories" | "affiliates";
type CategoryTab =
  | "reviews"
  | "dicas"
  | "novidades"
  | "noticias"
  | "tutoriais"
  | "economia"
  | "saude"
  | "viagens"
  | "filmes-series";
type AffiliateTab = "products" | "travels";

export default function NewAdminDashboard() {
  const { supabase, user } = useAuth();
  const [mainTab, setMainTab] = useState<MainTab>("categories");
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("reviews");
  const [affiliateTab, setAffiliateTab] = useState<AffiliateTab>("products");

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const categories = [
    { id: "reviews", name: "Reviews", icon: FileText, color: "#3b82f6" },
    { id: "dicas", name: "Dicas", icon: BookOpen, color: "#8b5cf6" },
    { id: "novidades", name: "Novidades", icon: TrendingUp, color: "#06b6d4" },
    { id: "noticias", name: "Notícias", icon: Newspaper, color: "#ef4444" },
    { id: "tutoriais", name: "Tutoriais", icon: BookOpen, color: "#6366f1" },
    { id: "economia", name: "Economia", icon: DollarSign, color: "#10b981" },
    { id: "saude", name: "Saúde", icon: Heart, color: "#3b82f6" },
    { id: "viagens", name: "Viagens", icon: Plane, color: "#06b6d4" },
    {
      id: "filmes-series",
      name: "Filmes e Séries",
      icon: Film,
      color: "#dc2626",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Header */}
      <div className="bg-[#252526] border-b border-[#2d2d30] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={24} className="text-[#4fc3f7]" />
            <h1 className="text-2xl font-bold text-[#cccccc]">
              FujiViewTech Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#858585]">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#3c3c3c] hover:bg-[#4a4a4a] text-[#cccccc] rounded transition flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-[#252526] border-b border-[#2d2d30] px-6">
        <div className="flex gap-2">
          <button
            onClick={() => setMainTab("categories")}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              mainTab === "categories"
                ? "text-[#4fc3f7] border-[#4fc3f7]"
                : "text-[#858585] border-transparent hover:text-[#cccccc]"
            }`}
          >
            <FileText size={18} className="inline mr-2" />
            Categorias e Artigos
          </button>
          <button
            onClick={() => setMainTab("affiliates")}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              mainTab === "affiliates"
                ? "text-[#4fc3f7] border-[#4fc3f7]"
                : "text-[#858585] border-transparent hover:text-[#cccccc]"
            }`}
          >
            <ShoppingBag size={18} className="inline mr-2" />
            Produtos Afiliados
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {mainTab === "categories" && (
          <div>
            {/* Category Tabs */}
            <div className="bg-[#252526] rounded-lg p-4 mb-6 border border-[#2d2d30]">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryTab(cat.id as CategoryTab)}
                      className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                        categoryTab === cat.id
                          ? "bg-[#4fc3f7] text-[#1e1e1e]"
                          : "bg-[#3c3c3c] text-[#cccccc] hover:bg-[#4a4a4a]"
                      }`}
                    >
                      <Icon size={16} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Editor */}
            <CategoryEditor
              category={categoryTab}
              onSave={async (data) => {
                console.log("Salvando categoria:", data);
              }}
              supabase={supabase}
            />
          </div>
        )}

        {mainTab === "affiliates" && (
          <div>
            {/* Affiliate Type Tabs */}
            <div className="bg-[#252526] rounded-lg p-4 mb-6 border border-[#2d2d30]">
              <div className="flex gap-2">
                <button
                  onClick={() => setAffiliateTab("products")}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    affiliateTab === "products"
                      ? "bg-[#4fc3f7] text-[#1e1e1e]"
                      : "bg-[#3c3c3c] text-[#cccccc] hover:bg-[#4a4a4a]"
                  }`}
                >
                  <ShoppingBag size={16} />
                  Produtos
                </button>
                <button
                  onClick={() => setAffiliateTab("travels")}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    affiliateTab === "travels"
                      ? "bg-[#4fc3f7] text-[#1e1e1e]"
                      : "bg-[#3c3c3c] text-[#cccccc] hover:bg-[#4a4a4a]"
                  }`}
                >
                  <Plane size={16} />
                  Viagens
                </button>
              </div>
            </div>

            {/* Affiliate Editor */}
            <AffiliateEditor
              type={affiliateTab === "products" ? "product" : "travel"}
              supabase={supabase}
            />
          </div>
        )}
      </div>
    </div>
  );
}
