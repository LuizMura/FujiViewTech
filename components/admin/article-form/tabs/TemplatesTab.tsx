import AfiliadoRowTemplateSelector from "@/components/admin/AfiliadoRowTemplateSelector";
import ImageUpload from "@/components/admin/article-form/shared/ImageUpload";
import type {
  Afiliado,
  MdxConfig,
} from "@/components/admin/article-form/types";

type TemplatesTabProps = {
  form: Record<string, unknown>;
  mdxConfig: MdxConfig;
  mdxImageUrlValue: string;
  templateCopied: boolean;
  buttonTemplateCopied: boolean;
  priceTemplateCopied: boolean;
  afiliadoRowTemplateCopied: boolean;
  affiliateCopied: boolean;
  categoriasSugeridas: string[];
  templateAffiliates: Afiliado[];
  loadingAfiliados: boolean;
  templateAffiliateCategory: string;
  templateAffiliateId: string;
  selectedTemplateAffiliate: Afiliado | null;
  filterCategoria: string;
  afiliadosFiltrados: Afiliado[];
  selectedAfiliadoId: string;
  selectedAfiliado: Afiliado | null;
  onTemplateCategoryChange: (category: string) => void;
  onTemplateAffiliateChange: (id: string) => void;
  onMdxConfigFieldChange: <K extends keyof MdxConfig>(
    field: K,
    value: MdxConfig[K],
  ) => void;
  onMdxUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormFieldChange: (name: string, value: unknown) => void;
  onCopySelectedTemplate: () => void;
  onFilterCategoriaChange: (category: string) => void;
  onSelectedAfiliadoChange: (id: string) => void;
  onCopyAffiliateMdx: () => void;
  onCopyButtonTemplate: () => void;
  onCopyPriceLinksTemplate: () => void;
  onCopyAfiliadoRowTemplate: () => void;
  canCopySelectedTemplate: boolean;
};

export default function TemplatesTab({
  form,
  mdxConfig,
  mdxImageUrlValue,
  templateCopied,
  buttonTemplateCopied,
  priceTemplateCopied,
  afiliadoRowTemplateCopied,
  affiliateCopied,
  categoriasSugeridas,
  templateAffiliates,
  loadingAfiliados,
  templateAffiliateCategory,
  templateAffiliateId,
  selectedTemplateAffiliate,
  filterCategoria,
  afiliadosFiltrados,
  selectedAfiliadoId,
  selectedAfiliado,
  onTemplateCategoryChange,
  onTemplateAffiliateChange,
  onMdxConfigFieldChange,
  onMdxUpload,
  onFormFieldChange,
  onCopySelectedTemplate,
  onFilterCategoriaChange,
  onSelectedAfiliadoChange,
  onCopyAffiliateMdx,
  onCopyButtonTemplate,
  onCopyPriceLinksTemplate,
  onCopyAfiliadoRowTemplate,
  canCopySelectedTemplate,
}: TemplatesTabProps) {
  return (
    <>
      <div className="mb-3 border border-[#4b6b57] rounded-lg p-3 bg-[#1c212a]">
        <h3 className="text-[#bfc7d5] font-semibold mb-2">Imagens no MDX</h3>

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
            value={mdxConfig.selectedTemplate}
            onChange={(e) =>
              onMdxConfigFieldChange("selectedTemplate", e.target.value)
            }
          >
            <option value="MarkdownImage">Imagen tela inteira</option>
            <option value="WrapImageText">Imagem lateral</option>
            <option value="ProductRow">ProductRow</option>
            <option value="AfiliadoRow">AfiliadoRow</option>
          </select>
        </div>

        {mdxConfig.selectedTemplate === "AfiliadoRow" && (
          <AfiliadoRowTemplateSelector
            categorias={categoriasSugeridas}
            afiliados={templateAffiliates}
            loading={loadingAfiliados}
            selectedCategory={templateAffiliateCategory}
            selectedAffiliateId={templateAffiliateId}
            onCategoryChange={onTemplateCategoryChange}
            onAffiliateChange={onTemplateAffiliateChange}
          />
        )}

        {mdxConfig.selectedTemplate === "WrapImageText" && (
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
              value={mdxConfig.imageSide}
              onChange={(e) =>
                onMdxConfigFieldChange(
                  "imageSide",
                  e.target.value as "left" | "right",
                )
              }
            >
              <option value="left">Esquerda</option>
              <option value="right">Direita</option>
            </select>
          </div>
        )}

        {mdxConfig.selectedTemplate !== "AfiliadoRow" && (
          <>
            <ImageUpload
              id="mdx-image-upload"
              label="Upload Imagem para MDX"
              onChange={onMdxUpload}
              previewUrl={form.mdxImage ? String(form.mdxImage) : undefined}
            />

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
                onChange={(e) =>
                  onFormFieldChange("mdxImageUrl", e.target.value)
                }
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
                onChange={(e) =>
                  onFormFieldChange("mdxImageLink", e.target.value)
                }
                className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                placeholder="https://exemplo.com/destino"
              />
            </div>
          </>
        )}

        <div className="mt-3">
          <button
            type="button"
            disabled={!canCopySelectedTemplate}
            onClick={onCopySelectedTemplate}
            className="w-full px-3 py-2 bg-[#eebbc3] text-[#232946] rounded text-xs font-semibold disabled:opacity-50"
          >
            {mdxConfig.selectedTemplate === "AfiliadoRow"
              ? "Copiar template AfiliadoRow"
              : "Copiar link"}
          </button>
          {templateCopied && (
            <p className="mt-2 text-xs text-green-400">
              {mdxConfig.selectedTemplate === "AfiliadoRow"
                ? "Template AfiliadoRow copiado!"
                : "Código copiado com a URL da imagem!"}
            </p>
          )}
        </div>
      </div>

      <div className="mb-3 border-t border-[#4b6b57] pt-4">
        <h3 className="text-[#bfc7d5] font-semibold mb-2">
          Afiliados Cadastrados
        </h3>

        <select
          className="w-full mb-2 bg-[#18181b] text-white px-3 py-1.5 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
          value={filterCategoria}
          onChange={(e) => onFilterCategoriaChange(e.target.value)}
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
              onChange={(e) => onSelectedAfiliadoChange(e.target.value)}
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
              onClick={onCopyAffiliateMdx}
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

      <div className="mb-3 border-t border-[#4b6b57] pt-4">
        <h3 className="text-[#bfc7d5] font-semibold mb-2">Botao MDX</h3>

        <div className="space-y-2 mb-4">
          <input
            type="text"
            value={mdxConfig.buttonText}
            onChange={(e) =>
              onMdxConfigFieldChange("buttonText", e.target.value)
            }
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
            placeholder="Texto do botao"
          />
          <input
            type="url"
            value={mdxConfig.buttonUrl}
            onChange={(e) =>
              onMdxConfigFieldChange("buttonUrl", e.target.value)
            }
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
            placeholder="https://seu-link.com"
          />
          <button
            type="button"
            onClick={onCopyButtonTemplate}
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
            value={mdxConfig.amazonUrl}
            onChange={(e) =>
              onMdxConfigFieldChange("amazonUrl", e.target.value)
            }
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
            placeholder="URL afiliado Amazon"
          />
          <input
            type="url"
            value={mdxConfig.mercadoLivreUrl}
            onChange={(e) =>
              onMdxConfigFieldChange("mercadoLivreUrl", e.target.value)
            }
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
            placeholder="URL afiliado Mercado Livre"
          />
          <button
            type="button"
            onClick={onCopyPriceLinksTemplate}
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

        <h3 className="text-[#bfc7d5] font-semibold mb-2">AfiliadoRow</h3>

        <div className="space-y-2 mb-4">
          <p className="text-xs text-[#9ca3af]">
            Usa o produto afiliado selecionado para preencher imagem, nome,
            descrição e links.
          </p>
          <button
            type="button"
            onClick={onCopyAfiliadoRowTemplate}
            disabled={!selectedTemplateAffiliate}
            className="w-full py-2 bg-[#7f8fa6] text-[#23272f] rounded-lg font-semibold hover:bg-[#596275] transition"
          >
            Copiar template AfiliadoRow
          </button>
          {afiliadoRowTemplateCopied && (
            <p className="text-xs text-green-400">
              Template AfiliadoRow copiado!
            </p>
          )}
        </div>

        <h3 className="text-[#bfc7d5] font-semibold mb-2">Templates de MDX</h3>
      </div>
    </>
  );
}
