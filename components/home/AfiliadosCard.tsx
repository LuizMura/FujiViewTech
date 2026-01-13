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

const AfiliadosCard: React.FC<AfiliadosCardProps> = ({
  imagem,
  imagens,
  titulo,
  descricao,
  loja,
  preco,
  afiliados,
}) => {
  // Normaliza e valida URLs de imagens para evitar erros do next/image
  const toSafeUrl = (u?: string) => {
    if (!u) return undefined;
    const s = u.trim();
    if (!s) return undefined;
    // permite caminhos relativos do /public
    if (s.startsWith("/")) return s;
    try {
      const url = new URL(s);
      if (url.protocol === "http:" || url.protocol === "https:") return s;
    } catch (e) {
      return undefined;
    }
    return undefined;
  };

  const rawGallery =
    imagens && imagens.length ? imagens : imagem ? [imagem] : [];
  const validGallery = rawGallery
    .map((u) => toSafeUrl(u))
    .filter((v): v is string => Boolean(v));
  const cover = validGallery[0] || "/images/og-default.png";
  const imagesList = validGallery.length ? validGallery : [cover];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [imagesList.length]);

  const goTo = (idx: number) => {
    if (!imagesList.length) return;
    const next = (idx + imagesList.length) % imagesList.length;
    setCurrent(next);
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-sm md:rounded-xl shadow border overflow-hidden flex flex-col items-center p-2 h-full">
      <div className="w-full aspect-square relative mb-1">
        <Image
          src={imagesList[current] || cover}
          alt={titulo}
          fill
          style={{ objectFit: "cover", padding: "0.5rem" }}
          sizes="300px"
        />
        {imagesList.length > 1 && (
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
              {imagesList.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    idx === current ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex-1 w-full flex flex-col items-center">
        <h3 className="text-base md:text-lg font-bold text-slate-900 text-center mb-1 line-clamp-2 leading-tight">
          {titulo}
        </h3>
        <p className="text-xs md:text-sm text-slate-600 text-center mb-1 line-clamp-2">
          {descricao}
        </p>
      </div>
      <div className="w-full flex flex-col items-center mb-1">
        <div className="text-sm font-semibold text-slate-700 text-center">
          {loja}
        </div>
        <div className="text-base md:text-lg font-bold text-green-600">
          {preco}
        </div>
      </div>
      {afiliados[0]?.url ? (
        <a
          href={afiliados[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-7 md:h-10 rounded-lg bg-[#ac3e3e] text-white text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 flex items-center justify-center"
        >
          COMPRAR
        </a>
      ) : (
        <div className="w-full h-7 md:h-10 rounded-lg bg-gray-400 text-white text-sm font-semibold flex items-center justify-center cursor-not-allowed">
          Indisponível
        </div>
      )}
    </div>
  );
};

export default AfiliadosCard;
