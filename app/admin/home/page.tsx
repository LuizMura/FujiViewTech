"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../AdminHeader";
import { createClient } from "@/lib/supabase/client";
import PostCard from "@/components/article/PostCard";
import AfiliadosCard from "@/components/home/AfiliadosCard";

interface ArticleDB {
  id: string;
  slug: string;
  category: string;
  title: string;
  description?: string;
  image?: string;
  read_time?: string;
  published_date?: string;
  created_at?: string;
  status?: string;
}

interface AfiliadoProduto {
  id?: string;
  imagem: string;
  titulo: string;
  descricao: string;
  loja?: string;
  preco: string;
  afiliado1_nome: string;
  afiliado1_url: string;
  afiliado1_cor?: string;
  afiliado1_texto?: string;
  afiliado2_nome: string;
  afiliado2_url: string;
  afiliado2_cor?: string;
  afiliado2_texto?: string;
}

export default function AdminHomePage() {
  const [articles, setArticles] = useState<ArticleDB[]>([]);
  const [afiliados, setAfiliados] = useState<AfiliadoProduto[]>([]);
  const [selectedArticleSlugs, setSelectedArticleSlugs] = useState<string[]>([]);
  const [selectedAfiliadoIds, setSelectedAfiliadoIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, slug, category, title, description, image, read_time, published_date, created_at, status")
        .eq("status", "published")
        .order("published_date", { ascending: false });

      const afiliadosRes = await fetch("/api/afiliados");
      const afiliadosData = await afiliadosRes.json();

      const configRes = await fetch("/api/home-config");
      const configData = await configRes.json();

      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setAfiliados(Array.isArray(afiliadosData) ? afiliadosData : []);
      setSelectedArticleSlugs(Array.isArray(configData.article_slugs) ? configData.article_slugs : []);
      setSelectedAfiliadoIds(Array.isArray(configData.afiliado_ids) ? configData.afiliado_ids : []);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const toggleArticle = (slug: string) => {
    setSelectedArticleSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleAfiliado = (id?: string) => {
    if (!id) return;
    setSelectedAfiliadoIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/home-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleSlugs: selectedArticleSlugs,
          afiliadoIds: selectedAfiliadoIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao salvar");
      setMessage("Configuração salva");
    } catch (error: any) {
      setMessage(error?.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const selectedArticles = useMemo(
    () => articles.filter((a) => selectedArticleSlugs.includes(a.slug)),
    [articles, selectedArticleSlugs]
  );

  const selectedAfiliadosData = useMemo(
    () => afiliados.filter((a) => a.id && selectedAfiliadoIds.includes(String(a.id))),
    [afiliados, selectedAfiliadoIds]
  );

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#bfc7d5]">Home</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="text-sm text-[#bfc7d5] hover:text-white border border-[#3b4250] px-3 py-1 rounded"
            >
              Recarregar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

        {message && <div className="mb-4 text-sm text-[#bfc7d5]">{message}</div>}

        {loading ? (
          <div className="text-[#9ca3af]">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <section className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6 text-[#d5deed]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Artigos na home</h2>
                  <span className="text-xs text-[#9ca3af]">Selecione os destaques</span>
                </div>
                <div className="max-h-[360px] overflow-y-auto divide-y divide-[#2c313c]">
                  {articles.map((article) => (
                    <label key={article.id} className="flex items-start gap-3 py-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedArticleSlugs.includes(article.slug)}
                        onChange={() => toggleArticle(article.slug)}
                      />
                      <div>
                        <div className="font-semibold text-sm text-white">{article.title}</div>
                        <div className="text-xs text-[#9ca3af]">/{article.category} · {article.slug}</div>
                      </div>
                    </label>
                  ))}
                  {!articles.length && <div className="text-sm text-[#9ca3af]">Nenhum artigo publicado.</div>}
                </div>
              </section>

              <section className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6 text-[#d5deed]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Cards de afiliados</h2>
                  <span className="text-xs text-[#9ca3af]">Escolha os que aparecerão</span>
                </div>
                <div className="max-h-[360px] overflow-y-auto divide-y divide-[#2c313c]">
                  {afiliados.map((item) => (
                    <label key={item.id || item.titulo} className="flex items-start gap-3 py-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={item.id ? selectedAfiliadoIds.includes(String(item.id)) : false}
                        onChange={() => toggleAfiliado(item.id ? String(item.id) : undefined)}
                      />
                      <div>
                        <div className="font-semibold text-sm text-white">{item.titulo}</div>
                        <div className="text-xs text-[#9ca3af]">{item.preco}</div>
                      </div>
                    </label>
                  ))}
                  {!afiliados.length && <div className="text-sm text-[#9ca3af]">Nenhum afiliado cadastrado.</div>}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6 text-[#d5deed]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Preview — artigos</h2>
                  <span className="text-xs text-[#9ca3af]">Atualiza em tempo real</span>
                </div>
                {selectedArticles.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedArticles.map((article) => (
                      <PostCard
                        key={article.id}
                        post={{
                          slug: article.slug,
                          title: article.title,
                          description: article.description || "",
                          image: article.image || "/images/og-default.png",
                          category: article.category,
                          date: article.published_date || article.created_at || new Date().toISOString(),
                          readTime: article.read_time || undefined,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#9ca3af]">Nenhum artigo selecionado.</div>
                )}
              </section>

              <section className="bg-[#1d2027] border border-[#2c313c] rounded-xl p-6 text-[#d5deed]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Preview — afiliados</h2>
                  <span className="text-xs text-[#9ca3af]">Atualiza em tempo real</span>
                </div>
                {selectedAfiliadosData.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAfiliadosData.map((item, idx) => (
                      <AfiliadosCard
                        key={item.id || idx}
                        imagem={item.imagem}
                        titulo={item.titulo}
                        descricao={item.descricao}
                        loja={item.loja || "Loja"}
                        preco={item.preco}
                        afiliados={[
                          {
                            nome: item.afiliado1_nome,
                            url: item.afiliado1_url,
                            logo: item.afiliado1_nome?.toLowerCase().includes("amazon")
                              ? "/images/amazon-logo.png"
                              : undefined,
                            cor: item.afiliado1_cor,
                            texto: item.afiliado1_texto,
                          },
                          {
                            nome: item.afiliado2_nome,
                            url: item.afiliado2_url,
                            logo: item.afiliado2_nome?.toLowerCase().includes("mercado")
                              ? "/images/mercadolivre-logo.png"
                              : undefined,
                            cor: item.afiliado2_cor,
                            texto: item.afiliado2_texto,
                          },
                        ] as any}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#9ca3af]">Nenhum afiliado selecionado.</div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
