"use client";

import AdminHeader from "../AdminHeader";
import { useState } from "react";
import ArticleList from "@/components/admin/ArticleList";
import EditorArtigosCard from "@/components/admin/EditorArtigosCard";


export default function AdminArtigosPage() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  return (
    <div className="min-h-screen bg-[#23272f] flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-10 gap-6">
              <div className="col-span-2 h-full">
            <ArticleList
              onSelect={(id, data) => setSelectedArticle(data)}
              selectedId={selectedArticle?.id || null}
              onNew={() => setSelectedArticle(null)}
              onDelete={async () => {
                if (!window.confirm('Tem certeza que deseja excluir este artigo?')) return;
                setLoadingAction(true);
                setFeedback(null);
                setTimeout(() => {
                  setFeedback('Artigo excluído (simulação).');
                  setSelectedArticle(null);
                  setLoadingAction(false);
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
                setTimeout(() => {
                  setFeedback(selectedArticle ? 'Artigo atualizado (simulação).' : 'Artigo criado (simulação).');
                  setLoadingAction(false);
                }, 1000);
              }}
              previewOnTop={true}
            />
            {feedback && (
              <div className="text-center text-green-400 font-bold mt-2">{feedback}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
