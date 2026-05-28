import CategoryField from "@/components/admin/article-form/fields/CategoryField";
import ImageUpload from "@/components/admin/article-form/shared/ImageUpload";
import type { FieldConfig } from "@/components/admin/article-form/types";

type CoverTabProps = {
  form: Record<string, unknown>;
  fields: FieldConfig[];
  categories: string[];
  subcategories: string[];
  savingSubcategory: boolean;
  onPersistSubcategory: () => void;
  onFieldChange: (name: string, value: unknown) => void;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CoverTab({
  form,
  fields,
  categories,
  subcategories,
  savingSubcategory,
  onPersistSubcategory,
  onFieldChange,
  onCoverUpload,
}: CoverTabProps) {
  return (
    <>
      {fields.map((field, index) => {
        const isSecondOfPair = field.name === "readTime";
        if (isSecondOfPair && index > 0) {
          const prevField = fields[index - 1];
          if (prevField.name === "publishedAt") {
            return null;
          }
        }

        if (field.name === "category") {
          return (
            <div key={field.name} className="grid grid-cols-2 gap-2 mb-3">
              <CategoryField
                categoryValue={String(form.category ?? "")}
                subcategoryValue={String(form.subcategory ?? "")}
                brandValue={String(form.brand ?? "")}
                tagsValue={
                  Array.isArray(form.tags)
                    ? (form.tags as string[]).join(", ")
                    : String(form.tags ?? "")
                }
                categories={categories}
                subcategories={subcategories}
                savingSubcategory={savingSubcategory}
                onPersistSubcategory={onPersistSubcategory}
                onChange={onFieldChange}
              />
            </div>
          );
        }

        const fieldValue = form[field.name];
        const wrapperClass =
          field.name === "publishedAt" ? "grid grid-cols-2 gap-2 mb-3" : "mb-3";

        return (
          <div key={field.name} className={wrapperClass}>
            <div>
              <label className="block text-[#bfc7d5] mb-1" htmlFor={field.name}>
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={String(
                    fieldValue ??
                      (field.name === "status"
                        ? "published"
                        : (field.options?.[0] ?? "")),
                  )}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
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
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
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
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
              )}
            </div>

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
                  onChange={(e) => onFieldChange("readTime", e.target.value)}
                  className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
                />
              </div>
            )}

            {field.name === "image" && (
              <div className="mb-3">
                <ImageUpload
                  id="image-upload"
                  label="Upload Imagem Capa"
                  onChange={onCoverUpload}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
