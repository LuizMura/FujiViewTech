"use client";

import Image from "next/image";
import Link from "next/link";

interface ReviewItemProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  affiliateLink1?: string;
  affiliateText1?: string;
  affiliateLink2?: string;
  affiliateText2?: string;
}

export default function ReviewItem({
  title,
  subtitle,
  description,
  image,
  affiliateLink1,
  affiliateText1 = "Comprar",
  affiliateLink2,
  affiliateText2 = "Ver Mais",
}: ReviewItemProps) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white hover:shadow-lg transition-all duration-300"
      style={{
        width: "100%",
        maxWidth: "230px",
        minWidth: "230px",
      }}
    >
      {/* Title */}
      <div className="px-4 pt-3">
        <h1 className="text-lg md:text-xl font-bold text-slate-900 line-clamp-2">
          {title}
        </h1>
      </div>

      {/* Image Square */}
      <div className="relative w-full aspect-square mx-auto px-4 py-3">
        {image && (
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-100">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>

      {/* Subtitle */}
      <div className="px-4 pt-1">
        <h2 className="text-sm font-semibold text-indigo-600">{subtitle}</h2>
      </div>

      {/* Description */}
      <div className="px-4 py-2 flex-1">
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Affiliate Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        {affiliateLink1 && (
          <Link
            href={affiliateLink1}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-center text-xs md:text-sm"
          >
            {affiliateText1}
          </Link>
        )}
        {affiliateLink2 && (
          <Link
            href={affiliateLink2}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-center text-xs md:text-sm"
          >
            {affiliateText2}
          </Link>
        )}
      </div>
    </div>
  );
}
