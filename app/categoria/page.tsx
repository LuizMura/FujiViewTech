export default function CategoriaPage({
  params,
}: {
  params: { slug: string };
}) {
  const nome = params.slug;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 capitalize">Categoria: {nome}</h1>

      <p>Em breve: posts filtrados por categoria.</p>
    </div>
  );
}
