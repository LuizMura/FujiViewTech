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
  const imageUrl = post.image || "/images/placeholder.jpg";

  return (
    <Link href={`/artigos/${post.slug}`}>
      <article className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-slate-200">
          {post.image ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <span className="text-6xl">📱</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full self-start mb-3">
            {post.category}
          </span>

          <h3 className="text-slate-900 text-xl font-bold leading-snug mb-2">
            {post.title}
          </h3>

          <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
            {post.description}
          </p>

          <div className="flex items-center gap-4 text-slate-500 text-xs mb-4">
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

          <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
            Ler artigo completo <ArrowRight size={16} className="ml-2" />
          </div>
        </div>
      </article>
    </Link>
  );
}
