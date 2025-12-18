
import HeroWrapper from "../components/HeroWrapper";
import { getAllPosts } from "@/lib/posts";

export default async function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="container-custom pb-20">
      {/* Hero Section with Live Prices */}
      <HeroWrapper />
      {/* Lista de posts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Últimos Artigos</h2>
        <ul>
          {posts.map(post => (
            <li key={post.slug} className="mb-2">
              {post.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
