import { createSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import ProductReview from "../../../components/ProductReview";
import ImageCarousel from "../../../components/ImageCarousel";
import ReviewItem from "../../../components/ReviewItem";
import RelatedProductsDisplay from "../../../components/RelatedProductsDisplay";
import { Affiliate } from "../../../components/MDXComponents";

const components = {
  ProductReview,
  ImageCarousel,
  ReviewItem,
  Affiliate,
};

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createSupabaseAdmin();

  const { data: tutoriais } = await supabase
    .from("articles")
    .select("slug")
    .eq("category", "tutoriais")
    .eq("status", "published");

  return tutoriais?.map((t) => ({ slug: t.slug })) || [];
}

export default async function TutorialPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabaseAdmin();

  const { data: tutorial, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("category", "tutoriais")
    .eq("status", "published")
    .single();

  if (error || !tutorial) return notFound();

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 md:p-10">
        <header className="mb-0">
          <div className="flex items-center gap-4 text-slate-900 text-sm border-b border-slate-100 pb-2">
            <span className="flex items-center gap-1">
              📅 {tutorial.published_date}
            </span>
            <span className="flex items-center gap-1">
              ⏱️ {tutorial.read_time} de leitura
            </span>
            <span className="flex items-center gap-1">
              ✍️ {tutorial.author}
            </span>
          </div>
        </header>

        {tutorial.image && (
          <div
            className="bg-[center_35%] mb-8 rounded-xl overflow-hidden relative h-[300px] md:h-[400px] w-full bg-cover"
            style={{ backgroundImage: `url(${tutorial.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-start md:p-10 text-white gap-5">
              <span className="bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider inline-block w-fit">
                Tutorial
              </span>
              <h1 className="pt-7 max-w-3xl text-2xl md:text-5xl font-extrabold mb-3">
                {tutorial.title}
              </h1>
              {tutorial.description && (
                <p className="text-base md:text-2xl line-clamp-2">
                  {tutorial.description}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none">
          <MDXRemote source={tutorial.content} components={components} />
        </div>

        {/* Related Products */}
        <RelatedProductsDisplay articleId={tutorial.slug} />
      </article>
    </div>
  );
}
