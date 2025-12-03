export const metadata = { title: 'Tecnologia — FujiviewTech', description: 'Artigos sobre tecnologia.' }
export default function TecnologiaPage(){
  const posts = [
    {slug:'quantum-computing', title:'O que é Quantum Computing?', description:'Introdução e impacto futuro.'},
    {slug:'ia-e-o-futuro', title:'IA e o futuro do trabalho', description:'Como a IA está mudando profissões.'}
  ]
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Tecnologia</h1>
      <div className="grid gap-4">
        {posts.map(p=>(
          <article key={p.slug} className="card">
            <a href={`/tecnologia/${p.slug}`}><h2 className="font-semibold">{p.title}</h2></a>
            <p className="text-sm text-gray-600">{p.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
