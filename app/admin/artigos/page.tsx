"use client";

import AdminHeader from "../AdminHeader";
import { useState, useEffect } from "react";
import ArticleList from "@/components/admin/ArticleList";
import ArticlePreview from "@/components/admin/ArticlePreview";
import ArticleForm from "@/components/admin/ArticleForm";
import { useRef } from "react";
import {
  useAutoSave,
  restoreAutoSave,
  clearAutoSave,
} from "@/lib/hooks/useAutoSave";

export default function AdminArtigosPage() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Ref para recarregar artigos na lista
  const articleListRef = useRef<{ reload: () => void }>(null);

  // Autosave no localStorage
  useAutoSave({
    key: "admin-article-draft",
    data: selectedArticle,
    delay: 2000, // salva após 2s sem digitar
    enabled: !!selectedArticle, // só salva se houver artigo selecionado
  });

  // Restaurar autosave ao carregar página
  useEffect(() => {
    const saved = restoreAutoSave("admin-article-draft");
    if (saved && !selectedArticle) {
      const shouldRestore = window.confirm(
        "Encontramos um rascunho não salvo. Deseja restaurá-lo?"
      );
      if (shouldRestore) {
        setSelectedArticle(saved);
        setFeedback("Rascunho restaurado do autosave!");
      } else {
        clearAutoSave("admin-article-draft");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-3 gap-6 h-full">
          {/* Lista + Formulário: 1 coluna (esquerda) */}
          <div className="col-span-1 h-full flex flex-col gap-3">
            {/* Lista em cima */}
            <div className="overflow-y-auto">
              <ArticleList
                ref={articleListRef}
                onSelect={(id, data) => setSelectedArticle(data)}
                selectedId={selectedArticle?.id || null}
                onNew={() => setSelectedArticle(null)}
                onDelete={async () => {
                  if (
                    !window.confirm(
                      "Tem certeza que deseja excluir este artigo?"
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
            <div className="overflow-y-auto flex-1">
              <ArticleForm
                form={selectedArticle || { status: "published" }}
                cardType="ArtigoCard"
                onFormChange={(field, value) => {
                  setSelectedArticle((prev: any) => ({
                    ...prev,
                    [field]: value,
                  }));
                }}
                onImageUpload={(url) => {
                  setSelectedArticle((prev: any) => ({
                    ...prev,
                    image: url,
                  }));
                }}
                onMdxImageUpload={(url) => {
                  setSelectedArticle((prev: any) => ({
                    ...prev,
                    mdxImage: url,
                  }));
                }}
                onContentChange={(value) => {
                  setSelectedArticle((prev: any) => ({
                    ...prev,
                    content: value,
                  }));
                }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoadingAction(true);
                  setFeedback(null);
                  try {
                    const { createArticle, updateArticle } = await import(
                      "@/lib/hooks/useArticles"
                    );
                    let result;
                    if (selectedArticle?.id) {
                      let fullData = {
                        ...selectedArticle,
                      };
                      result = await updateArticle(fullData);
                      setFeedback("Artigo atualizado com sucesso!");
                    } else {
                      result = await createArticle(selectedArticle);
                      setFeedback("Artigo criado com sucesso!");
                    }
                    setSelectedArticle(result);
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
                <div className="text-center text-green-400 font-bold mt-2">
                  {feedback}
                </div>
              )}
            </div>
          </div>

          {/* Preview: 2 colunas (direita) */}
          <div className="col-span-2 h-full">
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
