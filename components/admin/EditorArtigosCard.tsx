"use client";
import React, { useState, useEffect } from "react";
import ArticleForm from "./ArticleForm";
import ArticlePreview from "./ArticlePreview";

interface CardBase {
  title: string;
  image?: string;
  category?: string;
  [key: string]: any;
}

interface EditorProps<T extends CardBase> {
  cardType: string;
  initialData?: T;
  onSave: (data: T) => void;
}

interface EditorArtigosCardProps<T extends CardBase> extends EditorProps<T> {
  previewOnTop?: boolean;
}

export default function EditorArtigosCard<T extends CardBase>({
  cardType,
  initialData,
  onSave,
  previewOnTop = false,
}: EditorArtigosCardProps<T>) {
  const [form, setForm] = useState<T>(
    initialData || ({ status: "published" } as unknown as T)
  );

  // Atualiza o formulário quando initialData muda
  useEffect(() => {
    setForm(initialData || ({ status: "published" } as unknown as T));
  }, [initialData]);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setForm((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleMdxImageUpload = (url: string) => {
    setForm((prev) => ({
      ...prev,
      mdxImage: url,
    }));
  };

  const handleContentChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Preview ocupando 2 colunas */}
      <div className="flex-[2.5] h-full">
        <ArticlePreview cardType={cardType} form={form} />
      </div>

      {/* Formulário ocupando 1 coluna */}
      <div className="flex-1 h-full">
        <ArticleForm
          form={form}
          cardType={cardType}
          onFormChange={handleFormChange}
          onImageUpload={handleImageUpload}
          onMdxImageUpload={handleMdxImageUpload}
          onContentChange={handleContentChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
