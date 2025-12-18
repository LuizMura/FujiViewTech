import React from "react";
import Image from "next/image";

interface Afiliado {
  nome: string;
  url: string;
  cor: string;
  texto: string;
}

interface AfiliadosCardProps {
  imagem: string;
  titulo: string;
  descricao: string;
  preco: string;
  afiliados: [Afiliado, Afiliado];
}

const AfiliadosCard: React.FC<AfiliadosCardProps> = ({ imagem, titulo, descricao, preco, afiliados }) => {
  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow border overflow-hidden flex flex-col items-center p-4">
      <div className="w-full aspect-square relative mb-3">
        <Image src={imagem} alt={titulo} fill style={{ objectFit: "cover", borderRadius: 12 }} sizes="300px" />
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 text-center mb-1 line-clamp-2">{titulo}</h3>
      <p className="text-xs md:text-sm text-slate-600 text-center mb-2 line-clamp-2">{descricao}</p>
      <div className="text-lg font-bold text-green-600 mb-3">{preco}</div>
      <div className="flex gap-3 w-full">
        {afiliados.map((af, idx) => (
          <a
            key={idx}
            href={af.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-2 py-2 rounded-lg text-xs font-semibold text-white text-center transition-colors duration-200"
            style={{ backgroundColor: af.cor }}
          >
            {af.texto || `Comprar em ${af.nome}`}
          </a>
        ))}
      </div>
    </div>
  );
};

export default AfiliadosCard;
