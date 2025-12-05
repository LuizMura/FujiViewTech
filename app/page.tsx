import React from "react";
import PostCard from "../components/PostCard";
import HeroWrapper from "../components/HeroWrapper";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="container-custom pb-20">
      {/* Hero Section with Live Prices */}
      <HeroWrapper />

      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Últimas Novidades
          </h2>
          <p className="text-slate-500">
            Fique por dentro do mundo da tecnologia
          </p>
        </div>
        <a
          href="/categoria/todas"
          className="hidden md:inline-flex text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          Ver tudo →
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-12 text-center md:hidden">
        <a
          href="/categoria/todas"
          className="inline-flex px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
        >
          Ver todos os artigos
        </a>
      </div>
    </div>
  );
}
