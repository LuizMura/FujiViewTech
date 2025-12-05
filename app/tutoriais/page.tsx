import { createSupabaseAdmin } from "@/lib/supabase";
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60;

export default async function TutoriaisPage() {
  const supabase = createSupabaseAdmin();

  const { data: tutoriais } = await supabase
    .from("articles")
    .select("*")
    .eq("category", "tutoriais")
    .eq("status", "published")
    .order("published_date", { ascending: false });

  const tutoriaisList = tutoriais || [];

  return (
    <section className="container-custom py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Tutoriais</h1>
        <p className="text-lg text-slate-600">
          Guias práticos e passo a passo para dominar a tecnologia
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tutoriaisList.map((tutorial) => (
          <article
            key={tutorial.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 group"
          >
            {tutorial.image && (
              <Link href={`/tutoriais/${tutorial.slug}`}>
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <Image
                    src={tutorial.image}
                    alt={tutorial.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-semibold">
                  Tutorial
                </span>
                {tutorial.published_date && <span>📅 {tutorial.published_date}</span>}
                {tutorial.read_time && <span>⏱️ {tutorial.read_time}</span>}
              </div>

              <Link href={`/tutoriais/${tutorial.slug}`}>
                <h2 className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors mb-3 line-clamp-2">
                  {tutorial.title}
                </h2>
              </Link>

              {tutorial.description && (
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {tutorial.description}
                </p>
              )}

              <Link
                href={`/tutoriais/${tutorial.slug}`}
                className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Ver tutorial completo →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {tutoriaisList.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">
            Nenhum tutorial encontrado. Use o dashboard para criar o primeiro!
          </p>
        </div>
      )}
    </section>
  )
}
