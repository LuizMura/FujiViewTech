import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarrosselNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageClick: (pageIndex: number) => void;
  title?: string;
}

const CarrosselNavigation: React.FC<CarrosselNavigationProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onPageClick,
  title,
}) => {
  return (
    <div className="relative flex items-center mb-2 md:mb-8">
      {title && (
        <h2 className="text-lg md:text-2xl font-bold text-slate-100">
          {title}
        </h2>
      )}

      {totalPages > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4">
          <button
            onClick={onPrev}
            className="p-1.5 md:p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6 text-slate-900" />
          </button>

          {/* Indicadores de página */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onPageClick(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage
                    ? "bg-slate-900 w-6"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Página ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className="p-1.5 md:p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
            aria-label="Próximo"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6 text-slate-900" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CarrosselNavigation;
