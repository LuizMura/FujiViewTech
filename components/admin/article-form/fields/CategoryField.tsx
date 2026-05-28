import { getCategoryLabelBySlug } from "@/lib/constants/categories";

type CategoryFieldProps = {
  categoryValue: string;
  subcategoryValue: string;
  brandValue: string;
  tagsValue: string;
  categories: string[];
  subcategories: string[];
  savingSubcategory: boolean;
  onChange: (name: string, value: unknown) => void;
  onPersistSubcategory: () => void;
};

export default function CategoryField({
  categoryValue,
  subcategoryValue,
  brandValue,
  tagsValue,
  categories,
  subcategories,
  savingSubcategory,
  onChange,
  onPersistSubcategory,
}: CategoryFieldProps) {
  return (
    <>
      <div>
        <label className="block text-[#bfc7d5] mb-1" htmlFor="category">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          value={categoryValue}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="text-black">
              {getCategoryLabelBySlug(cat)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-end justify-between gap-2 mb-1">
          <label className="block text-[#bfc7d5]" htmlFor="subcategory">
            Subcategoria
          </label>
          <button
            type="button"
            onClick={onPersistSubcategory}
            disabled={!categoryValue || savingSubcategory}
            className="text-xs px-2 py-1 rounded bg-[#2a2f39] text-[#bfc7d5] hover:bg-[#3a4352] disabled:opacity-50"
          >
            {savingSubcategory ? "Salvando..." : "Salvar subcategoria"}
          </button>
        </div>
        <input
          id="subcategory"
          name="subcategory"
          type="text"
          list="subcategory-options"
          value={subcategoryValue}
          onChange={(e) => onChange("subcategory", e.target.value)}
          className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
          placeholder="Ex.: smartphones"
        />
        <datalist id="subcategory-options">
          {subcategories.map((sub) => (
            <option key={sub} value={sub} />
          ))}
        </datalist>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-2 mt-0">
        <div>
          <label className="block text-[#bfc7d5] mb-1" htmlFor="brand">
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={brandValue}
            onChange={(e) => onChange("brand", e.target.value)}
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
            placeholder="Ex.: Samsung, Apple..."
          />
        </div>

        <div>
          <label className="block text-[#bfc7d5] mb-1" htmlFor="tags-input">
            Tags{" "}
            <span className="text-xs text-[#7f8fa6]">
              (separadas por vírgula)
            </span>
          </label>
          <input
            id="tags-input"
            type="text"
            value={tagsValue}
            onChange={(e) => {
              const raw = e.target.value;
              const arr = raw.split(",").map((t) => t.trimStart());
              onChange("tags", arr);
            }}
            className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
            placeholder="Ex.: android, 5g, câmera"
          />
        </div>
      </div>
    </>
  );
}
