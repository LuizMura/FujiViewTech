"use client";

import AdminHeader from "../AdminHeader";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ArticleList from "@/components/admin/ArticleList";
import ArticlePreview from "@/components/admin/ArticlePreview";
import ArticleForm from "@/components/admin/ArticleForm";
import { useRef } from "react";
import {
  useAutoSave,
  restoreAutoSave,
  clearAutoSave,
} from "@/lib/hooks/useAutoSave";

type ArticleDraft = Record<string, unknown> & {
  title?: string;
  id?: string;
  status?: string;
  content?: string;
  mdxImage?: string;
  image?: string;
};

export default function AdminArtigosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#23272f]" />}>
      <AdminArtigosPageContent />
    </Suspense>
  );
}

function AdminArtigosPageContent() {
  type LeftTab = "list" | "form";
  const searchParams = useSearchParams();
  const [selectedArticle, setSelectedArticle] = useState<ArticleDraft | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>("list");

  // Ref para recarregar artigos na lista
  const articleListRef = useRef<{ reload: () => void }>(null);

  const slugFromUrl = (searchParams.get("slug") || "").trim();
  const categoryFromUrl = (searchParams.get("category") || "").trim();
  const subcategoryFromUrl = (searchParams.get("subcategory") || "").trim();

  // Autosave no localStorage
  useAutoSave({
    key: "admin-article-draft",
    data: selectedArticle,
    delay: 2000, // salva após 2s sem digitar
    enabled: !!selectedArticle, // só salva se houver artigo selecionado
  });

  // Restaurar autosave ao carregar página
  useEffect(() => {
    if (slugFromUrl) return;
    if (selectedArticle) return;
    const saved = restoreAutoSave<ArticleDraft>("admin-article-draft");
    if (saved) {
      const shouldRestore = window.confirm(
        "Encontramos um rascunho não salvo. Deseja restaurá-lo?",
      );
      if (shouldRestore) {
        setSelectedArticle(saved);
        setFeedback("Rascunho restaurado do autosave!");
      } else {
        clearAutoSave("admin-article-draft");
      }
    }
  }, [selectedArticle, slugFromUrl]);

  // Se vier slug/category na URL, abre diretamente o artigo para edição.
  useEffect(() => {
    async function loadFromUrl() {
      if (!slugFromUrl || !categoryFromUrl) return;

      try {
        setLoadingAction(true);
        setFeedback(null);

        const response = await fetch(
          `/api/content/${encodeURIComponent(slugFromUrl)}?category=${encodeURIComponent(categoryFromUrl)}&subcategory=${encodeURIComponent(subcategoryFromUrl)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar o artigo");
        }

        setSelectedArticle({
          id: data?.id || undefined,
          title: data?.frontmatter?.title || "",
          slug: data?.slug || slugFromUrl,
          category: data?.frontmatter?.category || categoryFromUrl,
          subcategory:
            data?.frontmatter?.subcategory || subcategoryFromUrl || "geral",
          author: data?.frontmatter?.author || "",
          excerpt: data?.frontmatter?.description || "",
          image: data?.frontmatter?.image || "",
          readTime: data?.frontmatter?.readTime || "5 min",
          publishedAt: data?.frontmatter?.date || "",
          content: data?.content || "",
          status: "published",
        });

        setFeedback("Artigo carregado para edição.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setFeedback(`Erro ao abrir artigo da URL: ${msg}`);
      } finally {
        setLoadingAction(false);
      }
    }

    loadFromUrl();
  }, [slugFromUrl, categoryFromUrl, subcategoryFromUrl]);

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          {/* Lista + Formulário: 1 coluna (esquerda) */}
          <div className="md:col-span-1 h-full flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#18181b] p-1 border border-[#4b6b57]">
              <button
                type="button"
                onClick={() => setLeftTab("list")}
                className={`px-2 py-2 rounded-md text-xs md:text-sm font-semibold transition ${
                  leftTab === "list"
                    ? "bg-[#7f8fa6] text-[#23272f]"
                    : "text-[#bfc7d5] hover:bg-[#2a2f39]"
                }`}
              >
                Lista de Artigos
              </button>
              <button
                type="button"
                onClick={() => setLeftTab("form")}
                className={`px-2 py-2 rounded-md text-xs md:text-sm font-semibold transition ${
                  leftTab === "form"
                    ? "bg-[#7f8fa6] text-[#23272f]"
                    : "text-[#bfc7d5] hover:bg-[#2a2f39]"
                }`}
              >
                Formulário
              </button>
            </div>

            {/* Lista */}
            {leftTab === "list" && (
              <div className="overflow-y-auto max-h-96 md:max-h-none">
                <ArticleList
                  ref={articleListRef}
                  onSelect={(id, data) => {
                    setSelectedArticle(
                      data ? ({ ...data } as ArticleDraft) : null,
                    );
                    setLeftTab("form");
                  }}
                  selectedId={
                    (typeof selectedArticle?.id === "string" &&
                      selectedArticle.id) ||
                    (typeof selectedArticle?.slug === "string" &&
                      selectedArticle.slug) ||
                    null
                  }
                  onNew={() => {
                    setSelectedArticle(null);
                    setLeftTab("form");
                  }}
                  onDelete={async () => {
                    if (
                      !window.confirm(
                        "Tem certeza que deseja excluir este artigo?",
                      )
                    )
                      return;
                    setLoadingAction(true);
                    setFeedback(null);
                    setTimeout(() => {
                      setFeedback("Artigo excluído (simulação).");
                      setSelectedArticle(null);
                      setLoadingAction(false);
                      articleListRef.current?.reload();
                    }, 1000);
                  }}
                  loadingAction={loadingAction}
                />
              </div>
            )}

            {/* Formulário */}
            {leftTab === "form" && (
              <div className="overflow-y-auto flex-1 max-h-96 md:max-h-none">
                <ArticleForm
                  form={{
                    title: "",
                    ...(selectedArticle || {}),
                    author: String(selectedArticle?.author || ""),
                    status: String(selectedArticle?.status || "published"),
                  }}
                  cardType="ArtigoCard"
                  onFormChange={(field, value) => {
                    setSelectedArticle((prev) => ({
                      ...prev,
                      [field]: value,
                    }));
                  }}
                  onImageUpload={(url) => {
                    setSelectedArticle((prev) => ({
                      ...prev,
                      image: url,
                    }));
                  }}
                  onMdxImageUpload={(url) => {
                    setSelectedArticle((prev) => ({
                      ...prev,
                      mdxImage: url,
                    }));
                  }}
                  onContentChange={(value) => {
                    setSelectedArticle((prev) => ({
                      ...prev,
                      content: value,
                    }));
                  }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoadingAction(true);
                    setFeedback(null);
                    try {
                      const title = String(selectedArticle?.title || "").trim();
                      const slug = String(selectedArticle?.slug || "").trim();
                      const category = String(
                        selectedArticle?.category || "",
                      ).trim();
                      const subcategory = String(
                        selectedArticle?.subcategory || "geral",
                      ).trim();
                      const author = String(
                        selectedArticle?.author || "Redação FujivewTech",
                      ).trim();

                      if (!title || !slug || !category) {
                        throw new Error(
                          "Preencha título, slug e categoria antes de salvar.",
                        );
                      }

                      const payload = {
                        category,
                        subcategory,
                        slug,
                        frontmatter: {
                          title,
                          description: String(
                            selectedArticle?.description ||
                              selectedArticle?.excerpt ||
                              "",
                          ),
                          date: String(selectedArticle?.publishedAt || ""),
                          image: String(selectedArticle?.image || ""),
                          subcategory,
                          author,
                          readTime: String(
                            selectedArticle?.readTime || "5 min",
                          ),
                        },
                        content: String(selectedArticle?.content || ""),
                      };

                      const response = await fetch("/api/content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(
                          data?.error || "Falha ao salvar artigo",
                        );
                      }

                      setFeedback(
                        selectedArticle?.id
                          ? "Artigo atualizado com sucesso!"
                          : "Artigo criado com sucesso!",
                      );
                      setSelectedArticle((prev) => ({
                        ...(prev || {}),
                        title,
                        slug,
                        category,
                        subcategory,
                      }));
                      articleListRef.current?.reload();
                      // Limpar autosave após salvar com sucesso
                      clearAutoSave("admin-article-draft");
                    } catch (err) {
                      let msg = "";
                      if (err && typeof err === "object" && "message" in err) {
                        msg = (err as Error).message;
                      } else {
                        msg = String(err);
                      }
                      setFeedback("Erro ao salvar artigo: " + msg);
                    } finally {
                      setLoadingAction(false);
                    }
                  }}
                />
                {feedback && (
                  <div className="text-center text-sm md:text-base text-green-400 font-bold mt-2">
                    {feedback}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview: 2 colunas (direita) */}
          <div className="md:col-span-2 h-full max-h-96 md:max-h-none">
            <ArticlePreview
              cardType="ArtigoCard"
              form={selectedArticle || {}}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
