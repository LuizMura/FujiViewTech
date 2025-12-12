import { createSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const supabase = createSupabaseAdmin();

  let articles = [];
  let error = null;

  if (query.trim()) {
    const { data, error: dbError } = await supabase
      .from("articles")
      .select("*")
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });
    articles = data || [];
    error = dbError;
  }

  return (
    <section className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Resultados da Busca
        </h1>
        {query && (
          <p className="text-slate-600">
            {articles.length} resultado(s) encontrado(s) para "{query}"
          </p>
        )}
        {!query && (
          <p className="text-slate-600">
            Digite algo no campo de busca para encontrar artigos.
          </p>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              {article.image && (
                <Link href={`/${article.category}/${article.slug}`}>
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full font-semibold">
                    {article.category}
                  </span>
                  {article.published_date && (
                    <span>📅 {article.published_date}</span>
                  )}
                  {article.read_time && <span>⏱️ {article.read_time}</span>}
                </div>
                <Link href={`/${article.category}/${article.slug}`}>
                  <h2 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                {article.description && (
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {article.description}
                  </p>
                )}
                <Link
                  href={`/${article.category}/${article.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Ler artigo completo →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        query && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              Nenhum resultado encontrado para sua busca.
            </p>
            <p className="text-slate-400 mt-2">
              Tente usar palavras-chave diferentes.
            </p>
          </div>
        )
      )}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg">Erro ao buscar artigos.</p>
        </div>
      )}
    </section>
  );
}
