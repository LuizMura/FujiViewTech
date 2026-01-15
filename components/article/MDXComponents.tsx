"use client";

import React, { useState, useEffect } from "react";
import AfiliadosCard from "@/components/home/AfiliadosCard";
import ProductRow from "@/components/article/ProductRow";

type Afiliado = {
  nome: string;
  url: string;
  cor?: string;
  texto?: string;
  logo?: string;
};

type AfiliadoProduto = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  loja: string;
  preco: number;
  afiliado_url: string;
  status: string;
  publicado_em: string;
  imagem: string;
  button_text: string;
  button_color: string;
  views?: number;
  clicks?: number;
  compras?: number;
  receita?: number;
};

type AfiliadosCardProps = {
  imagem?: string;
  imagens?: string[];
  titulo: string;
  descricao: string;
  loja: string;
  preco: string;
  afiliados?: Afiliado[];
  // Props para MDX - apenas ID
  afiliadoId?: string;
};

export function Affiliate({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer sponsored"
      className="inline-block px-3 py-1 border rounded"
    >
      {children}
    </a>
  );
}

export function AffiliateBox({
  url,
  title,
  description,
  price,
  buttonText = "Ver Oferta",
}: {
  url: string;
  title: string;
  description?: string;
  price?: string;
  buttonText?: string;
}) {
  return (
    <div className="my-6 p-6 bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-700 mb-4">{description}</p>}
      {price && (
        <p className="text-2xl font-bold text-blue-600 mb-4">{price}</p>
      )}
      <a
        href={url}
        target="_blank"
        rel="nofollow noopener noreferrer sponsored"
        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        {buttonText} →
      </a>
    </div>
  );
}

export function ProductCard({
  url,
  title,
  description,
  price,
  image,
  buttonText = "Ver Produto",
}: {
  url: string;
  title: string;
  description?: string;
  price?: string;
  image?: string;
  buttonText?: string;
}) {
  return (
    <div className="my-6 overflow-hidden bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow">
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {price && (
          <p className="text-2xl font-bold text-green-600 mb-4">{price}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="nofollow noopener noreferrer sponsored"
          className="inline-block w-full text-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          {buttonText} →
        </a>
      </div>
    </div>
  );
}

export function SpecsTable({ specs }: { specs: Record<string, string> }) {
  return (
    <div className="my-6 overflow-hidden border border-gray-200 rounded-xl">
      <table className="w-full">
        <tbody>
          {Object.entries(specs).map(([key, value], index) => (
            <tr
              key={key}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-3 font-semibold text-gray-900 border-r border-gray-200 w-1/3">
                {key}
              </td>
              <td className="px-6 py-3 text-gray-700">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AfiliadosCardBlock(props: AfiliadosCardProps) {
  // Se já veio com afiliados array (compatibilidade anterior)
  if (props.afiliados && props.afiliados.length > 0) {
    return <AfiliadosCard {...props} afiliados={props.afiliados} />;
  }

  // Se veio com todos os campos necessários para renderizar
  if (props.titulo && props.loja && props.preco) {
    return <AfiliadosCard {...props} afiliados={props.afiliados || []} />;
  }

  // Fallback vazio se não tem dados
  return null;
}

export const components = {
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-accent underline" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
    // Evita <p> dentro de <p> filtrando children que já são elementos block
    const { children, ...rest } = props;

    // Verifica se há elementos block dentro do parágrafo
    const hasBlockElement = React.Children.toArray(children).some((child) => {
      if (!React.isValidElement(child)) return false;
      const blockElements = [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "blockquote",
        "div",
        "article",
        "p",
      ];
      return blockElements.includes(
        typeof child.type === "string" ? child.type : ""
      );
    });

    if (hasBlockElement) {
      return <div {...rest}>{children}</div>;
    }

    return <p {...rest}>{children}</p>;
  },
  Affiliate,
  AffiliateBox,
  ProductCard,
  SpecsTable,
  AfiliadosCard: AfiliadosCardBlock,
  AfiliadosCardBlock,
  ProductRow,
};
