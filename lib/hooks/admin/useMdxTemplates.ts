import { useMemo, useState } from "react";
import type {
  Afiliado,
  MdxConfig,
} from "@/components/admin/article-form/types";
import {
  buildAfiliadoRowTemplate,
  buildTemplateWithImageUrl,
} from "@/lib/mdx/templates";

type CopyState = {
  affiliateCopied: boolean;
  templateCopied: boolean;
  buttonTemplateCopied: boolean;
  priceTemplateCopied: boolean;
  afiliadoRowTemplateCopied: boolean;
};

const initialMdxConfig: MdxConfig = {
  selectedTemplate: "",
  imageSide: "left",
  buttonText: "",
  buttonUrl: "",
  amazonUrl: "",
  mercadoLivreUrl: "",
};

const initialCopyState: CopyState = {
  affiliateCopied: false,
  templateCopied: false,
  buttonTemplateCopied: false,
  priceTemplateCopied: false,
  afiliadoRowTemplateCopied: false,
};

export function useMdxTemplates() {
  const [mdxConfig, setMdxConfig] = useState<MdxConfig>(initialMdxConfig);
  const [copyState, setCopyState] = useState<CopyState>(initialCopyState);

  const setMdxConfigField = <K extends keyof MdxConfig>(
    field: K,
    value: MdxConfig[K],
  ) => {
    setMdxConfig((prev) => ({ ...prev, [field]: value }));
  };

  const markCopied = (key: keyof CopyState) => {
    setCopyState((prev) => ({ ...prev, [key]: true }));
    window.setTimeout(() => {
      setCopyState((prev) => ({ ...prev, [key]: false }));
    }, 1800);
  };

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
    markCopied("affiliateCopied");
  };

  const copyButtonTemplate = () => {
    const buttonText = mdxConfig.buttonText.trim();
    const buttonUrl = mdxConfig.buttonUrl.trim() || "https://exemplo.com";
    const esc = (v: string) => v.replace(/"/g, '\\"');
    const mdxTemplate = `<ArticleButton\n  text=\"${esc(buttonText)}\"\n  url=\"${esc(buttonUrl)}\"\n/>`;

    navigator.clipboard.writeText(mdxTemplate);
    markCopied("buttonTemplateCopied");
  };

  const copyPriceLinksTemplate = () => {
    const amazonUrl = mdxConfig.amazonUrl.trim();
    const mercadoLivreUrl = mdxConfig.mercadoLivreUrl.trim();
    const esc = (v: string) => v.replace(/"/g, '\\"');

    const mdxTemplate = `<AffiliatePriceLinks\n  label=\"Ver preço\"\n  amazonUrl=\"${esc(amazonUrl)}\"\n  mercadoLivreUrl=\"${esc(mercadoLivreUrl)}\"\n/>`;

    navigator.clipboard.writeText(mdxTemplate);
    markCopied("priceTemplateCopied");
  };

  const copyAfiliadoRowTemplate = (
    selectedTemplateAffiliate: Afiliado | null,
  ) => {
    if (!selectedTemplateAffiliate) return;

    const mdxTemplate = buildAfiliadoRowTemplate(selectedTemplateAffiliate);
    navigator.clipboard.writeText(mdxTemplate);
    markCopied("afiliadoRowTemplateCopied");
  };

  const copySelectedTemplate = (params: {
    mdxImageUrlValue: string;
    mdxImageLinkValue: string;
    selectedTemplateAffiliate: Afiliado | null;
  }) => {
    const { mdxImageUrlValue, mdxImageLinkValue, selectedTemplateAffiliate } =
      params;

    if (mdxConfig.selectedTemplate === "AfiliadoRow") {
      if (!selectedTemplateAffiliate) return;

      const snippet = buildTemplateWithImageUrl({
        template: mdxConfig.selectedTemplate,
        imageUrl: "",
        selectedTemplateAffiliate,
      });
      navigator.clipboard.writeText(snippet);
      markCopied("templateCopied");
      return;
    }

    if (!mdxImageUrlValue) return;

    const snippet = buildTemplateWithImageUrl({
      template: mdxConfig.selectedTemplate || "MarkdownImage",
      imageUrl: mdxImageUrlValue,
      imageLink: mdxImageLinkValue,
      side: mdxConfig.imageSide,
      selectedTemplateAffiliate,
    });

    navigator.clipboard.writeText(snippet);
    markCopied("templateCopied");
  };

  const canCopySelectedTemplate = useMemo(
    () =>
      (
        template: string,
        mdxImageUrlValue: string,
        hasAffiliateSelection: boolean,
      ) => {
        if (template === "AfiliadoRow") return hasAffiliateSelection;
        return Boolean(mdxImageUrlValue);
      },
    [],
  );

  return {
    mdxConfig,
    setMdxConfigField,
    copyState,
    copyAffiliateMdx,
    copyButtonTemplate,
    copyPriceLinksTemplate,
    copyAfiliadoRowTemplate,
    copySelectedTemplate,
    canCopySelectedTemplate,
  };
}
