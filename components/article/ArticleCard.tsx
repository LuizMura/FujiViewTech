import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  titleColor?: string;
  titleFontSize?: number;
  excerptColor?: string;
  excerptFontSize?: number;
  bgColor?: string;
  bgOpacity?: string;
  className?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonFontSize?: number;
  buttonBorderRadius?: number;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  image,
  category,
  titleColor = "#ffffff",
  titleFontSize = 18,
  excerptColor = "#e2e8f0",
  excerptFontSize = 14,
  bgColor = "#000000",
  bgOpacity = "60",
  className = "",
  showButton = false,
  buttonText = "Ver mais",
  buttonBgColor = "#3b82f6",
  buttonTextColor = "#ffffff",
  buttonFontSize = 14,
  buttonBorderRadius = 8,
}: ArticleCardProps) {
  return (
    <Link href={`/${category}/${slug}`}>
      <article
        className={`relative bg-white rounded-lg overflow-hidden shadow-lg h-48 group cursor-pointer hover:shadow-xl transition-shadow ${className}`}
      >
        {/* Imagem de fundo */}
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Texto sobreposto */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div
            className="p-3 rounded"
            style={{
              backgroundColor: `${bgColor}${Math.round(
                (parseInt(bgOpacity) / 100) * 255
              )
                .toString(16)
                .padStart(2, "0")}`,
            }}
          >
            <h4
              style={{
                fontSize: `${titleFontSize}px`,
                color: titleColor,
              }}
              className="font-bold mb-1 line-clamp-2"
            >
              {title}
            </h4>
            {excerpt && (
              <p
                style={{
                  fontSize: `${excerptFontSize}px`,
                  color: excerptColor,
                }}
                className="line-clamp-2"
              >
                {excerpt}
              </p>
            )}
            {showButton && (
              <button
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                  fontSize: `${buttonFontSize}px`,
                  borderRadius: `${buttonBorderRadius}px`,
                }}
                className="mt-2 px-4 py-2 font-semibold transition-opacity hover:opacity-90"
                onClick={(e) => e.preventDefault()}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
