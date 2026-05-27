"use client";
import { createClient } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/hooks/useArticles";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FIXED_CATEGORIES,
  getCategoryLabelBySlug,
  normalizeCategorySlug,
} from "@/lib/constants/categories";

interface CardBase {
  title: string;
  image?: string;
  category?: string;
  [key: string]: unknown;
}

interface Afiliado {
  id: string;
  titulo: string;
  categoria: string;
  button_text?: string;
  button_color?: string;
  afiliado_url?: string;
  imagem?: string;
  descricao?: string;
  loja?: string;
  preco?: string;
}

interface ArticleFormProps<T extends CardBase> {
  form: T;
  cardType: string;
  onFormChange: (field: string, value: unknown) => void;
  onImageUpload: (url: string) => void;
  onMdxImageUpload: (url: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

type FieldConfig = {
  name: string;
  label: string;
  type: string;
  options?: string[];
};

const fields = [
  { name: "title", label: "Título", type: "text" },
  { name: "slug", label: "Slug (URL)", type: "text" },
  { name: "excerpt", label: "Resumo", type: "textarea" },
  { name: "image", label: "Imagem (URL)", type: "text" },
  {
    name: "author",
    label: "Autor",
    type: "text",
  },
  { name: "category", label: "Categoria", type: "text" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["draft", "published", "archived"],
  },
  { name: "publishedAt", label: "Data de Publicação", type: "date" },
  { name: "readTime", label: "Tempo de Leitura", type: "text" },
];

const extraFields: Record<string, FieldConfig[]> = {
  ArtigoCard: [],
  NoticiasCard: [
    { name: "source", label: "Fonte", type: "text" },
    { name: "publishedAt", label: "Data de Publicação", type: "date" },
  ],
  CategoriaCard: [
    { name: "description", label: "Descrição", type: "textarea" },
  ],
};

export default function ArticleForm<T extends CardBase>({
  form,
  cardType,
  onFormChange,
  onImageUpload,
  onMdxImageUpload,
  onContentChange,
  onSubmit,
}: ArticleFormProps<T>) {
  type EditorTab = "cover" | "templates" | "editor";
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const [selectedAfiliadoId, setSelectedAfiliadoId] = useState<string>("");
  const [selectedMdxTemplate, setSelectedMdxTemplate] = useState<string>("");
  const [mdxImageSide, setMdxImageSide] = useState<"left" | "right">("left");
  const [mdxButtonText, setMdxButtonText] = useState<string>("");
  const [mdxButtonUrl, setMdxButtonUrl] = useState<string>("");
  const [mdxAmazonUrl, setMdxAmazonUrl] = useState<string>("");
  const [mdxMercadoLivreUrl, setMdxMercadoLivreUrl] = useState<string>("");
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);
  const [buttonTemplateCopied, setButtonTemplateCopied] = useState(false);
  const [priceTemplateCopied, setPriceTemplateCopied] = useState(false);
  const [contentSanitized, setContentSanitized] = useState(false);
  const [loadingAfiliados, setLoadingAfiliados] = useState(false);
  const [categories] = useState<string[]>(
    FIXED_CATEGORIES.map((category) => category.slug),
  );
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [savingSubcategory, setSavingSubcategory] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>("cover");
  const showTabs = cardType === "ArtigoCard";

  // Carrega afiliados
  useEffect(() => {
    async function loadAfiliados() {
      setLoadingAfiliados(true);
      try {
        const res = await fetch("/api/afiliados");
        const data = await res.json();
        setAfiliados(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar afiliados", error);
      } finally {
        setLoadingAfiliados(false);
      }
    }
    loadAfiliados();
  }, []);

  useEffect(() => {
    async function loadSubcategories() {
      try {
        const selectedCategory = normalizeCategorySlug(
          String(form.category || ""),
        );

        if (!selectedCategory) {
          setSubcategories([]);
          return;
        }

        const response = await fetch(
          `/api/content/subcategories?category=${encodeURIComponent(selectedCategory)}&includeUnused=1`,
        );
        const data = await response.json();

        if (!response.ok) {
          setSubcategories([]);
          return;
        }

        const names: string[] = Array.from(
          new Set(
            (data?.items || [])
              .map((item: { name?: string }) => String(item?.name || "").trim())
              .filter(Boolean),
          ),
        );
        setSubcategories(names);
      } catch {
        setSubcategories([]);
      }
    }

    loadSubcategories();
  }, [form.category]);

  const persistCurrentSubcategory = async () => {
    const currentCategory = normalizeCategorySlug(String(form.category || ""));
    const currentSubcategory = String(form.subcategory || "").trim();

    if (!currentCategory || !currentSubcategory || savingSubcategory) {
      return;
    }

    setSavingSubcategory(true);
    try {
      const response = await fetch("/api/content/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: currentCategory,
          name: currentSubcategory,
        }),
      });

      if (!response.ok) {
        return;
      }

      setSubcategories((prev) => {
        if (prev.includes(currentSubcategory)) return prev;
        return [...prev, currentSubcategory].sort((a, b) =>
          a.localeCompare(b, "pt-BR"),
        );
      });
    } finally {
      setSavingSubcategory(false);
    }
  };

  const categoriasSugeridas = useMemo(
    () =>
      Array.from(new Set(afiliados.map((a) => a.categoria).filter(Boolean))),
    [afiliados],
  );

  const afiliadosFiltrados = useMemo(() => {
    if (!filterCategoria) return afiliados;
    return afiliados.filter((a) => a.categoria === filterCategoria);
  }, [afiliados, filterCategoria]);

  const selectedAfiliado = useMemo(
    () => afiliadosFiltrados.find((a) => a.id === selectedAfiliadoId),
    [afiliadosFiltrados, selectedAfiliadoId],
  );

  const copyAffiliateMdx = (afiliado: Afiliado) => {
    const esc = (v: string | number | null | undefined) =>
      String(v ?? "").replace(/'/g, "\\'");
    const legacyBlue = "#3b82f6";
    const currentColor = (afiliado.button_color || "").trim();
    const normalizedColor =
      currentColor.toLowerCase() === legacyBlue
        ? "#ac3e3e"
        : currentColor || "#ac3e3e";
    const mdxCode = `<AfiliadosCard
  titulo='${esc(afiliado.titulo)}'
  descricao='${esc(afiliado.descricao || "Descrição do produto")}'
  loja='${esc(afiliado.loja || "Loja")}'
  preco='${esc(afiliado.preco || "R$ 0,00")}'
  imagem='${esc(afiliado.imagem || "/images/og-default.png")}'
  afiliados={[
    {
      nome: '${esc(afiliado.titulo)}',
      url: '${esc(afiliado.afiliado_url || "#")}',
      texto: '${esc(afiliado.button_text || "COMPRAR")}',
      cor: '${esc(normalizedColor)}'
    }
  ]}
/>`;
    navigator.clipboard.writeText(mdxCode);
    setAffiliateCopied(true);
    window.setTimeout(() => setAffiliateCopied(false), 1800);
  };

  const contentValue = String(form.content ?? "");
  const mdxImageUrlValue = String(
    form.mdxImageUrl || form.mdxImage || "",
  ).trim();
  const mdxImageLinkValue = String(form.mdxImageLink || "").trim();

  const copyButtonTemplate = () => {
    const buttonText = mdxButtonText.trim();
    const buttonUrl = mdxButtonUrl.trim() || "https://exemplo.com";
    const esc = (v: string) => v.replace(/"/g, '\\"');
    const mdxTemplate = `<ArticleButton\n  text=\"${esc(buttonText)}\"\n  url=\"${esc(buttonUrl)}\"\n/>`;

    navigator.clipboard.writeText(mdxTemplate);
    setButtonTemplateCopied(true);
    window.setTimeout(() => setButtonTemplateCopied(false), 1800);
  };

  const copyPriceLinksTemplate = () => {
    const amazonUrl = mdxAmazonUrl.trim();
    const mercadoLivreUrl = mdxMercadoLivreUrl.trim();
    const esc = (v: string) => v.replace(/"/g, '\\"');

    const mdxTemplate = `<AffiliatePriceLinks\n  label=\"Ver preço\"\n  amazonUrl=\"${esc(amazonUrl)}\"\n  mercadoLivreUrl=\"${esc(mercadoLivreUrl)}\"\n/>`;

    navigator.clipboard.writeText(mdxTemplate);
    setPriceTemplateCopied(true);
    window.setTimeout(() => setPriceTemplateCopied(false), 1800);
  };

  const sanitizeMdxContent = () => {
    const raw = String(form.content ?? "");
    const sanitized = raw
      .replace(
        /<ProductRow\s*\n\s*image="\s*\n\s*>/g,
        '<ProductRow\n  title="Nome do produto"\n  image=""\n>',
      )
      .replace(/\r\n?/g, "\n")
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
      .replace(/[\u2028\u2029]/g, "\n")
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]+$/gm, "");

    onContentChange(sanitized);
    setContentSanitized(true);
    window.setTimeout(() => setContentSanitized(false), 1800);
  };

  // Remove campos duplicados pelo name
  const allFieldsMap = new Map();
  [...fields, ...(extraFields[cardType] || [])].forEach((field) => {
    if (!allFieldsMap.has(field.name)) {
      allFieldsMap.set(field.name, field);
    }
  });
  const allFields = Array.from(allFieldsMap.values());

  const buildSafeStorageFileName = (originalName: string) => {
    const trimmed = String(originalName || "").trim();
    const dotIndex = trimmed.lastIndexOf(".");
    const hasExt = dotIndex > 0 && dotIndex < trimmed.length - 1;
    const rawBase = hasExt ? trimmed.slice(0, dotIndex) : trimmed;
    const rawExt = hasExt ? trimmed.slice(dotIndex + 1) : "";

    const safeBase = rawBase
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    const safeExt = rawExt
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

    const base = safeBase || "arquivo";
    const suffix = Date.now();

    return safeExt ? `${base}-${suffix}.${safeExt}` : `${base}-${suffix}`;
  };

  const buildMdxImageSnippet = (url: string, originalName: string) => {
    const baseName = String(originalName || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    const alt = baseName || "Imagem";
    return `![${alt}](${url})`;
  };

  const buildTemplateWithImageUrl = (
    template: string,
    imageUrl: string,
    imageLink?: string,
    side: "left" | "right" = "left",
  ) => {
    const safeUrl = imageUrl.trim();
    const safeLink = String(imageLink || "").trim();

    if (template === "WrapImageText") {
      return `<WrapImageText
  src="${safeUrl}"
  alt="Descrição da imagem"
  side="${side}"
  width={320}
  height={200}
  caption="Legenda opcional"
>
Texto do artigo ao redor da imagem.
</WrapImageText>`;
    }

    if (template === "ProductRow") {
      const productUrlLine = safeLink ? `\n  url="${safeLink}"` : "";
      return `## Título
<ProductRow
  title="Nome do produto"
  image="${safeUrl}"${productUrlLine}
>

### Ficha Técnica
- **Marca:** Exemplo
</ProductRow>`;
    }

    if (safeLink) {
      return `[![Imagem](${safeUrl})](${safeLink})`;
    }

    return `![Imagem](${safeUrl})`;
  };

  const copySelectedTemplateWithImageUrl = () => {
    const imageUrl = mdxImageUrlValue;
    if (!imageUrl) return;

    const template = selectedMdxTemplate || "MarkdownImage";
    const snippet = buildTemplateWithImageUrl(
      template,
      imageUrl,
      mdxImageLinkValue,
      mdxImageSide,
    );
    navigator.clipboard.writeText(snippet);
    setTemplateCopied(true);
    window.setTimeout(() => setTemplateCopied(false), 1800);
  };

  const appendSnippetToContent = (snippet: string) => {
    const currentContent = String(form.content || "");
    const alreadyExists = currentContent.includes(snippet);

    if (alreadyExists) return;

    const separator =
      currentContent.trim().length === 0
        ? ""
        : currentContent.endsWith("\n")
          ? "\n"
          : "\n\n";

    onContentChange(`${currentContent}${separator}${snippet}\n`);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isMdx: boolean,
  ) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const supabase = createClient();
    const file = files[0];
    const safeFileName = buildSafeStorageFileName(file.name);
    const filePath = isMdx ? `mdx/${safeFileName}` : safeFileName;

    const { error } = await supabase.storage
      .from("artigos")
      .upload(filePath, file, { upsert: true });

    if (error) {
      alert(`Erro ao fazer upload da imagem: ${error.message}`);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("artigos")
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl || "";

    if (isMdx) {
      onMdxImageUpload(publicUrl);
      onFormChange("mdxImageUrl", publicUrl);
      if (publicUrl) {
        const snippet = buildMdxImageSnippet(publicUrl, file.name);
        appendSnippetToContent(snippet);
      }
      if (publicUrl) {
        void navigator.clipboard.writeText(publicUrl);
      }
    } else {
      onImageUpload(publicUrl);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const typedValue = type === "number" ? Number(value) : value;
    onFormChange(name, typedValue);

    // Auto-gerar slug quando título mudar (apenas se slug estiver vazio)
    if (name === "title" && !form.slug) {
      const newSlug = await generateUniqueSlug(value);
      onFormChange("slug", newSlug);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#23272f] p-4 rounded-xl shadow-lg w-full overflow-y-auto"
    >
      {showTabs && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#18181b] p-1 border border-[#4b6b57]">
            <button
              type="button"
              onClick={() => setActiveTab("cover")}
              className={`px-2 py-2 rounded-md text-xs md:text-sm font-semibold transition ${
                activeTab === "cover"
                  ? "bg-[#7f8fa6] text-[#23272f]"
                  : "text-[#bfc7d5] hover:bg-[#2a2f39]"
              }`}
            >
              Capa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`px-2 py-2 rounded-md text-xs md:text-sm font-semibold transition ${
                activeTab === "templates"
                  ? "bg-[#7f8fa6] text-[#23272f]"
                  : "text-[#bfc7d5] hover:bg-[#2a2f39]"
              }`}
            >
              MDX Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`px-2 py-2 rounded-md text-xs md:text-sm font-semibold transition ${
                activeTab === "editor"
                  ? "bg-[#7f8fa6] text-[#23272f]"
                  : "text-[#bfc7d5] hover:bg-[#2a2f39]"
              }`}
            >
              MDX Editor
            </button>
          </div>
        </div>
      )}

      {(!showTabs || activeTab === "cover") &&
        allFields.map((field, index) => {
          const isSecondOfPair = field.name === "readTime";

          // Agrupa publishedAt e readTime
          if (isSecondOfPair && index > 0) {
            const prevField = allFields[index - 1];
            const isPrevPublishedAt = prevField.name === "publishedAt";

            // Se readTime e anterior é publishedAt, ele já foi renderizado ao lado
            if (field.name === "readTime" && isPrevPublishedAt) {
              return null; // já foram renderizados junto com seus pares
            }
          }

          const fieldValue = form[field.name];

          return (
            <div
              key={field.name}
              className={`${
                field.name === "category" || field.name === "publishedAt"
                  ? "grid grid-cols-2 gap-2 mb-3"
                  : "mb-3"
              }`}
            >
              {/* Campo atual */}
              <div>
                <label
                  className="block text-[#bfc7d5] mb-1"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                {field.name === "category" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={String(fieldValue ?? "")}
                    onChange={handleChange}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="text-black">
                        {getCategoryLabelBySlug(cat)}
                      </option>
                    ))}
                  </select>
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={String(
                      fieldValue ??
                        (field.name === "status"
                          ? "published"
                          : (field.options?.[0] ?? "")),
                    )}
                    onChange={handleChange}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                  >
                    {(field.options || []).map((opt: string) => (
                      <option key={opt} value={opt} className="text-black">
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={String(fieldValue ?? "")}
                    onChange={handleChange}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.name === "author" ? "Luiz Murakami" : ""}
                    value={
                      field.type === "number"
                        ? typeof fieldValue === "number"
                          ? fieldValue
                          : Number(fieldValue ?? 0)
                        : String(fieldValue ?? "")
                    }
                    onChange={handleChange}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                  />
                )}
              </div>

              {/* Se é categoria, renderiza subcategoria ao lado */}
              {field.name === "category" && (
                <div>
                  <div className="flex items-end justify-between gap-2 mb-1">
                    <label
                      className="block text-[#bfc7d5]"
                      htmlFor="subcategory"
                    >
                      Subcategoria
                    </label>
                    <button
                      type="button"
                      onClick={persistCurrentSubcategory}
                      disabled={!form.category || savingSubcategory}
                      className="text-xs px-2 py-1 rounded bg-[#2a2f39] text-[#bfc7d5] hover:bg-[#3a4352] disabled:opacity-50"
                    >
                      {savingSubcategory
                        ? "Salvando..."
                        : "Salvar subcategoria"}
                    </button>
                  </div>
                  <input
                    id="subcategory"
                    name="subcategory"
                    type="text"
                    list="subcategory-options"
                    value={String(form.subcategory ?? "")}
                    onChange={handleChange}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                    placeholder="Ex.: smartphones"
                  />
                  <datalist id="subcategory-options">
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub} />
                    ))}
                  </datalist>
                </div>
              )}

              {/* Brand + Tags ao lado de subcategoria (abaixo da linha categoria/subcategoria) */}
              {field.name === "category" && (
                <div className="col-span-2 grid grid-cols-2 gap-2 mt-0">
                  {/* Brand */}
                  <div>
                    <label
                      className="block text-[#bfc7d5] mb-1"
                      htmlFor="brand"
                    >
                      Brand
                    </label>
                    <input
                      id="brand"
                      name="brand"
                      type="text"
                      value={String(form.brand ?? "")}
                      onChange={handleChange}
                      className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                      placeholder="Ex.: Samsung, Apple…"
                    />
                  </div>
                  {/* Tags */}
                  <div>
                    <label
                      className="block text-[#bfc7d5] mb-1"
                      htmlFor="tags-input"
                    >
                      Tags{" "}
                      <span className="text-xs text-[#7f8fa6]">
                        (separadas por vírgula)
                      </span>
                    </label>
                    <input
                      id="tags-input"
                      type="text"
                      value={
                        Array.isArray(form.tags)
                          ? (form.tags as string[]).join(", ")
                          : String(form.tags ?? "")
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        const arr = raw.split(",").map((t) => t.trimStart());
                        onFormChange("tags", arr);
                      }}
                      className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                      placeholder="Ex.: android, 5g, câmera"
                    />
                  </div>
                </div>
              )}

              {/* Se é publishedAt, renderiza readTime ao lado */}
              {field.name === "publishedAt" && (
                <div>
                  <label
                    className="block text-[#bfc7d5] mb-1"
                    htmlFor="readTime"
                  >
                    Tempo de Leitura
                  </label>
                  <input
                    id="readTime"
                    name="readTime"
                    type="text"
                    value={String(form.readTime ?? "")}
                    onChange={handleChange}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                  />
                </div>
              )}

              {/* Upload imagem principal - aparece após o campo Imagem (URL) */}
              {field.name === "image" && (
                <div className="mb-3">
                  <label
                    className="block text-[#bfc7d5] mb-1"
                    htmlFor="image-upload"
                  >
                    Upload Imagem Capa
                  </label>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}

      {/* Upload imagem MDX */}
      {(!showTabs || activeTab === "templates") && (
        <>
          <div className="mb-3 border border-[#4b6b57] rounded-lg p-3 bg-[#1c212a]">
            <h3 className="text-[#bfc7d5] font-semibold mb-2">
              Imagens no MDX
            </h3>

            <div className="mt-3">
              <label
                className="block text-[#bfc7d5] mb-1"
                htmlFor="mdx-template-select"
              >
                Template
              </label>
              <select
                id="mdx-template-select"
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                value={selectedMdxTemplate}
                onChange={(e) => setSelectedMdxTemplate(e.target.value)}
              >
                <option value="MarkdownImage">Imagen tela inteira</option>
                <option value="WrapImageText">Imagem lateral</option>
                <option value="ProductRow">ProductRow</option>
              </select>
            </div>

            {selectedMdxTemplate === "WrapImageText" && (
              <div className="mt-3">
                <label
                  className="block text-[#bfc7d5] mb-1"
                  htmlFor="mdx-image-side"
                >
                  Posição da imagem
                </label>
                <select
                  id="mdx-image-side"
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                  value={mdxImageSide}
                  onChange={(e) =>
                    setMdxImageSide(e.target.value as "left" | "right")
                  }
                >
                  <option value="left">Esquerda</option>
                  <option value="right">Direita</option>
                </select>
              </div>
            )}

            <label
              className="block text-[#bfc7d5] mb-1"
              htmlFor="mdx-image-upload"
            >
              Upload Imagem para MDX
            </label>
            <input
              id="mdx-image-upload"
              name="mdx-image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, true)}
              className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
            />

            {Boolean(form.mdxImage) && (
              <div className="mt-3 flex items-center gap-2">
                <Image
                  src={String(form.mdxImage)}
                  alt="Preview MDX"
                  width={128}
                  height={128}
                  unoptimized
                  className="max-h-32 h-auto w-auto rounded border border-[#4b6b57]"
                />
              </div>
            )}

            <div className="mt-3">
              <label
                className="block text-[#bfc7d5] mb-1"
                htmlFor="mdxImageUrl"
              >
                URL da imagem MDX
              </label>
              <input
                id="mdxImageUrl"
                name="mdxImageUrl"
                type="text"
                value={String(form.mdxImageUrl ?? "")}
                onChange={handleChange}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="mt-3">
              <label
                className="block text-[#bfc7d5] mb-1"
                htmlFor="mdxImageLink"
              >
                Link da imagem (opcional)
              </label>
              <input
                id="mdxImageLink"
                name="mdxImageLink"
                type="text"
                value={String(form.mdxImageLink ?? "")}
                onChange={handleChange}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                placeholder="https://exemplo.com/destino"
              />
            </div>

            <div className="mt-3">
              <button
                type="button"
                disabled={!mdxImageUrlValue}
                onClick={copySelectedTemplateWithImageUrl}
                className="w-full px-3 py-2 bg-[#eebbc3] text-[#232946] rounded text-xs font-semibold disabled:opacity-50"
              >
                Copiar link
              </button>
              {templateCopied && (
                <p className="mt-2 text-xs text-green-400">
                  Código copiado com a URL da imagem!
                </p>
              )}
            </div>
          </div>

          {/* Afiliados Cadastrados */}
          <div className="mb-3 border-t border-[#4b6b57] pt-4">
            <h3 className="text-[#bfc7d5] font-semibold mb-2">
              Afiliados Cadastrados
            </h3>

            {/* Filtro */}
            <select
              className="w-full mb-2 bg-[#18181b] text-white px-3 py-1.5 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
              value={filterCategoria}
              onChange={(e) => {
                setFilterCategoria(e.target.value);
                setSelectedAfiliadoId("");
              }}
            >
              <option value="">Todas as categorias</option>
              {categoriasSugeridas.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {loadingAfiliados ? (
              <div className="text-[#9ca3af] text-xs p-2 border border-[#4b6b57] rounded-lg">
                Carregando...
              </div>
            ) : !afiliadosFiltrados.length ? (
              <div className="text-[#9ca3af] text-xs p-2 border border-[#4b6b57] rounded-lg">
                {filterCategoria
                  ? `Nenhum afiliado na categoria "${filterCategoria}"`
                  : "Nenhum afiliado encontrado"}
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                  value={selectedAfiliadoId}
                  onChange={(e) => setSelectedAfiliadoId(e.target.value)}
                >
                  <option value="">Selecione um afiliado...</option>
                  {afiliadosFiltrados.map((afiliado) => (
                    <option key={afiliado.id} value={afiliado.id}>
                      {afiliado.titulo} - {afiliado.categoria}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!selectedAfiliado}
                  onClick={() =>
                    selectedAfiliado && copyAffiliateMdx(selectedAfiliado)
                  }
                  className="w-full py-2 bg-[#eebbc3] text-[#232946] rounded-lg font-semibold hover:bg-[#d9aab2] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Copiar código MDX
                </button>
                {affiliateCopied && (
                  <p className="text-xs text-green-400">Código MDX copiado!</p>
                )}
              </div>
            )}
          </div>

          {/* Templates MDX */}
          <div className="mb-3 border-t border-[#4b6b57] pt-4">
            <h3 className="text-[#bfc7d5] font-semibold mb-2">Botao MDX</h3>

            <div className="space-y-2 mb-4">
              <input
                type="text"
                value={mdxButtonText}
                onChange={(e) => setMdxButtonText(e.target.value)}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                placeholder="Texto do botao"
              />
              <input
                type="url"
                value={mdxButtonUrl}
                onChange={(e) => setMdxButtonUrl(e.target.value)}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                placeholder="https://seu-link.com"
              />
              <button
                type="button"
                onClick={copyButtonTemplate}
                className="w-full py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-semibold hover:bg-[#596275] transition"
              >
                Copiar botao MDX
              </button>
              {buttonTemplateCopied && (
                <p className="text-xs text-green-400">Botao MDX copiado!</p>
              )}
            </div>

            <h3 className="text-[#bfc7d5] font-semibold mb-2">Ver preço</h3>

            <div className="space-y-2 mb-4">
              <input
                type="url"
                value={mdxAmazonUrl}
                onChange={(e) => setMdxAmazonUrl(e.target.value)}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                placeholder="URL afiliado Amazon"
              />
              <input
                type="url"
                value={mdxMercadoLivreUrl}
                onChange={(e) => setMdxMercadoLivreUrl(e.target.value)}
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
                placeholder="URL afiliado Mercado Livre"
              />
              <button
                type="button"
                onClick={copyPriceLinksTemplate}
                className="w-full py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-semibold hover:bg-[#596275] transition"
              >
                Copiar template Ver preço
              </button>
              {priceTemplateCopied && (
                <p className="text-xs text-green-400">
                  Template Ver preço copiado!
                </p>
              )}
            </div>

            <h3 className="text-[#bfc7d5] font-semibold mb-2">
              Templates de MDX
            </h3>
          </div>
        </>
      )}

      {/* Editor Markdown */}
      {(!showTabs || activeTab === "editor") && (
        <div className="mb-3 w-full">
          <div className="mb-1 flex items-center justify-between gap-2">
            <label className="block text-[#bfc7d5]" htmlFor="content">
              Conteúdo do Artigo (Markdown)
            </label>
            <button
              type="button"
              onClick={sanitizeMdxContent}
              className="px-2 py-1 text-xs bg-[#eebbc3] text-[#232946] rounded hover:bg-[#d9aab2] transition"
            >
              Limpar formatação
            </button>
          </div>
          <div className="flex w-full min-w-0 bg-[#18181b] text-white rounded-lg border border-[#4b6b57] focus-within:border-[#6b8c77] overflow-hidden">
            <textarea
              id="content"
              name="content"
              value={contentValue}
              onChange={(e) => onContentChange(e.target.value)}
              rows={14}
              className="min-w-0 flex-1 bg-transparent text-white px-3 py-1.5 focus:outline-none font-mono text-sm leading-6"
              placeholder="Digite o conteúdo do artigo em Markdown..."
            />
          </div>
          {contentSanitized && (
            <p className="mt-2 text-xs text-green-400">
              Formatação invisível removida do conteúdo.
            </p>
          )}
        </div>
      )}

      {/* Botões */}
      <button
        type="submit"
        className="w-full mt-4 py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-bold hover:bg-[#596275] transition"
      >
        Salvar
      </button>
      {Boolean(form.slug) && (
        <a
          href={`/artigos/${String(form.slug)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 py-2 bg-[#eebbc3] text-[#232946] rounded-lg font-bold hover:bg-[#d4a5b3] transition text-center block"
        >
          Ver Artigo
        </a>
      )}
    </form>
  );
}
