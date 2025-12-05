import { createSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ReviewsPage() {
  const supabase = createSupabaseAdmin();

  const { data: reviews, error } = await supabase
    .from("articles")
    .select("*")
    .eq("category", "reviews")
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (error) {
    console.error("Error loading reviews:", error);
  }

  const reviewsList = reviews || [];

  return (
    <section className="container-custom py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Reviews</h1>
        <p className="text-lg text-slate-600">
          Análises completas dos melhores produtos de tecnologia
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviewsList.map((review) => (
          <article
            key={review.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 group"
          >
            {review.image && (
              <Link href={`/reviews/${review.slug}`}>
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <Image
                    src={review.image}
                    alt={review.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            )}

            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full font-semibold">
                  Review
                </span>
                {review.published_date && (
                  <span>📅 {review.published_date}</span>
                )}
                {review.read_time && <span>⏱️ {review.read_time}</span>}
              </div>

              <Link href={`/reviews/${review.slug}`}>
                <h2 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                  {review.title}
                </h2>
              </Link>

              {review.description && (
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {review.description}
                </p>
              )}

              <Link
                href={`/reviews/${review.slug}`}
                className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Ler review completo →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {reviewsList.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">
            Nenhum review encontrado. Use o dashboard para criar o primeiro!
          </p>
        </div>
      )}
    </section>
  );
}
