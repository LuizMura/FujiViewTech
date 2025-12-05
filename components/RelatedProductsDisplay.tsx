"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import ReviewItem from "./ReviewItem";

interface RelatedProduct {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  affiliate_link_1?: string;
  affiliate_text_1?: string;
  affiliate_link_2?: string;
  affiliate_text_2?: string;
}

interface Props {
  articleId: string;
}

export default function RelatedProductsDisplay({ articleId }: Props) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return null; // Não mostra nada enquanto carrega
  }

  if (products.length === 0) {
    return null; // Não mostra nada se não houver produtos
  }

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        📱 Produtos Relacionados
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {products.map((product) => (
          <ReviewItem
            key={product.id}
            title={product.title}
            subtitle={product.subtitle}
            description={product.description}
            image={product.image}
            affiliateLink1={product.affiliate_link_1}
            affiliateText1={product.affiliate_text_1}
            affiliateLink2={product.affiliate_link_2}
            affiliateText2={product.affiliate_text_2}
          />
        ))}
      </div>
    </div>
  );
}
