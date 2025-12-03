import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export default async function ReviewsPage() {
  // Load all review MDX files
  const reviewsDir = path.join(process.cwd(), 'content', 'reviews')
  const filenames = fs.readdirSync(reviewsDir).filter((f) => f.endsWith('.mdx'))
  const reviews = filenames.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, '')
    const filePath = path.join(reviewsDir, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)
    return {
      slug,
      title: data.title ?? slug,
      image: data.image ?? '',
      description: data.description ?? ''
    }
  })

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.slug}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {review.image && (
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${review.image})` }}
              />
            )}
            <div className="p-4">
              <Link href={`/reviews/${review.slug}`}>
                <h2 className="text-xl font-semibold text-indigo-600 hover:underline">
                  {review.title}
                </h2>
              </Link>
              {review.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {review.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
