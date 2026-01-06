import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Afiliado {
  nome: string;
  url: string;
  cor?: string;
  texto?: string;
  logo?: string;
}

interface AfiliadosCardProps {
  imagem?: string;
  imagens?: string[];
  titulo: string;
  descricao: string;
  loja: string;
  preco: string;
  afiliados: Afiliado[];
}

const AfiliadosCard: React.FC<AfiliadosCardProps> = ({ imagem, imagens, titulo, descricao, loja, preco, afiliados }) => {
  const gallery = imagens && imagens.length ? imagens : imagem ? [imagem] : [];
  const cover = gallery[0] || "/images/og-default.png";
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [gallery.length]);

  const goTo = (idx: number) => {
    if (!gallery.length) return;
    const next = (idx + gallery.length) % gallery.length;
    setCurrent(next);
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow border overflow-hidden flex flex-col items-center p-4 h-full">
      <div className="w-full aspect-square relative mb-3">
        <Image src={gallery[current] || cover} alt={titulo} fill style={{ objectFit: "cover", borderRadius: 12 }} sizes="300px" />
        {gallery.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Próximo"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {gallery.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full ${idx === current ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <h3 className="text-base md:text-lg font-bold text-slate-900 text-center mb-1 line-clamp-2">{titulo}</h3>
      <p className="text-xs md:text-sm text-slate-600 text-center mb-2 line-clamp-2">{descricao}</p>
      <div className="text-sm font-semibold text-slate-700 text-center mb-2">{loja}</div>
      <div className="text-lg font-bold text-green-600 mb-3 flex-grow">{preco}</div>
      <a
        href={afiliados[0]?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-10 rounded-lg bg-[#ac3e3e] text-white text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 flex items-center justify-center mt-auto"
      >
        COMPRAR
      </a>
    </div>
  );
};

export default AfiliadosCard;
