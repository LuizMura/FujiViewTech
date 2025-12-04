import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ProductReview from '../../../components/ProductReview'
import ImageCarousel from '../../../components/ImageCarousel'

import { Affiliate } from '../../../components/MDXComponents'

const components = {
  ProductReview,
  ImageCarousel,
  Affiliate
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'reviews')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir)
  return files.map(f => ({ slug: f.replace(/\.mdx?$/, '') }))
}

export default async function ReviewPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const postPath = path.join(process.cwd(), 'content', 'reviews', `${slug}.mdx`)

  if (!fs.existsSync(postPath)) return notFound()

  const raw = fs.readFileSync(postPath, 'utf-8')
  const { content, data } = matter(raw)

  return (
    
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 md:p-10">
{/* Informações do artigo */}
        <header className="mb-0">
          <div className="flex items-center gap-4 text-slate-900 text-sm border-b border-slate-100 pb-2">
            <span className="flex items-center gap-1">📅 {data.date}</span>
            <span className="flex items-center gap-1">⏱️ {data.readTime || '5 min'} de leitura</span>
            <span className="flex items-center gap-1">✍️ {data.author || 'FujiViewTech'}</span>
          </div>
        </header>

        {/* IMAGEM ESTÁ COMO BACKGROUND */}
        {/* bg-[center_35%] <-É ISSO QUE ESTÁ AJUSTANDO A IMG PARA CIMA OU PARA BAIXO> */}
        {data.image && (
          <div 
            className="bg-[center_35%] mb-8 rounded-xl overflow-hidden relative h-[300px] md:h-[400px] w-full bg-cover"
            style={{ backgroundImage: `url(${data.image})` }}
          >
            {/* Overlay escurecido */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

            {/* Conteúdo sobre a imagem */}
            <div className="absolute inset-0 flex flex-col justify-start md:p-10 text-white gap-5">
              <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider inline-block w-fit">
                {data.category || 'Review'}
              </span>

              <h1 className="pt-7 max-w-3xl text-2xl md:text-5xl font-extrabold mb-3">
                {data.title}
              </h1>

              {data.description && (
                <p className="text-base md:text-2xl line-clamp-2">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        )}

        

        {/* Conteúdo MDX */}
        <div className="prose prose-lg prose-slate max-w-none">
          <MDXRemote source={content} components={components} />
        </div>

      </article>
    </div>
  )
}
