"use client";

import Image from "next/image";

interface PreviewCardProps {
  article: {
    title: string;
    excerpt?: string;
    image?: string;
    titleColor: string;
    titleFontSize: number;
    excerptColor: string;
    excerptFontSize: number;
    bgColor: string;
    bgOpacity: number;
    showButton: boolean;
    buttonText: string;
    buttonBgColor: string;
    buttonTextColor: string;
    buttonFontSize: number;
    buttonBorderRadius: number;
    readTime?: string;
  };
}

export default function PreviewCard({ article }: PreviewCardProps) {
  const bgStyle = {
    backgroundColor: article.bgColor,
    opacity: article.bgOpacity / 100,
  };

  const titleStyle = {
    color: article.titleColor,
    fontSize: `${article.titleFontSize}px`,
  };

  const excerptStyle = {
    color: article.excerptColor,
    fontSize: `${article.excerptFontSize}px`,
  };

  const buttonStyle = {
    backgroundColor: article.buttonBgColor,
    color: article.buttonTextColor,
    fontSize: `${article.buttonFontSize}px`,
    borderRadius: `${article.buttonBorderRadius}px`,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Preview em Tempo Real
      </h2>

      <div className="space-y-8">
        {/* Preview Vertical (ArticleCard) */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Layout Vertical
          </h3>
          <div className="max-w-sm">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
              {/* Imagem */}
              {article.image ? (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Sem imagem</span>
                </div>
              )}

              {/* Conteúdo */}
              <div className="p-6 space-y-3" style={bgStyle}>
                {/* Título */}
                <h3 className="font-bold leading-tight" style={titleStyle}>
                  {article.title || "Título do artigo"}
                </h3>

                {/* Resumo */}
                {article.excerpt && (
                  <p className="line-clamp-2" style={excerptStyle}>
                    {article.excerpt}
                  </p>
                )}

                {/* Read Time */}
                {article.readTime && (
                  <p className="text-xs text-gray-500">⏱️ {article.readTime}</p>
                )}

                {/* Botão */}
                {article.showButton && (
                  <button
                    className="px-4 py-2 font-medium transition-opacity hover:opacity-90"
                    style={buttonStyle}
                  >
                    {article.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Horizontal */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Layout Horizontal
          </h3>
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group flex">
              {/* Imagem */}
              {article.image ? (
                <div className="relative w-[230px] h-[230px] flex-shrink-0 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-[230px] h-[230px] bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-sm">Sem imagem</span>
                </div>
              )}

              {/* Conteúdo */}
              <div
                className="flex-1 p-6 space-y-3 flex flex-col"
                style={bgStyle}
              >
                {/* Título */}
                <h3 className="font-bold leading-tight" style={titleStyle}>
                  {article.title || "Título do artigo"}
                </h3>

                {/* Resumo */}
                {article.excerpt && (
                  <p className="line-clamp-3 flex-1" style={excerptStyle}>
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {/* Read Time */}
                  {article.readTime && (
                    <p className="text-xs text-gray-500">
                      ⏱️ {article.readTime}
                    </p>
                  )}

                  {/* Botão */}
                  {article.showButton && (
                    <button
                      className="px-4 py-2 font-medium transition-opacity hover:opacity-90"
                      style={buttonStyle}
                    >
                      {article.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview em Lista */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Preview na Home
          </h3>
          <div className="bg-gray-100 p-8 rounded-lg">
            <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                {article.image ? (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-200" />
                )}

                <div className="p-4 space-y-2" style={bgStyle}>
                  <h3
                    className="font-bold leading-tight line-clamp-2"
                    style={{
                      ...titleStyle,
                      fontSize: `${article.titleFontSize * 0.9}px`,
                    }}
                  >
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p
                      className="line-clamp-2"
                      style={{
                        ...excerptStyle,
                        fontSize: `${article.excerptFontSize * 0.9}px`,
                      }}
                    >
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>

              {/* Card 2 (mesmo) */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                {article.image ? (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-200" />
                )}

                <div className="p-4 space-y-2" style={bgStyle}>
                  <h3
                    className="font-bold leading-tight line-clamp-2"
                    style={{
                      ...titleStyle,
                      fontSize: `${article.titleFontSize * 0.9}px`,
                    }}
                  >
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p
                      className="line-clamp-2"
                      style={{
                        ...excerptStyle,
                        fontSize: `${article.excerptFontSize * 0.9}px`,
                      }}
                    >
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
