"use client";

import React from "react";
import PostCard from "../components/PostCard";
import HeroWrapper from "../components/HeroWrapper";

const posts = [
  {
    slug: "review-galaxy-s25-ultra",
    title: "Review Galaxy S25 Ultra — O mais poderoso de 2025",
    description:
      "Análise completa do novo flagship da Samsung com design em titânio, Snapdragon 8 Elite, câmeras de 200MP e S Pen. Vale os R$ 10 mil?",
    image: "/images/posts/s25ultra.jpg",
    category: "reviews",
    date: "2025-11-01",
    readTime: "12 min",
  },
  {
    slug: "apple-vision-pro-2-lancamento",
    title: "Apple Vision Pro 2 é lançado — o que mudou?",
    description:
      "A Apple atualizou o headset mais avançado do mundo. Confira as novidades, preço e disponibilidade no Brasil.",
    image: "/images/posts/visionpro2.jpg",
    category: "noticias",
    date: "2025-10-28",
    readTime: "5 min",
  },
  {
    slug: "como-aumentar-vida-util-do-seu-smartphone",
    title: "10 dicas para aumentar a vida útil do seu smartphone",
    description:
      "Guia completo com dicas práticas de bateria, armazenamento, limpeza e configurações para fazer seu celular durar muito mais.",
    image: "/images/posts/dicas-smartphone.jpg",
    category: "tutoriais",
    date: "2025-11-15",
    readTime: "10 min",
  },
  {
    slug: "iphone-17-pro-max-review",
    title: "iPhone 17 Pro Max — Review Completo",
    description:
      "O novo iPhone traz câmeras de 48MP em todas as lentes, chip A19 Pro e ilha dinâmica reduzida. Confira nossa análise detalhada.",
    image: "/images/unnamed.jpg",
    category: "reviews",
    date: "2025-10-25",
    readTime: "11 min",
  },
  {
    slug: "melhores-notebooks-2025",
    title: "Os 7 Melhores Notebooks para Comprar em 2025",
    description:
      "Selecionamos os melhores notebooks para trabalho, estudo, jogos e criação de conteúdo. Guia completo com preços e especificações.",
    image: "/images/unnamed (1).jpg",
    category: "reviews",
    date: "2025-10-20",
    readTime: "9 min",
  },
  {
    slug: "ia-smartphones-2025",
    title: "Como a IA está transformando smartphones em 2025",
    description:
      "Recursos de inteligência artificial estão revolucionando a experiência móvel. Veja as principais inovações e o que esperar do futuro.",
    image: "/images/unnamed (2).jpg",
    category: "noticias",
    date: "2025-10-18",
    readTime: "6 min",
  },
  {
    slug: "configurar-vpn-android",
    title: "Como Configurar uma VPN no Android — Guia Completo",
    description:
      "Tutorial passo a passo para configurar VPN no seu Android. Proteja sua privacidade e acesse conteúdo bloqueado com segurança.",
    image: "/images/unnamed (3).jpg",
    category: "tutoriais",
    date: "2025-10-15",
    readTime: "7 min",
  },
  {
    slug: "pixel-10-pro-review",
    title: "Google Pixel 10 Pro — O Pixel Mais Maduro",
    description:
      "Com o novo Tensor G5 fabricado pela TSMC, o Pixel 10 Pro resolve problemas de aquecimento e bateria. Confira nosso review.",
    image: "/images/unnamed (4).jpg",
    category: "reviews",
    date: "2025-10-12",
    readTime: "10 min",
  },
  {
    slug: "5g-vale-a-pena",
    title: "5G Vale a Pena em 2025? Análise Completa",
    description:
      "Cobertura, velocidade, consumo de bateria e custo-benefício. Descubra se vale a pena investir em um smartphone 5G agora.",
    image: "/images/unnamed (5).jpg",
    category: "noticias",
    date: "2025-10-08",
    readTime: "6 min",
  },
  {
    slug: "melhorar-fotos-smartphone",
    title: "7 Truques para Tirar Fotos Incríveis com o Celular",
    description:
      "Aprenda técnicas profissionais de fotografia mobile. Iluminação, composição, modo noturno e edição para fotos de qualidade.",
    image: "/images/unnamed (6).jpg",
    category: "tutoriais",
    date: "2025-10-05",
    readTime: "8 min",
  },
  {
    slug: "xiaomi-15-ultra-lancamento",
    title: "Xiaomi 15 Ultra com Câmera de 1 Polegada Chega ao Brasil",
    description:
      "O smartphone com o melhor sistema de câmeras do mercado finalmente disponível no Brasil. Preço, especificações e disponibilidade.",
    image: "/images/unnamed (7).jpg",
    category: "noticias",
    date: "2025-10-01",
    readTime: "5 min",
  },
  {
    slug: "comparativo-carregamento-rapido",
    title: "Carregamento Rápido: 65W vs 120W vs 240W",
    description:
      "Testamos as principais tecnologias de carregamento rápido. Velocidade, segurança, impacto na bateria e qual vale mais a pena.",
    image: "/images/hero.jpg",
    category: "reviews",
    date: "2025-09-28",
    readTime: "9 min",
  },
];

export default function HomePage() {
  return (
    <div className="container-custom pb-20">
      {/* Hero Section with Live Prices */}
      <HeroWrapper />

      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Últimas Novidades
          </h2>
          <p className="text-slate-500">
            Fique por dentro do mundo da tecnologia
          </p>
        </div>
        <a
          href="/categoria/todas"
          className="hidden md:inline-flex text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          Ver tudo →
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-12 text-center md:hidden">
        <a
          href="/categoria/todas"
          className="inline-flex px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
        >
          Ver todos os artigos
        </a>
      </div>
    </div>
  );
}
