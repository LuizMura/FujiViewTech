"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { Trash2, Plus, Save } from "lucide-react";
import ImageUpload from "./ImageUpload";
import ReviewItem from "./ReviewItem";

interface RelatedProduct {
  id?: string;
  article_id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  affiliate_link_1?: string;
  affiliate_text_1?: string;
  affiliate_link_2?: string;
  affiliate_text_2?: string;
  order: number;
}

interface Props {
  articleId: string;
  articleTitle: string;
}

export default function RelatedProductsManager({
  articleId,
  articleTitle,
}: Props) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RelatedProduct | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [articleId]);

  const loadProducts = async () => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("related_products")
        .select("*")
        .eq("article_id", articleId)
        .order("order");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos relacionados:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;

    try {
      setSaving(true);
      const supabase = createSupabaseClient();

      if (editingProduct.id) {
        // Update
        const { error } = await supabase
          .from("related_products")
          .update(editingProduct)
          .eq("id", editingProduct.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("related_products")
          .insert({ ...editingProduct, article_id: articleId });

        if (error) throw error;
      }

      await loadProducts();
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto relacionado");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto relacionado?")) return;

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from("related_products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadProducts();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto relacionado");
    }
  };

  const startNewProduct = () => {
    setEditingProduct({
      article_id: articleId,
      title: "",
      subtitle: "",
      description: "",
      image: "",
      affiliate_link_1: "",
      affiliate_text_1: "Comprar",
      affiliate_link_2: "",
      affiliate_text_2: "Ver Mais",
      order: products.length,
    });
    setIsFormOpen(true);
  };

  const startEditProduct = (product: RelatedProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="text-black">Carregando produtos relacionados...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-black">
            Produtos Relacionados
          </h3>
          <p className="text-sm text-black">Para: {articleTitle}</p>
        </div>
        <button
          onClick={startNewProduct}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Adicionar Produto
        </button>
      </div>

      {/* Lista de Produtos */}
      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-black bg-slate-50 rounded-lg">
            Nenhum produto relacionado adicionado
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-black">{product.title}</h4>
                <p className="text-sm text-black">{product.subtitle}</p>
                <p className="text-xs text-black line-clamp-1">
                  {product.description}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditProduct(product)}
                  className="px-3 py-2 text-sm bg-slate-100 text-black rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulário de Edição */}
      {isFormOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
            {/* Preview - Lado Esquerdo */}
            <div className="w-1/2 bg-slate-50 border-r border-slate-200 overflow-y-auto">
              <div className="sticky top-0 bg-slate-100 border-b border-slate-200 p-6">
                <h3 className="text-xl font-bold text-black">
                  Preview em Tempo Real
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Veja como ficará o card na página
                </p>
              </div>

              <div className="p-6 flex items-start justify-center">
                <ReviewItem
                  title={editingProduct.title || "Título do Produto"}
                  subtitle={editingProduct.subtitle || "Subtítulo"}
                  description={
                    editingProduct.description || "Descrição do produto..."
                  }
                  image={
                    editingProduct.image || "/images/posts/placeholder.jpg"
                  }
                  affiliateLink1={editingProduct.affiliate_link_1}
                  affiliateText1={editingProduct.affiliate_text_1 || "Comprar"}
                  affiliateLink2={editingProduct.affiliate_link_2}
                  affiliateText2={editingProduct.affiliate_text_2 || "Ver Mais"}
                />
              </div>
            </div>

            {/* Formulário - Lado Direito */}
            <div className="w-1/2 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">
                  {editingProduct.id ? "Editar Produto" : "Novo Produto"}
                </h3>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingProduct(null);
                  }}
                  className="text-black hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    placeholder="Samsung Galaxy S25"
                  />
                </div>

                {/* Subtítulo */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={editingProduct.subtitle}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    placeholder="A opção acessível"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    placeholder="Breve descrição do produto..."
                  />
                </div>

                {/* Imagem */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Imagem
                  </label>
                  <ImageUpload
                    currentImageUrl={editingProduct.image}
                    onUploadComplete={(url) =>
                      setEditingProduct({ ...editingProduct, image: url })
                    }
                  />
                </div>

                {/* Link Afiliado 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Link Afiliado 1
                    </label>
                    <input
                      type="url"
                      value={editingProduct.affiliate_link_1}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          affiliate_link_1: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                      placeholder="https://amazon.com.br/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Texto Botão 1
                    </label>
                    <input
                      type="text"
                      value={editingProduct.affiliate_text_1}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          affiliate_text_1: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                      placeholder="Comprar"
                    />
                  </div>
                </div>

                {/* Link Afiliado 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Link Afiliado 2
                    </label>
                    <input
                      type="url"
                      value={editingProduct.affiliate_link_2}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          affiliate_link_2: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                      placeholder="https://samsung.com.br/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Texto Botão 2
                    </label>
                    <input
                      type="text"
                      value={editingProduct.affiliate_text_2}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          affiliate_text_2: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                      placeholder="Ver Mais"
                    />
                  </div>
                </div>

                {/* Ordem */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={editingProduct.order}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    min="0"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex gap-3">
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 text-black rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveProduct}
                  disabled={saving || !editingProduct.title}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
