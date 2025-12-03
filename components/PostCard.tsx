import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    readTime?: string;
    price?: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const overlayTitle = post.slug === "celulares-mais-vendidos-brasil-2025";
  return (
    <article className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      {/* Image with overlay */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-top from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            {post.category}
          </span>
          <h3 className="text-white text-lg font-bold leading-snug mt-2">
            {post.title}
          </h3>
          <p className="text-white text-sm mt-1 line-clamp-2">
            {post.description}
          </p>
          <div className="flex items-center gap-4 text-white text-xs mt-2">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-indigo-600 font-semibold text-sm mt-2 group-hover:translate-x-1 transition-transform duration-300">
            Ler artigo completo <ArrowRight size={16} className="ml-2" />
          </div>
          <Link
            href={`/post/${post.slug}`}
            className="absolute inset-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
