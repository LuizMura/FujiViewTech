import React, { useEffect, useState } from "react";
import AfiliadosCard from "./AfiliadosCard";

interface Afiliado {
  nome: string;
  url: string;
  cor?: string;
  texto?: string;
  logo?: string;
}

interface ProdutoAfiliado {
  imagem: string;
  titulo: string;
  descricao: string;
  loja?: string;
  preco: string;
  afiliado1_nome: string;
  afiliado1_url: string;
  afiliado1_cor: string;
  afiliado1_texto: string;
  afiliado2_nome: string;
  afiliado2_url: string;
  afiliado2_cor: string;
  afiliado2_texto: string;
}

const AfiliadosList: React.FC = () => {
  const [produtos, setProdutos] = useState<ProdutoAfiliado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAfiliados() {
      setLoading(true);
      const res = await fetch("/api/afiliados");
      const data = await res.json();
      setProdutos(data || []);
      setLoading(false);
    }
    fetchAfiliados();
  }, []);

  if (loading) return <div>Carregando afiliados...</div>;
  if (!produtos.length) return <div>Nenhum produto afiliado encontrado.</div>;

  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {produtos.slice(0, 5).map((produto, idx) => (
        <AfiliadosCard
          key={idx}
          imagem={produto.imagem}
          titulo={produto.titulo}
          descricao={produto.descricao}
          loja={produto.loja || "Loja"}
          preco={produto.preco}
          afiliados={[
            {
              nome: produto.afiliado1_nome,
              url: produto.afiliado1_url,
              cor: produto.afiliado1_cor,
              texto: produto.afiliado1_texto,
              logo: produto.afiliado1_nome?.toLowerCase().includes("amazon")
                ? "/images/amazon-logo.png"
                : undefined,
            },
            {
              nome: produto.afiliado2_nome,
              url: produto.afiliado2_url,
              cor: produto.afiliado2_cor,
              texto: produto.afiliado2_texto,
              logo: produto.afiliado2_nome?.toLowerCase().includes("mercado")
                ? "/images/mercadolivre-logo.png"
                : undefined,
            },
          ]}
        />
      ))}
    </div>
  );
};

export default AfiliadosList;
