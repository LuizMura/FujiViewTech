import Link from 'next/link'
export default function NoticiasPage(){
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Notícias</h1>
      <div className="grid gap-4">
        <article className="card">
          <h2 className="font-semibold">Nova atualização do sistema X</h2>
          <p className="text-sm text-gray-600">Recursos anunciados e timelines.</p>
          <div className="mt-2"><Link href="/noticias/atualizacao-x">Ler mais →</Link></div>
        </article>
      </div>
    </section>
  )
}
