"use client";
import { createClient } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/hooks/useArticles";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";

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
  EconomiaCard: [
    { name: "price", label: "Preço", type: "number" },
    { name: "variation", label: "Variação (%)", type: "number" },
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
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const [selectedAfiliadoId, setSelectedAfiliadoId] = useState<string>("");
  const [selectedMdxTemplate, setSelectedMdxTemplate] = useState<string>("");
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);
  const [contentSanitized, setContentSanitized] = useState(false);
  const [loadingAfiliados, setLoadingAfiliados] = useState(false);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

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
  const totalLines = Math.max(1, contentValue.split("\n").length);
  const lineNumbers = Array.from({ length: totalLines }, (_, i) => i + 1).join(
    "\n",
  );

  const copyMdxTemplate = (template: string) => {
    if (template === "ProductRow") {
      const mdxTemplate = `## Título
<ProductRow
image="
">

### Ficha Técnica
- ** 
</ProductRow>`;
      navigator.clipboard.writeText(mdxTemplate);
      setTemplateCopied(true);
      window.setTimeout(() => setTemplateCopied(false), 1800);
      return;
    }

    if (template === "WrapImageText") {
      const mdxTemplate = `## Seção Com Imagem Lateral

<WrapImageText
  src="https://exemplo.com/minha-imagem.jpg"
  // ou use caminho local: /images/minha-imagem.jpg
  alt="Descrição da imagem"
  side="left"
  width={320}
  height={200}
  caption="Legenda opcional"
>
Texto do artigo ao redor da imagem. Você pode escrever parágrafos maiores aqui e eles vão contornar a imagem no desktop.

No mobile, a imagem fica acima e o texto segue abaixo para manter a leitura confortável.
</WrapImageText>`;
      navigator.clipboard.writeText(mdxTemplate);
      setTemplateCopied(true);
      window.setTimeout(() => setTemplateCopied(false), 1800);
    }
  };

  const sanitizeMdxContent = () => {
    const raw = String(form.content ?? "");
    const sanitized = raw
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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isMdx: boolean,
  ) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const supabase = createClient();
    const file = files[0];
    const filePath = isMdx ? `mdx/${file.name}` : file.name;

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

    if (isMdx) {
      onMdxImageUpload(publicUrlData?.publicUrl || "");
    } else {
      onImageUpload(publicUrlData?.publicUrl || "");
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
      {allFields.map((field, index) => {
        const isSecondOfPair =
          field.name === "status" || field.name === "readTime";

        // Agrupa categoria e status / publishedAt e readTime
        if (isSecondOfPair && index > 0) {
          const prevField = allFields[index - 1];
          const isPrevCategory = prevField.name === "category";
          const isPrevPublishedAt = prevField.name === "publishedAt";

          // Se é status e campo anterior é categoria, ou readTime e anterior é publishedAt
          if (
            (field.name === "status" && isPrevCategory) ||
            (field.name === "readTime" && isPrevPublishedAt)
          ) {
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
              <label className="block text-[#bfc7d5] mb-1" htmlFor={field.name}>
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={String(fieldValue ?? "published")}
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

            {/* Se é categoria, renderiza status ao lado */}
            {field.name === "category" && (
              <div>
                <label className="block text-[#bfc7d5] mb-1" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={String(form.status ?? "published")}
                  onChange={handleChange}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                >
                  {["draft", "published", "archived"].map((opt: string) => (
                    <option key={opt} value={opt} className="text-black">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Se é publishedAt, renderiza readTime ao lado */}
            {field.name === "publishedAt" && (
              <div>
                <label className="block text-[#bfc7d5] mb-1" htmlFor="readTime">
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
                  Upload Imagem Principal
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
      <div className="mb-3">
        <label className="block text-[#bfc7d5] mb-1" htmlFor="mdx-image-upload">
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
          <div className="mt-2 flex items-center gap-2">
            <Image
              src={String(form.mdxImage)}
              alt="Preview MDX"
              width={128}
              height={128}
              unoptimized
              className="max-h-32 h-auto w-auto rounded border border-[#4b6b57]"
            />
            <button
              type="button"
              className="px-2 py-1 bg-[#eebbc3] text-[#232946] rounded text-xs"
              onClick={() =>
                navigator.clipboard.writeText(String(form.mdxImage))
              }
            >
              Copiar URL
            </button>
          </div>
        )}
      </div>

      {/* Imagem URL MDX */}
      <div className="mb-3">
        <label className="block text-[#bfc7d5] mb-1" htmlFor="mdxImageUrl">
          Imagem URL MDX
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

      {/* Afiliados Cadastrados */}
      <div className="mb-3 border-t border-[#4b6b57] pt-4">
        <h3 className="text-[#bfc7d5] font-semibold mb-2">
          Afiliados Cadastrados
        </h3>
        <p className="text-xs text-[#9ca3af] mb-2">
          Selecione no dropdown e copie o código MDX do card
        </p>

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
        <h3 className="text-[#bfc7d5] font-semibold mb-2">Templates de MDX</h3>
        <p className="text-xs text-[#9ca3af] mb-2">
          Selecione um template no dropdown para copiar
        </p>

        <select
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
          value={selectedMdxTemplate}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedMdxTemplate(value);
            if (value) {
              copyMdxTemplate(value);
              setSelectedMdxTemplate("");
            }
          }}
        >
          <option value="">Selecione um template...</option>
          <option value="ProductRow">ProductRow</option>
          <option value="WrapImageText">WrapImageText</option>
        </select>
        {templateCopied && (
          <p className="mt-2 text-xs text-green-400">Template copiado!</p>
        )}
      </div>

      {/* Editor Markdown */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <label className="block text-[#bfc7d5]" htmlFor="content">
            Conteúdo do Artigo (Markdown)
          </label>
          <button
            type="button"
            onClick={sanitizeMdxContent}
            className="px-2 py-1 text-xs bg-[#eebbc3] text-[#232946] rounded hover:bg-[#d9aab2] transition"
          >
            Limpar formatação invisível
          </button>
        </div>
        <div className="flex w-full bg-[#18181b] text-white rounded-lg border border-[#4b6b57] focus-within:border-[#6b8c77] overflow-hidden">
          <div
            ref={lineNumbersRef}
            aria-hidden="true"
            className="min-w-12 px-2 py-2 text-right text-[#6b7280] bg-[#14161a] border-r border-[#2f3e36] font-mono text-sm leading-6 whitespace-pre select-none overflow-hidden"
          >
            {lineNumbers}
          </div>
          <textarea
            id="content"
            name="content"
            value={contentValue}
            onChange={(e) => onContentChange(e.target.value)}
            onScroll={(e) => {
              if (lineNumbersRef.current) {
                lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
              }
            }}
            rows={20}
            className="w-full bg-transparent text-white px-3 py-2 focus:outline-none font-mono text-sm leading-6"
            placeholder="Digite o conteúdo do artigo em Markdown..."
          />
        </div>
        {contentSanitized && (
          <p className="mt-2 text-xs text-green-400">
            Formatação invisível removida do conteúdo.
          </p>
        )}
      </div>

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
