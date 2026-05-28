import { useEffect, useState } from "react";
import { normalizeCategorySlug } from "@/lib/constants/categories";

export function useSubcategories(categoryValue: unknown) {
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [savingSubcategory, setSavingSubcategory] = useState(false);

  useEffect(() => {
    async function loadSubcategories() {
      try {
        const selectedCategory = normalizeCategorySlug(
          String(categoryValue || ""),
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
  }, [categoryValue]);

  const persistCurrentSubcategory = async (subcategoryValue: unknown) => {
    const currentCategory = normalizeCategorySlug(String(categoryValue || ""));
    const currentSubcategory = String(subcategoryValue || "").trim();

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

  return {
    subcategories,
    savingSubcategory,
    persistCurrentSubcategory,
  };
}
