"use client";

import { useState, useEffect } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface AffiliateProduct {
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  affiliate_link: string;
  type: "product" | "travel";
  order_index: number;
}

interface AffiliateEditorProps {
  type: "product" | "travel";
  supabase: any;
}

export default function AffiliateEditor({
  type,
  supabase,
}: AffiliateEditorProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<AffiliateProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [type]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("affiliate_products")
        .select("*")
        .eq("type", type)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: AffiliateProduct) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImage(product.image);
    setAffiliateLink(product.affiliate_link);
    setOrderIndex(product.order_index);
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const productData: AffiliateProduct = {
        name,
        description,
        price,
        image,
        affiliate_link: affiliateLink,
        type,
        order_index: orderIndex,
      };

      if (selectedProduct?.id) {
        // Update existing
        const { error } = await supabase
          .from("affiliate_products")
          .update(productData)
          .eq("id", selectedProduct.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from("affiliate_products")
          .insert([productData]);

        if (error) throw error;
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
      await loadProducts();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const { error } = await supabase
        .from("affiliate_products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadProducts();
      if (selectedProduct?.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setAffiliateLink("");
    setOrderIndex(products.length);
  };

  const createNew = () => {
    resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Lista de produtos */}
      <div className="lg:col-span-1 bg-[#252526] rounded-lg p-4 border border-[#2d2d30]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#cccccc]">
            {type === "product" ? "Produtos" : "Viagens"}
          </h3>
          <button
            onClick={createNew}
            className="px-3 py-1 bg-[#4fc3f7] text-[#1e1e1e] rounded hover:bg-[#03a9f4] transition text-sm"
          >
            + Novo
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-[#858585] py-4">Carregando...</div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-3 rounded transition ${
                  selectedProduct?.id === product.id
                    ? "bg-[#4fc3f7]/20 border border-[#4fc3f7]"
                    : "bg-[#2d2d30] border border-transparent"
                }`}
              >
                <button
                  onClick={() => handleProductSelect(product)}
                  className="w-full text-left"
                >
                  <div className="text-sm font-medium text-[#cccccc] truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-[#858585] mt-1">
                    {product.price}
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(product.id!)}
                  className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="lg:col-span-3 space-y-6">
        {/* Preview Card */}
        <div className="bg-[#252526] rounded-lg p-6 border border-[#2d2d30]">
          <h3 className="text-lg font-semibold text-[#cccccc] mb-4">
            Preview do Card
          </h3>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-xs">
            {image && (
              <div className="relative w-full h-[220px]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                {name || "Nome do produto"}
              </h4>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {description || "Descrição do produto..."}
              </p>
              <p className="text-2xl font-bold text-cyan-600 mb-3">
                {price || "R$ 0,00"}
              </p>
              <button className="w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg">
                {type === "product" ? "Comprar" : "Ver Oferta"}
              </button>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-[#252526] rounded-lg p-6 border border-[#2d2d30] space-y-4">
          <h3 className="text-lg font-semibold text-[#cccccc] mb-4">
            {selectedProduct ? "Editar" : "Novo"}{" "}
            {type === "product" ? "Produto" : "Pacote de Viagem"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
              placeholder="Nome do produto ou pacote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
              placeholder="Breve descrição..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2">
                Preço
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-2">
                Ordem de exibição
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2">
              Link de Afiliado
            </label>
            <input
              type="url"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-[#cccccc] focus:ring-2 focus:ring-[#4fc3f7]"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#cccccc] mb-2 flex items-center gap-2">
              <Upload size={16} />
              Imagem
            </label>
            <ImageUpload currentImageUrl={image} onUploadComplete={setImage} />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="w-full px-6 py-3 bg-[#4fc3f7] text-[#1e1e1e] font-semibold rounded-lg hover:bg-[#03a9f4] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saveStatus === "saving"
              ? "Salvando..."
              : saveStatus === "success"
              ? "Salvo com sucesso!"
              : "Salvar"}
          </button>

          {saveStatus === "error" && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              Erro ao salvar. Tente novamente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
