"use client";

import AdminHeader from "../AdminHeader";
import { useState } from "react";
import ArticleList from "@/components/admin/ArticleList";
import { useRef } from "react";
import EditorArtigosCard from "@/components/admin/EditorArtigosCard";

export default function AdminArtigosPage() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Ref para recarregar artigos na lista
  const articleListRef = useRef<{ reload: () => void }>(null);

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-2 h-full">
            <ArticleList
              ref={articleListRef}
              onSelect={(id, data) => setSelectedArticle(data)}
              selectedId={selectedArticle?.id || null}
              onNew={() => setSelectedArticle(null)}
              onDelete={async () => {
                if (
                  !window.confirm("Tem certeza que deseja excluir este artigo?")
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
          <div className="col-span-8 h-full flex flex-col">
            <EditorArtigosCard
              cardType="ArtigoCard"
              initialData={selectedArticle || undefined}
              onSave={async (data) => {
                setLoadingAction(true);
                setFeedback(null);
                try {
                  const { createArticle, updateArticle } = await import(
                    "@/lib/hooks/useArticles"
                  );
                  let result;
                  if (data.id) {
                    // Se a imagem foi alterada, garanta que ela seja usada
                    let fullData = { ...selectedArticle, ...data, id: data.id };
                    if (data.image && data.image !== selectedArticle?.image) {
                      fullData.image = data.image;
                    }
                    result = await updateArticle(fullData);
                    setFeedback("Artigo atualizado com sucesso!");
                  } else {
                    result = await createArticle(data);
                    setFeedback("Artigo criado com sucesso!");
                  }
                  setSelectedArticle(result);
                  articleListRef.current?.reload();
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
              previewOnTop={true}
            />
            {feedback && (
              <div className="text-center text-green-400 font-bold mt-2">
                {feedback}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
