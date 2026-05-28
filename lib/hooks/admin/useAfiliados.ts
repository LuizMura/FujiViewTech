import { useEffect, useMemo, useState } from "react";
import type { Afiliado } from "@/components/admin/article-form/types";

export function useAfiliados() {
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [loadingAfiliados, setLoadingAfiliados] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState("");
  const [selectedAfiliadoId, setSelectedAfiliadoId] = useState("");
  const [templateAffiliateCategory, setTemplateAffiliateCategory] =
    useState("");
  const [templateAffiliateId, setTemplateAffiliateId] = useState("");

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
    () => afiliadosFiltrados.find((a) => a.id === selectedAfiliadoId) ?? null,
    [afiliadosFiltrados, selectedAfiliadoId],
  );

  const templateAffiliates = useMemo(() => {
    if (!templateAffiliateCategory) return afiliados;
    return afiliados.filter((a) => a.categoria === templateAffiliateCategory);
  }, [afiliados, templateAffiliateCategory]);

  const selectedTemplateAffiliate = useMemo(
    () => templateAffiliates.find((a) => a.id === templateAffiliateId) ?? null,
    [templateAffiliates, templateAffiliateId],
  );

  const handleTemplateCategoryChange = (category: string) => {
    setTemplateAffiliateCategory(category);
    setTemplateAffiliateId("");
  };

  const handleFilterCategoriaChange = (category: string) => {
    setFilterCategoria(category);
    setSelectedAfiliadoId("");
  };

  return {
    afiliados,
    loadingAfiliados,
    categoriasSugeridas,
    filterCategoria,
    setFilterCategoria: handleFilterCategoriaChange,
    selectedAfiliadoId,
    setSelectedAfiliadoId,
    afiliadosFiltrados,
    selectedAfiliado,
    templateAffiliateCategory,
    setTemplateAffiliateCategory: handleTemplateCategoryChange,
    templateAffiliateId,
    setTemplateAffiliateId,
    templateAffiliates,
    selectedTemplateAffiliate,
  };
}
