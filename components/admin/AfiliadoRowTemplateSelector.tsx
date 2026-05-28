type AfiliadoRowTemplateOption = {
  id: string;
  titulo: string;
  categoria: string;
  descricao?: string;
};

type AfiliadoRowTemplateSelectorProps = {
  categorias: string[];
  afiliados: AfiliadoRowTemplateOption[];
  loading: boolean;
  selectedCategory: string;
  selectedAffiliateId: string;
  onCategoryChange: (category: string) => void;
  onAffiliateChange: (affiliateId: string) => void;
};

export default function AfiliadoRowTemplateSelector({
  categorias,
  afiliados,
  loading,
  selectedCategory,
  selectedAffiliateId,
  onCategoryChange,
  onAffiliateChange,
}: AfiliadoRowTemplateSelectorProps) {
  const selectedAffiliate =
    afiliados.find((item) => item.id === selectedAffiliateId) ?? null;

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-[#4b6b57] bg-[#18181b] p-3">
      <div>
        <label
          className="block text-[#bfc7d5] mb-1"
          htmlFor="template-affiliate-category"
        >
          Categoria do afiliado
        </label>
        <select
          id="template-affiliate-category"
          className="w-full bg-[#11151c] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="block text-[#bfc7d5] mb-1"
          htmlFor="template-affiliate-product"
        >
          Produto afiliado
        </label>
        <select
          id="template-affiliate-product"
          className="w-full bg-[#11151c] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none text-sm"
          value={selectedAffiliateId}
          onChange={(event) => onAffiliateChange(event.target.value)}
          disabled={loading || afiliados.length === 0}
        >
          <option value="">Selecione um produto...</option>
          {afiliados.map((afiliado) => (
            <option key={afiliado.id} value={afiliado.id}>
              {afiliado.titulo}
            </option>
          ))}
        </select>
      </div>

      {selectedAffiliate && (
        <div className="rounded-lg border border-[#4b6b57] bg-[#1c212a] p-3 text-sm text-[#bfc7d5]">
          <p className="font-semibold text-white">{selectedAffiliate.titulo}</p>
          <p className="mt-1 text-xs text-[#9ca3af]">
            {selectedAffiliate.descricao || "Descrição do produto"}
          </p>
        </div>
      )}
    </div>
  );
}
