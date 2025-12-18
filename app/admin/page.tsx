"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import DashboardCategoryTable from "@/components/admin/DashboardCategoryTable";
import ArticleList from "@/components/admin/ArticleList";
import TopArticlesRanking from "@/components/admin/TopArticlesRanking";
import EditorArtigosCard from "@/components/admin/EditorArtigosCard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      setLoginError(error.message);
    } else {
      setUser(data.user);
    }
  };

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      window.location.href = "/admin/dashboard";
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#23272f]">
        <form
          onSubmit={handleLogin}
          className="bg-[#2d313a] p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-[#bfc7d5]">Login Admin</h2>
          <input
            type="email"
            placeholder="E-mail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="border border-[#444857] bg-[#23272f] text-[#bfc7d5] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7f8fa6]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="border border-[#444857] bg-[#23272f] text-[#bfc7d5] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7f8fa6]"
            required
          />
          {loginError && (
            <div className="text-red-400 text-sm text-center">{loginError}</div>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-[#7f8fa6] text-[#23272f] rounded-lg hover:bg-[#596275] transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  // Após login, mostrar header fixo com navegação
  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <header className="bg-[#2d313a] shadow flex items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-[#bfc7d5] mr-8">FujiViewTech Admin</h1>
        <nav className="flex gap-6">
          <a href="/admin/dashboard" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Dashboard</a>
          <a href="/admin/artigos" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Criar/Editar Artigos</a>
          <a href="/admin/afiliados" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Criar/Editar AfiliadosCard</a>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-[#bfc7d5] mb-8">Bem-vindo ao painel administrativo</h2>
        <p className="text-[#bfc7d5] text-lg mb-4 text-center">Selecione uma das opções acima para acessar o Dashboard, gerenciar artigos ou afiliados.</p>
      </main>
    </div>
  );
}
