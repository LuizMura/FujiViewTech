"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ArtigoCard from "@/app/artigos/ArtigoCard";
import type { Article } from "@/lib/types/article";
import { createClient } from "@/lib/supabase/client";

// Tipos genéricos para os cards
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
  const [form, setForm] = useState<T>(initialData || ({} as T));

  // Atualiza o formulário quando initialData muda (ex: ao selecionar artigo)
  useEffect(() => {
    setForm(initialData || ({} as T));
  }, [initialData]);

  // Campos comuns
  const fields = [
    { name: "title", label: "Título", type: "text" },
    { name: "image", label: "Imagem (URL)", type: "text" },
    { name: "category", label: "Categoria", type: "text" },
    { name: "publishedAt", label: "Data de Publicação", type: "date" },
    { name: "readTime", label: "Tempo de Leitura", type: "text" },
    { name: "authorId", label: "Autor", type: "text" },
    { name: "excerpt", label: "Resumo", type: "textarea" },
    { name: "showAuthor", label: "Mostrar Autor", type: "checkbox" },
  ];

  // Campos específicos por tipo
  const extraFields: Record<string, any[]> = {
    ArtigoCard: [
      { name: "excerpt", label: "Resumo", type: "textarea" },
      { name: "views", label: "Visualizações", type: "number" },
    ],
    NoticiasCard: [
      { name: "source", label: "Fonte", type: "text" },
      { name: "publishedAt", label: "Data de Publicação", type: "date" },
    ],
    EconomiaCard: [
      { name: "price", label: "Preço", type: "number" },
      { name: "variation", label: "Variação (%)", type: "number" },
    ],
    CategoriaCard: [
      { name: "description", label: "Descrição", type: "textarea" },
    ],
  };

  // Remove campos duplicados pelo name
  const allFieldsMap = new Map();
  [...fields, ...(extraFields[cardType] || [])].forEach((field) => {
    if (!allFieldsMap.has(field.name)) {
      allFieldsMap.set(field.name, field);
    }
  });
  const allFields = Array.from(allFieldsMap.values());


  async function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, files } = e.target as HTMLInputElement & HTMLTextAreaElement;
    if (type === "file" && files && files[0]) {
      const supabase = createClient();
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload para o bucket 'Imagens ArtigoCard'
      const { data, error } = await supabase.storage
        .from('Imagens ArtigoCard')
        .upload(filePath, file, { upsert: true });

      if (error) {
        alert('Erro ao fazer upload da imagem: ' + error.message);
        return;
      }

      // Gerar URL pública
      const { data: publicUrlData } = supabase.storage
        .from('Imagens ArtigoCard')
        .getPublicUrl(filePath);

      setForm((prev) => ({
        ...prev,
        image: publicUrlData?.publicUrl || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  }

  // Handler específico para o conteúdo markdown
  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setForm((prev) => ({
      ...prev,
      content: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Preview à esquerda */}
      <div className="flex-[2.5]  h-full bg-[#f3f4f6] flex flex-col justify-start items-stretch p-0 m-0">
        {/* Preview ocupa todo o espaço */}
        {cardType === "ArtigoCard" && (
          <div className="p-6">
            <ArtigoCard post={form as Article} showAuthor={true} />
            {form.content && (
              <div className="prose prose-lg max-w-none mt-8 px-2 text-black">
                <ReactMarkdown>{form.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
        {cardType === "NoticiasCard" && (
          <div className="w-full">
            {form.image && (
              <img src={form.image} alt="Imagem" className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <div className="font-bold text-lg text-[#e3e8f0] mb-1">{form.title || "Título da Notícia"}</div>
            <div className="text-xs text-[#7f8fa6] mb-2">{form.category || "Categoria"}</div>
            <div className="text-[#bfc7d5] mb-2">{form.source || "Fonte da notícia"}</div>
            <div className="text-xs text-[#bfc7d5]">Publicado em: {form.publishedAt || "-"}</div>
          </div>
        )}
        {cardType === "EconomiaCard" && (
          <div className="w-full">
            {form.image && (
              <img src={form.image} alt="Imagem" className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <div className="font-bold text-lg text-[#e3e8f0] mb-1">{form.title || "Título do Card"}</div>
            <div className="text-xs text-[#7f8fa6] mb-2">{form.category || "Categoria"}</div>
            <div className="text-[#bfc7d5] mb-2">Preço: R$ {form.price || 0}</div>
            <div className="text-xs text-[#bfc7d5]">Variação: {form.variation || 0}%</div>
          </div>
        )}
        {cardType === "CategoriaCard" && (
          <div className="w-full">
            <div className="font-bold text-lg text-[#e3e8f0] mb-1">{form.title || "Nome da Categoria"}</div>
            <div className="text-[#bfc7d5] mb-2">{form.description || "Descrição da categoria..."}</div>
          </div>
        )}
      </div>
      {/* Formulário à direita */}
      <form onSubmit={handleSubmit} className="bg-[#23272f] p-4 rounded-xl shadow-lg w-full max-w-md">
        {allFields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="block text-[#bfc7d5] mb-1" htmlFor={field.name}>{field.label}</label>
            {field.name === "image" ? (
              <>
                <input
                  id={field.name}
                  name={field.name}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className="mt-2 max-h-40 rounded-lg border border-[#4b6b57]" />
                )}
              </>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
              />
            )}
          </div>
        ))}
        {/* Editor markdown para conteúdo do artigo */}
        <div className="mb-3">
          <label className="block text-[#bfc7d5] mb-1" htmlFor="content">Conteúdo do Artigo (Markdown)</label>
          <textarea
            id="content"
            name="content"
            value={form.content || ""}
            onChange={handleContentChange}
            rows={10}
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none font-mono"
            placeholder={"Digite o conteúdo do artigo em Markdown..."}
          />
        </div>
        {/* Preview markdown */}
        {form.content && (
          <div className="mb-3">
            <div className="block text-[#bfc7d5] mb-1 font-bold">Preview do Conteúdo</div>
            <div className="prose prose-invert bg-[#18181b] rounded-lg p-3 border border-[#4b6b57] max-h-64 overflow-auto">
              <ReactMarkdown>{form.content}</ReactMarkdown>
            </div>
          </div>
        )}
        <button type="submit" className="w-full mt-4 py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-bold hover:bg-[#596275] transition">Salvar</button>
      </form>
    </div>
  );
}
