"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/lib/types/article";
import { createArticle, updateArticle } from "@/lib/hooks/useArticles";
import StylePanel from "./StylePanel";
import PreviewCard from "./PreviewCard";
import * as Tabs from "@radix-ui/react-tabs";

// Schema de validação
const articleSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter no mínimo 3 caracteres"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().url("URL inválida").optional().or(z.literal("")),
  category: z.enum([
    "tecnologia",
    "noticias",
    "tutorial",
    "economia",
    "saude",
    "filmes-series",
    "viagens",
  ]),
  status: z.enum(["draft", "published", "archived"]),

  // Estilos
  titleColor: z.string(),
  titleFontSize: z.number().min(12).max(48),
  excerptColor: z.string(),
  excerptFontSize: z.number().min(10).max(24),
  bgColor: z.string(),
  bgOpacity: z.number().min(0).max(100),

  // Botão
  showButton: z.boolean(),
  buttonText: z.string(),
  buttonBgColor: z.string(),
  buttonTextColor: z.string(),
  buttonFontSize: z.number().min(10).max(24),
  buttonBorderRadius: z.number().min(0).max(50),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().url("URL inválida").optional().or(z.literal("")),

  // Extra
  subComponent: z.string().optional(),
  readTime: z.string(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleEditorProps {
  article?: Article;
  onSave?: (article: Article) => void;
}

export default function ArticleEditor({ article, onSave }: ArticleEditorProps) {
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!article);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          content: article.content || "",
          image: article.image || "",
          category: article.category,
          status: article.status,
          titleColor: article.titleColor,
          titleFontSize: article.titleFontSize,
          excerptColor: article.excerptColor,
          excerptFontSize: article.excerptFontSize,
          bgColor: article.bgColor,
          bgOpacity: article.bgOpacity,
          showButton: article.showButton,
          buttonText: article.buttonText,
          buttonBgColor: article.buttonBgColor,
          buttonTextColor: article.buttonTextColor,
          buttonFontSize: article.buttonFontSize,
          buttonBorderRadius: article.buttonBorderRadius,
          metaTitle: article.metaTitle || "",
          metaDescription: article.metaDescription || "",
          ogImage: article.ogImage || "",
          subComponent: article.subComponent || "",
          readTime: article.readTime,
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          image: "",
          category: "tecnologia",
          status: "draft",
          titleColor: "#1e293b",
          titleFontSize: 18,
          excerptColor: "#64748b",
          excerptFontSize: 14,
          bgColor: "#ffffff",
          bgOpacity: 100,
          showButton: false,
          buttonText: "Ver mais",
          buttonBgColor: "#3b82f6",
          buttonTextColor: "#ffffff",
          buttonFontSize: 14,
          buttonBorderRadius: 8,
          metaTitle: "",
          metaDescription: "",
          ogImage: "",
          subComponent: "",
          readTime: "5 min",
        },
  });

  // Watch para preview em tempo real
  const formData = watch();

  // Auto-gerar slug do título
  useEffect(() => {
    if (autoSlug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setValue("slug", slug);
    }
  }, [formData.title, autoSlug, setValue]);

  // Submit
  const onSubmit = async (data: ArticleFormData) => {
    setSaving(true);
    try {
      let savedArticle: Article;
      if (article) {
        // Update
        savedArticle = await updateArticle({
          id: article.id,
          ...data,
        } as UpdateArticleInput);
      } else {
        // Create
        savedArticle = await createArticle(data as CreateArticleInput);
      }
      alert("Artigo salvo com sucesso!");
      onSave?.(savedArticle);
    } catch (error: unknown) {
      console.error("Error saving article:", error);
      if (typeof error === "object" && error !== null) {
        const err = error as { message?: string; details?: string };
        if (err.message) {
          alert("Erro ao salvar artigo: " + err.message);
        } else if (err.details) {
          alert("Erro ao salvar artigo: " + err.details);
        } else {
          alert(
            "Erro ao salvar artigo. Verifique os campos obrigatórios e autenticação."
          );
        }
      } else {
        alert(
          "Erro ao salvar artigo. Verifique os campos obrigatórios e autenticação."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex">
          {article ? (
            "Editar Artigo"
          ) : (
            <span className="text-white">Novo Artigo</span>
          )}
        </h1>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setValue("status", "draft")}
            className="px-4 py-2 border border-[#4b6b57] bg-[#4b6b57] text-white rounded-lg text-sm font-medium hover:bg-[#355040] transition"
          >
            Salvar Rascunho
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#4b6b57] text-white rounded-lg text-sm font-medium hover:bg-[#355040] transition disabled:opacity-50"
          >
            {saving ? "Salvando..." : article ? "Atualizar" : "Publicar"}
          </button>
        </div>
      </div>

      <Tabs.Root defaultValue="content" className="w-full">
        <Tabs.List className="flex gap-2 border-b border-gray-200 mb-6">
          <Tabs.Trigger
            value="content"
            className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition"
          >
            📝 Conteúdo
          </Tabs.Trigger>
          <Tabs.Trigger
            value="style"
            className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition"
          >
            🎨 Estilos
          </Tabs.Trigger>
          <Tabs.Trigger
            value="seo"
            className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition"
          >
            🔍 SEO
          </Tabs.Trigger>
          <Tabs.Trigger
            value="preview"
            className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition"
          >
            👁️ Preview
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tab: Conteúdo */}
        <Tabs.Content value="content" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Título */}
            <div>
              <label className="text-sm font-medium text-white mb-2 flex">
                Título *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
                placeholder="Digite o título do artigo"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  {...register("slug")}
                  type="text"
                  disabled={autoSlug}
                  className="flex-1 px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent disabled:bg-[#23232a]"
                  placeholder="url-do-artigo"
                />
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                    autoSlug
                      ? "bg-green-600 text-white"
                      : "border border-green-400 text-green-700 hover:bg-green-100"
                  }`}
                >
                  Auto
                </button>
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Categoria e Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex">
                Categoria *
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
              >
                <option value="tecnologia">Tecnologia</option>
                <option value="noticias">Notícias</option>
                <option value="tutorial">Tutorial</option>
                <option value="economia">Economia</option>
                <option value="saude">Saúde</option>
                <option value="filmes-series">Filmes e Séries</option>
                <option value="viagens">Viagens</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
          </div>

          {/* Imagem */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex">
              Imagem (URL)
            </label>
            <input
              {...register("image")}
              type="text"
              className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex">
              Resumo
            </label>
            <textarea
              {...register("excerpt")}
              rows={3}
              className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent resize-none"
              placeholder="Breve resumo do artigo"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex">
              Conteúdo (Markdown/MDX)
            </label>
            <textarea
              {...register("content")}
              rows={12}
              className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent font-mono text-sm resize-none"
              placeholder="# Título do Artigo&#10;&#10;Escreva o conteúdo em Markdown..."
            />
          </div>

          {/* Read Time e Sub Component */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex">
                Tempo de Leitura
              </label>
              <input
                {...register("readTime")}
                type="text"
                className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
                placeholder="5 min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-componente (opcional)
              </label>
              <input
                {...register("subComponent")}
                type="text"
                className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
                placeholder="lista-top, destinos-imperdiveis..."
              />
            </div>
          </div>
        </Tabs.Content>

        {/* Tab: Estilos */}
        <Tabs.Content value="style">
          <StylePanel
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </Tabs.Content>

        {/* Tab: SEO */}
        <Tabs.Content value="seo" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              {...register("metaTitle")}
              type="text"
              className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
              placeholder="Título para SEO (deixe vazio para usar o título do artigo)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              {...register("metaDescription")}
              rows={3}
              className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent resize-none"
              placeholder="Descrição para motores de busca (150-160 caracteres)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Image (URL)
            </label>
            <input
              {...register("ogImage")}
              type="text"
              className="w-full px-4 py-2 border border-[#23232a] bg-[#27272a] text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-[#23232a] focus:border-transparent"
              placeholder="https://exemplo.com/og-image.jpg (1200x630px recomendado)"
            />
            {errors.ogImage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ogImage.message}
              </p>
            )}
          </div>
        </Tabs.Content>

        {/* Tab: Preview */}
        <Tabs.Content value="preview">
          <PreviewCard
            article={{
              ...formData,
              excerpt: formData.excerpt ?? undefined,
            }}
          />
        </Tabs.Content>
      </Tabs.Root>
    </form>
  );
}
