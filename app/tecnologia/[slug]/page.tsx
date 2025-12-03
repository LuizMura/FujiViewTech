import { notFound } from "next/navigation";
export default async function TechPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts: Record<string, {title: string, body: string}> = {
    "quantum-computing": {
      title: "O que é Quantum Computing?",
      body: "Explicação introdutória.",
    },
    "ia-e-o-futuro": {
      title: "IA e o futuro do trabalho",
      body: "Impactos e exemplos.",
    },
  };
  const post = posts[slug];
  if (!post) return notFound();
  return (
    <article>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-4">{post.body}</p>
    </article>
  );
}
