"use client";

import AdminHeader from "../AdminHeader";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleList from "@/components/admin/ArticleList";
import ArticlePreview from "../../../components/admin/ArticlePreview";
import ArticleForm from "@/components/admin/ArticleForm";
import {
  useAutoSave,
  restoreAutoSave,
  clearAutoSave,
} from "@/lib/hooks/useAutoSave";
import {
  FIXED_CATEGORIES,
  isFixedCategory,
  normalizeCategorySlug,
} from "@/lib/constants/categories";

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

  const sanitizeMdxBeforeSave = (raw: string) => {
    const repairedLegacyProductRow = String(raw || "").replace(
      /<ProductRow\s*\n\s*image="\s*\n\s*>/g,
      '<ProductRow\n  title="Nome do produto"\n  image=""\n>',
    );

    const normalized = repairedLegacyProductRow
      .replace(/\r\n?/g, "\n")
      .replace(/<[^>]*>/g, (tag) => tag.replace(/^\s*\/\/.*$/gm, ""));

    const escapeTag = (line: string) =>
      line.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const linesForJsxGuard = normalized.split("\n");
    const guarded: string[] = [];
    let pendingTagLines: string[] | null = null;

    for (const line of linesForJsxGuard) {
      if (pendingTagLines) {
        pendingTagLines.push(line);
        const isTagClosed = /^\s*.*(?:>|\/>)\s*$/.test(line);
        const enteredMarkdownBeforeClosing =
          /^\s{0,3}(?:#{1,6}\s|[-+*]\s|\d+\.\s|>)/.test(line) && !isTagClosed;

        if (isTagClosed || enteredMarkdownBeforeClosing) {
          const block = pendingTagLines.join("\n");
          const hasUnbalancedDoubleQuotes =
            ((block.match(/"/g) || []).length & 1) === 1;
          const malformed =
            hasUnbalancedDoubleQuotes || enteredMarkdownBeforeClosing;

          if (malformed) {
            guarded.push(...pendingTagLines.map(escapeTag));
          } else {
            guarded.push(...pendingTagLines);
          }

          pendingTagLines = null;
        }

        continue;
      }

      const opensMultilineJsxTag =
        /^\s*<[A-Z][\w.-]*(?:\s.*)?$/.test(line) &&
        !/^\s*.*(?:>|\/>)\s*$/.test(line);

      if (opensMultilineJsxTag) {
        pendingTagLines = [line];
        continue;
      }

      guarded.push(line);
    }

    if (pendingTagLines) {
      guarded.push(...pendingTagLines.map(escapeTag));
    }

    const lines = guarded;
    const output: string[] = [];

    for (const line of lines) {
      const liftedFromContainer = line.replace(
        /^\s*(?:>\s*|(?:[-+*]|\d+\.)\s+)(<\/?[A-Z][\w.-]*(?:\s|>|\/).*)$/,
        "$1",
      );

      const trimmed = liftedFromContainer.trimStart();
      const isJsxComponentLine = /^<\/?[A-Z][\w.-]*(\s|>|\/)/.test(trimmed);

      if (isJsxComponentLine) {
        let idx = output.length - 1;
        while (idx >= 0 && output[idx].trim() === "") idx -= 1;

        if (idx >= 0) {
          const prev = output[idx].trimStart();
          const isBlockQuoteContext = /^>/.test(prev);
          const isListContext = /^(?:\d+\.|[-+*])\s/.test(prev);

          if (isBlockQuoteContext || isListContext) {
            output.push("");
          }
        }
      }

      output.push(liftedFromContainer);
    }

    return output.join("\n");
  };

  // Ref para recarregar artigos na lista
  const articleListRef = useRef<{ reload: () => void }>(null);

  const slugFromUrl = (searchParams.get("slug") || "").trim();
  const categoryFromUrl = normalizeCategorySlug(
    (searchParams.get("category") || "").trim(),
  );
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

        if (!isFixedCategory(categoryFromUrl)) {
          throw new Error("Categoria da URL invalida.");
        }

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
                  onSelect={(_id, data) => {
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
                    category: FIXED_CATEGORIES[0].slug,
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
                      mdxImageUrl: url,
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
                      const formState: ArticleDraft = {
                        title: "",
                        category: FIXED_CATEGORIES[0].slug,
                        ...(selectedArticle || {}),
                        author: String(selectedArticle?.author || ""),
                        status: String(selectedArticle?.status || "published"),
                      };

                      const title = String(formState.title || "").trim();
                      const slugFromForm = String(formState.slug || "").trim();
                      const autoSlug = title
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      const slug = slugFromForm || autoSlug;
                      const category = String(formState.category || "").trim();
                      const normalizedCategory =
                        normalizeCategorySlug(category);
                      const subcategory = String(
                        formState.subcategory || "",
                      ).trim();
                      const status = String(
                        formState.status || "published",
                      ).trim();
                      const author = String(
                        formState.author || "Redação FujivewTech",
                      ).trim();
                      const tags = Array.isArray(formState.tags)
                        ? formState.tags
                            .map((tag) => String(tag).trim())
                            .filter(Boolean)
                        : [];
                      const brand = String(formState.brand || "").trim();

                      if (!title || !slug || !normalizedCategory) {
                        throw new Error(
                          "Preencha título, slug e categoria antes de salvar.",
                        );
                      }

                      if (!isFixedCategory(normalizedCategory)) {
                        throw new Error(
                          "Categoria invalida. Use Reviews, Produtos, Noticias ou Novidades.",
                        );
                      }

                      const payload = {
                        category: normalizedCategory,
                        subcategory,
                        status,
                        tags,
                        brand,
                        slug,
                        frontmatter: {
                          title,
                          description: String(
                            selectedArticle?.description ||
                              formState.excerpt ||
                              "",
                          ),
                          date: String(formState.publishedAt || ""),
                          image: String(formState.image || ""),
                          subcategory,
                          author,
                          readTime: String(formState.readTime || "5 min"),
                        },
                        content: sanitizeMdxBeforeSave(
                          String(formState.content || ""),
                        ),
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
                        category: normalizedCategory,
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
