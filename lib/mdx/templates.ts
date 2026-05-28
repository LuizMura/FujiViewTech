export type AfiliadoTemplateData = {
  titulo?: string;
  descricao?: string;
  imagem?: string;
  afiliado_url?: string;
  afiliado1_url?: string;
  afiliado2_url?: string;
};

export function resolveAffiliateLinks(afiliado: AfiliadoTemplateData) {
  const amazon = String(afiliado.afiliado1_url || "").trim();
  const mercadoLivre = String(afiliado.afiliado2_url || "").trim();
  const legacy = String(afiliado.afiliado_url || "").trim();

  if (amazon || mercadoLivre) {
    return { amazonUrl: amazon, mercadoLivreUrl: mercadoLivre };
  }

  const legacyLower = legacy.toLowerCase();
  if (
    legacyLower.includes("mercadolivre") ||
    legacyLower.includes("mercadolibre")
  ) {
    return { amazonUrl: "", mercadoLivreUrl: legacy };
  }

  return { amazonUrl: legacy, mercadoLivreUrl: "" };
}

export function buildAfiliadoRowTemplate(afiliado: AfiliadoTemplateData) {
  const esc = (v: string | number | null | undefined) =>
    String(v ?? "").replace(/"/g, '\\"');
  const { amazonUrl, mercadoLivreUrl } = resolveAffiliateLinks(afiliado);
  const imageUrl = String(afiliado.imagem || "/images/og-default.png").trim();
  const title = String(afiliado.titulo || "").trim();
  const description = String(
    afiliado.descricao || "Descrição do produto",
  ).trim();

  return `<ProductRow
  image="${esc(imageUrl)}"
  title="${esc(title)}"
>

<p>${esc(description)}</p>

<AffiliatePriceLinks
  label="Ver preco"
  amazonUrl="${esc(amazonUrl)}"
  mercadoLivreUrl="${esc(mercadoLivreUrl)}"
/>
</ProductRow>`;
}

type BuildTemplateParams = {
  template: string;
  imageUrl: string;
  imageLink?: string;
  side?: "left" | "right";
  selectedTemplateAffiliate?: AfiliadoTemplateData | null;
};

export function buildTemplateWithImageUrl({
  template,
  imageUrl,
  imageLink,
  side = "left",
  selectedTemplateAffiliate,
}: BuildTemplateParams) {
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

  if (template === "AfiliadoRow" && selectedTemplateAffiliate) {
    return buildAfiliadoRowTemplate(selectedTemplateAffiliate);
  }

  if (safeLink) {
    return `[![Imagem](${safeUrl})](${safeLink})`;
  }

  return `![Imagem](${safeUrl})`;
}
