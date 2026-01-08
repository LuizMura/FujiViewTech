// components/ProductRow.tsx
import React from "react";

type ProductRowProps = {
  image: string;
  title: string;
  children?: React.ReactNode;
};

export default function ProductRow({
  image,
  title,
  children,
}: ProductRowProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center my-10">
      <img src={image} alt={title} className="w-64 rounded-xl" />
      <div
        className="space-y-3 text-slate-900 max-w-none
        [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h1]:mt-0 [&_h1]:mb-3
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:mt-0 [&_h2]:mb-3
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:mt-0 [&_h3]:mb-2
        [&_p]:text-base [&_p]:leading-7 [&_p]:text-slate-800
        [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
      >
        <h3 className="text-xl font-bold mb-2 !mb-3 !mt-0">{title}</h3>
        {children}
      </div>
    </div>
  );
}
