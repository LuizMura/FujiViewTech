"use client";
import React from "react";
import ImageCarousel from "./ImageCarousel";
import {
  Check,
  X,
  Cpu,
  Smartphone,
  Camera,
  Battery,
  HardDrive,
  CircleDollarSign,
} from "lucide-react";

interface ProductReviewProps {
  name: string;
  description: string;
  images: string[];
  specs: {
    screen: string;
    processor: string;
    ramStorage: string;
    camera: string;
    battery: string;
    price: string;
  };
  pros?: string[];
  cons?: string[];
  mercadoLivreUrl?: string;
  amazonUrl?: string;
}

export default function ProductReview({
  name,
  description,
  images,
  specs,
  pros = [],
  cons = [],
  mercadoLivreUrl,
  amazonUrl,
}: ProductReviewProps) {
  return (
    <div className="my-10 bg-slate-200 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 md:p-6">
        {/* Header - Now at top */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 m-0 mb-2">
            {name}
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>

        {/* Top Section: Carousel + Specs (Side by Side) */}
        <div className="flex gap-5 mb-6">
          {/* Left: Carousel (Smaller) */}
          <div className="w-[350px]">
            <div className="rounded-xl shadow-md border border-slate-100 bg-white">
              {/* Wrapping ImageCarousel to control height/size */}
              <div className="p-2 h-[350px]">
                <ImageCarousel images={images} alt={name} />
              </div>
            </div>
          </div>

          {/* Right: Technical Specs */}
          <div className="w-[600px] bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100">
            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 m-0">
              <Smartphone size={18} className="text-indigo-600" /> Ficha Técnica
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Smartphone
                  size={14}
                  className="text-slate-400 flex-shrink-0"
                />
                <span className="font-semibold text-slate-700 min-w-[60px]">
                  Tela:
                </span>
                <span className="text-slate-600">{specs.screen}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Cpu size={14} className="text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700 min-w-[60px]">
                  CPU:
                </span>
                <span className="text-slate-600">{specs.processor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HardDrive size={14} className="text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700 min-w-[60px]">
                  Memória:
                </span>
                <span className="text-slate-600">{specs.ramStorage}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Camera size={14} className="text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700 min-w-[60px]">
                  Câmeras:
                </span>
                <span className="text-slate-600">{specs.camera}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Battery size={14} className="text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-700 min-w-[60px]">
                  Bateria:
                </span>
                <span className="text-slate-600">{specs.battery}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CircleDollarSign
                  size={14}
                  className="text-slate-400 flex-shrink-0"
                />
                <span className="font-semibold text-slate-700">Preço:</span>
                <span className="text-slate-600">{specs.price}</span>
              </div>

              {/* Affiliate Buttons */}
              {(mercadoLivreUrl || amazonUrl) && (
                <div className="border-t border-slate-200 pt-2 mt-2 flex items-center gap-5">
                  <div className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                    Compre Agora:
                  </div>
                  <div className="flex gap-5 flex-1">
                    {mercadoLivreUrl && (
                      <a
                        href={mercadoLivreUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer sponsored"
                        className="w-30 flex items-center justify-center rounded-lg transition-all hover:shadow-md border border-slate-200 overflow-hidden h-10"
                      >
                        <img
                          src="/images/mercadolivre-logo.png"
                          alt="Mercado Livre"
                          className="h-100%"
                        />
                      </a>
                    )}
                    {amazonUrl && (
                      <a
                        href={amazonUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer sponsored"
                        className="w-30 flex items-center justify-center rounded-lg transition-all hover:shadow-md border border-slate-200 overflow-hidden h-10"
                      >
                        <img
                          src="/images/amazon-logo.png"
                          alt="Amazon"
                          className="h-100%"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Pros & Cons Table */}
        {(pros.length > 0 || cons.length > 0) && (
          <div className="grid md:grid-cols-2 border border-slate-200 rounded-xl overflow-hidden">
            {/* Pros */}
            <div className="bg-green-50/30 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-200">
              <h4 className="text-green-700 font-bold mb-3 flex items-center gap-2 m-0 text-base">
                <Check size={18} /> Vantagens
              </h4>
              <ul className="space-y-2 m-0 p-0 list-none">
                {pros.map((pro, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 min-w-4 text-green-600">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-red-50/30 p-4 md:p-5">
              <h4 className="text-red-700 font-bold mb-3 flex items-center gap-2 m-0 text-base">
                <X size={18} /> Desvantagens
              </h4>
              <ul className="space-y-2 m-0 p-0 list-none">
                {cons.map((con, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 min-w-4 text-red-500">✕</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
