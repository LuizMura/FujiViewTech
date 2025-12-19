

import Link from "next/link";
import type { Article } from "@/lib/types/article";

interface CategoriaCardProps {
  post: Article;
}



const CategoriaCard: React.FC<CategoriaCardProps> = ({ post }) => {
  return (
    <Link href={`/artigos/${post.slug}`} className="block group">
      <div className="p-0 shadow rounded-2xl bg-white group-hover:shadow-lg transition-shadow w-full max-w-xs min-h-[340px] flex flex-col justify-start
        sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
        min-h-[340px] max-h-[420px] h-full">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover mb-3"
            style={{ display: 'block', width: '100%', height: '240px', objectFit: 'cover', borderRadius: "15px 15px 0 0", margin: 0 }}
          />
        )}
        <div className="px-4 py-2">
          <div className="flex items-center text-xs text-slate-500 mb-0 gap-2">
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : ""}</span>
            <span>•</span>
            <span>{post.readTime || ""}</span>
          </div>
          <h2 className="text-lg font-bold mb-0 group-hover:text-blue-600 transition-colors line-clamp-2 text-black">{post.title}</h2>
          <p className="text-slate-600 text-sm line-clamp-3">{post.description || post.excerpt || ""}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoriaCard;
