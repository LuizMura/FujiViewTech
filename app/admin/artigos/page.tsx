"use client";

import AdminHeader from "../AdminHeader";
import { useState, useEffect } from "react";
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
  const searchParams = useSearchParams();
  const [selectedArticle, setSelectedArticle] = useState<ArticleDraft | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Ref para recarregar artigos na lista
  const articleListRef = useRef<{ reload: () => void }>(null);

  const slugFromUrl = (searchParams.get("slug") || "").trim();
  const categoryFromUrl = (searchParams.get("category") || "").trim();

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
          `/api/content/${encodeURIComponent(slugFromUrl)}?category=${encodeURIComponent(categoryFromUrl)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar o artigo");
        }

        setSelectedArticle({
          title: data?.frontmatter?.title || "",
          slug: data?.slug || slugFromUrl,
          category: data?.frontmatter?.category || categoryFromUrl,
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
  }, [slugFromUrl, categoryFromUrl]);

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          {/* Lista + Formulário: 1 coluna (esquerda) */}
          <div className="md:col-span-1 h-full flex flex-col gap-3">
            {/* Lista em cima */}
            <div className="overflow-y-auto max-h-60 md:max-h-none">
              <ArticleList
                ref={articleListRef}
                onSelect={(id, data) =>
                  setSelectedArticle(
                    data ? ({ ...data } as ArticleDraft) : null,
                  )
                }
                selectedId={selectedArticle?.id || null}
                onNew={() => setSelectedArticle(null)}
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

            {/* Formulário em baixo */}
            <div className="overflow-y-auto flex-1 max-h-96 md:max-h-none">
              <ArticleForm
                form={{
                  title: "",
                  ...(selectedArticle || {}),
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

                    if (!title || !slug || !category) {
                      throw new Error(
                        "Preencha título, slug e categoria antes de salvar.",
                      );
                    }

                    const payload = {
                      category,
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
                        author: "FujiViewTech",
                        readTime: String(selectedArticle?.readTime || "5 min"),
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
                      throw new Error(data?.error || "Falha ao salvar artigo");
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
