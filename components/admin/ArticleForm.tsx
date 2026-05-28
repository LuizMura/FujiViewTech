"use client";

import { createClient } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/hooks/useArticles";
import { FIXED_CATEGORIES } from "@/lib/constants/categories";
import { useAfiliados } from "@/lib/hooks/admin/useAfiliados";
import { useSubcategories } from "@/lib/hooks/admin/useSubcategories";
import { useMdxTemplates } from "@/lib/hooks/admin/useMdxTemplates";
import { buildSafeStorageFileName } from "@/lib/utils/file";
import { extraFields, fields } from "@/components/admin/article-form/config";
import CoverTab from "@/components/admin/article-form/tabs/CoverTab";
import TemplatesTab from "@/components/admin/article-form/tabs/TemplatesTab";
import EditorTab from "@/components/admin/article-form/tabs/EditorTab";
import type {
  ArticleFormProps,
  CardBase,
  EditorTab as EditorTabType,
} from "@/components/admin/article-form/types";
import { useMemo, useState } from "react";

export default function ArticleForm<T extends CardBase>({
  form,
  cardType,
  onFormChange,
  onImageUpload,
  onMdxImageUpload,
  onContentChange,
  onSubmit,
}: ArticleFormProps<T>) {
  const [activeTab, setActiveTab] = useState<EditorTabType>("cover");
  const [contentSanitized, setContentSanitized] = useState(false);
  const showTabs = cardType === "ArtigoCard";
  const categories = useMemo(
    () => FIXED_CATEGORIES.map((category) => category.slug),
    [],
  );

  const afiliadosState = useAfiliados();
  const subcategoriesState = useSubcategories(form.category);
  const mdxTemplatesState = useMdxTemplates();

  const allFields = useMemo(() => {
    const allFieldsMap = new Map();
    [...fields, ...(extraFields[cardType] || [])].forEach((field) => {
      if (!allFieldsMap.has(field.name)) {
        allFieldsMap.set(field.name, field);
      }
    });
    return Array.from(allFieldsMap.values());
  }, [cardType]);

  const contentValue = String(form.content ?? "");
  const mdxImageUrlValue = String(
    form.mdxImageUrl || form.mdxImage || "",
  ).trim();
  const mdxImageLinkValue = String(form.mdxImageLink || "").trim();

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

  const buildMdxImageSnippet = (url: string, originalName: string) => {
    const baseName = String(originalName || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    const alt = baseName || "Imagem";
    return `![${alt}](${url})`;
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
        appendSnippetToContent(buildMdxImageSnippet(publicUrl, file.name));
        void navigator.clipboard.writeText(publicUrl);
      }
      return;
    }

    onImageUpload(publicUrl);
  };

  const handleChange = async (name: string, value: unknown) => {
    onFormChange(name, value);

    if (name === "title" && !form.slug) {
      const newSlug = await generateUniqueSlug(String(value || ""));
      onFormChange("slug", newSlug);
    }
  };

  const selectedTemplate = mdxTemplatesState.mdxConfig.selectedTemplate;
  const canCopySelectedTemplate = mdxTemplatesState.canCopySelectedTemplate(
    selectedTemplate,
    mdxImageUrlValue,
    Boolean(afiliadosState.selectedTemplateAffiliate),
  );

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

      {(!showTabs || activeTab === "cover") && (
        <CoverTab
          form={form}
          fields={allFields}
          categories={categories}
          subcategories={subcategoriesState.subcategories}
          savingSubcategory={subcategoriesState.savingSubcategory}
          onPersistSubcategory={() =>
            subcategoriesState.persistCurrentSubcategory(form.subcategory)
          }
          onFieldChange={handleChange}
          onCoverUpload={(e) => handleFileUpload(e, false)}
        />
      )}

      {(!showTabs || activeTab === "templates") && (
        <TemplatesTab
          form={form}
          mdxConfig={mdxTemplatesState.mdxConfig}
          mdxImageUrlValue={mdxImageUrlValue}
          templateCopied={mdxTemplatesState.copyState.templateCopied}
          buttonTemplateCopied={
            mdxTemplatesState.copyState.buttonTemplateCopied
          }
          priceTemplateCopied={mdxTemplatesState.copyState.priceTemplateCopied}
          afiliadoRowTemplateCopied={
            mdxTemplatesState.copyState.afiliadoRowTemplateCopied
          }
          affiliateCopied={mdxTemplatesState.copyState.affiliateCopied}
          categoriasSugeridas={afiliadosState.categoriasSugeridas}
          templateAffiliates={afiliadosState.templateAffiliates}
          loadingAfiliados={afiliadosState.loadingAfiliados}
          templateAffiliateCategory={afiliadosState.templateAffiliateCategory}
          templateAffiliateId={afiliadosState.templateAffiliateId}
          selectedTemplateAffiliate={afiliadosState.selectedTemplateAffiliate}
          filterCategoria={afiliadosState.filterCategoria}
          afiliadosFiltrados={afiliadosState.afiliadosFiltrados}
          selectedAfiliadoId={afiliadosState.selectedAfiliadoId}
          selectedAfiliado={afiliadosState.selectedAfiliado}
          onTemplateCategoryChange={afiliadosState.setTemplateAffiliateCategory}
          onTemplateAffiliateChange={afiliadosState.setTemplateAffiliateId}
          onMdxConfigFieldChange={mdxTemplatesState.setMdxConfigField}
          onMdxUpload={(e) => handleFileUpload(e, true)}
          onFormFieldChange={handleChange}
          onCopySelectedTemplate={() =>
            mdxTemplatesState.copySelectedTemplate({
              mdxImageUrlValue,
              mdxImageLinkValue,
              selectedTemplateAffiliate:
                afiliadosState.selectedTemplateAffiliate,
            })
          }
          onFilterCategoriaChange={afiliadosState.setFilterCategoria}
          onSelectedAfiliadoChange={afiliadosState.setSelectedAfiliadoId}
          onCopyAffiliateMdx={() =>
            afiliadosState.selectedAfiliado &&
            mdxTemplatesState.copyAffiliateMdx(afiliadosState.selectedAfiliado)
          }
          onCopyButtonTemplate={mdxTemplatesState.copyButtonTemplate}
          onCopyPriceLinksTemplate={mdxTemplatesState.copyPriceLinksTemplate}
          onCopyAfiliadoRowTemplate={() =>
            mdxTemplatesState.copyAfiliadoRowTemplate(
              afiliadosState.selectedTemplateAffiliate,
            )
          }
          canCopySelectedTemplate={canCopySelectedTemplate}
        />
      )}

      {(!showTabs || activeTab === "editor") && (
        <EditorTab
          content={contentValue}
          contentSanitized={contentSanitized}
          onContentChange={onContentChange}
          onSanitize={sanitizeMdxContent}
        />
      )}

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
