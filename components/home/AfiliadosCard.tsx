import React, { useState } from "react";
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
  compact?: boolean;
}

const AfiliadosCard: React.FC<AfiliadosCardProps> = ({
  imagem,
  imagens,
  titulo,
  descricao,
  loja,
  preco,
  afiliados,
  compact = false,
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
    } catch {
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
  const safeCurrent = imagesList.length ? current % imagesList.length : 0;

  const goTo = (idx: number) => {
    if (!imagesList.length) return;
    const next = (idx + imagesList.length) % imagesList.length;
    setCurrent(next);
  };

  return (
    <div
      className={`w-full mx-auto bg-white rounded-sm shadow border border-slate-300 overflow-hidden flex flex-col items-center h-full ${
        compact ? "max-w-[190px] p-1.5" : "max-w-xs p-2"
      }`}
    >
      <div
        className={`w-full relative mb-1 ${compact ? "h-32" : "aspect-square"}`}
      >
        <Image
          src={imagesList[safeCurrent] || cover}
          alt={titulo}
          fill
          unoptimized
          style={{ objectFit: "contain", padding: "0.5rem" }}
          sizes="300px"
        />
        {imagesList.length > 1 && (
          <>
            <button
              onClick={() => goTo(safeCurrent - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => goTo(safeCurrent + 1)}
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
                    idx === safeCurrent ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex-1 w-full flex flex-col items-center">
        <h3
          className={`font-bold text-slate-900 text-center mb-1 line-clamp-2 leading-tight ${
            compact ? "text-sm" : "text-base md:text-lg"
          }`}
        >
          {titulo}
        </h3>
        <p
          className={`text-slate-600 text-center mb-1 line-clamp-2 ${
            compact ? "text-[11px]" : "text-xs md:text-sm"
          }`}
        >
          {descricao}
        </p>
      </div>
      <div className="w-full flex flex-col items-center mb-1">
        <div
          className={`font-semibold text-slate-700 text-center ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {loja}
        </div>
        <div
          className={`font-bold text-green-600 ${
            compact ? "text-sm" : "text-base md:text-lg"
          }`}
        >
          {preco}
        </div>
      </div>
      {afiliados[0]?.url ? (
        <a
          href={afiliados[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full rounded-lg text-white font-semibold transition-transform duration-200 hover:-translate-y-0.5 flex items-center justify-center ${
            compact ? "h-8 text-xs" : "h-7 md:h-10 text-sm"
          }`}
          style={{
            backgroundColor: afiliados[0]?.cor || "#ac3e3e",
          }}
        >
          {afiliados[0]?.texto || "COMPRAR"}
        </a>
      ) : (
        <div
          className={`w-full rounded-lg bg-gray-400 text-white font-semibold flex items-center justify-center cursor-not-allowed ${
            compact ? "h-8 text-xs" : "h-7 md:h-10 text-sm"
          }`}
        >
          Indisponível
        </div>
      )}
    </div>
  );
};

export default AfiliadosCard;
