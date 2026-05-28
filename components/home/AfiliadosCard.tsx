"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGoogleAnalytics } from "@/lib/hooks/useGoogleAnalytics";

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
  const { trackAfiliadoClick } = useGoogleAnalytics();

  // Validação de imagens
  const toSafeUrl = (u?: string) => {
    if (!u) return undefined;
    const s = u.trim();
    if (!s) return undefined;
    if (s.startsWith("/")) return s;
    try {
      const url = new URL(s);
      if (url.protocol === "http:" || url.protocol === "https:") return s;
    } catch {
      return undefined;
    }
    return undefined;
  };

  // Galeria
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

  // Afiliados válidos (máx 2)
  const validAfiliados = afiliados
    .filter((a) => Boolean(a?.url?.trim()))
    .slice(0, 2);

  // Logo automático
  const getAffiliateLogo = (afiliado: Afiliado) => {
    if (afiliado.logo?.trim()) return afiliado.logo;

    const name = (afiliado.nome || "").toLowerCase();

    if (name.includes("amazon")) return "/images/amazon-logo.png";
    if (name.includes("mercado")) return "/images/mercadolivre-logo2.png";

    return null;
  };

  return (
    <div
      className={`w-full mx-auto bg-white rounded-sm shadow border border-slate-300 overflow-hidden flex flex-col items-center h-full ${
        compact ? "max-w-[190px] p-1.5" : "max-w-xs p-2"
      }`}
    >
      {/* IMAGEM */}
      <div className={`w-full relative ${compact ? "h-32" : "aspect-square"}`}>
        <Image
          src={imagesList[safeCurrent] || cover}
          alt={titulo}
          fill
          unoptimized
          style={{ objectFit: "contain", padding: "0.2rem" }}
          sizes="300px"
        />

        {imagesList.length > 1 && (
          <>
            <button
              onClick={() => goTo(safeCurrent - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ‹
            </button>

            <button
              onClick={() => goTo(safeCurrent + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
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

      {/* TEXTO */}
      <div className="flex-1 w-full flex flex-col items-center">
        <h3
          className={`font-bold text-slate-900 text-center mb-0.5 line-clamp-2 leading-tight ${
            compact ? "text-sm" : "text-base md:text-lg"
          }`}
        >
          {titulo}
        </h3>

        <p
          className={`text-slate-600 text-center mb-0.5 line-clamp-2 ${
            compact ? "text-[11px]" : "text-xs md:text-sm"
          }`}
        >
          {descricao}
        </p>
      </div>

      {/* PREÇO */}
      <div className="w-full flex flex-col items-center justify-center">
        <div
          className={`text-slate-500 uppercase tracking-wide ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          A partir de:
        </div>

        <div
          className={`font-semibold text-green-600 ${
            compact ? "text-sm" : "text-base md:text-lg"
          }`}
        >
          {preco}
        </div>
      </div>

      {/* BOTÕES */}
      {validAfiliados.length > 0 ? (
        <div className="w-full flex flex-col gap-2 px-2 mt-1 mb-2">
          {validAfiliados.map((afiliado, index) => {
            const logoSrc = getAffiliateLogo(afiliado);

            return (
              <a
                key={`${afiliado.nome}-${index}`}
                href={afiliado.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAfiliadoClick(afiliado.nome, titulo)}
                className={`group w-full rounded-lg flex items-center justify-center gap-2 h-9 text-sm font-semibold transition-all shadow-lg
                  ${
                    index === 0
                      ? "ring-1 ring-gray-300"
                      : "ring-1 ring-gray-300"
                  }
                  `}
                style={{
                  backgroundColor: afiliado.nome
                    .toLowerCase()
                    .includes("mercado")
                    ? "#ffe600"
                    : logoSrc
                      ? "#ffffff"
                      : afiliado.cor || "#ac3e3e",
                }}
              >
                {logoSrc && (
                  <Image
                    src={logoSrc}
                    alt={afiliado.nome}
                    width={
                      afiliado.nome.toLowerCase().includes("mercado") ? 120 : 95
                    }
                    height={
                      afiliado.nome.toLowerCase().includes("mercado") ? 36 : 30
                    }
                    className="object-contain transition-transform duration-200 group-hover:scale-110"
                  />
                )}

                <span className="sr-only">
                  {afiliado.texto || `Ver na ${afiliado.nome}`}
                </span>
              </a>
            );
          })}
        </div>
      ) : (
        <div
          className={`w-full rounded-lg bg-gray-400 text-white font-semibold flex items-center justify-center mt-2 ${
            compact ? "h-8 text-xs" : "h-10 text-sm"
          }`}
        >
          Indisponível
        </div>
      )}
    </div>
  );
};

export default AfiliadosCard;
