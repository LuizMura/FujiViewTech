import React from "react";
import Link from "next/link";
import { Mail, Twitter, Instagram, Linkedin } from "lucide-react";

export const metadata = {
  title: "Sobre Nós",
  description:
    "Conheça a equipe FujiViewTech e nossa missão de tornar tecnologia acessível para todos.",
};

export default function SobrePage() {
  return (
    <div className="container-custom pb-20">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
          Sobre o{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            FujiViewTech
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Somos um portal de tecnologia dedicado a trazer reviews honestos,
          tutoriais práticos e notícias relevantes do mundo tech. Nossa missão
          é tornar a tecnologia acessível e compreensível para todos.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">
            Nossa Missão
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Transparência
              </h3>
              <p className="text-slate-600">
                Reviews honestos e imparciais, sem influência de fabricantes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Educação
              </h3>
              <p className="text-slate-600">
                Tutoriais práticos que realmente ajudam no dia a dia.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Agilidade
              </h3>
              <p className="text-slate-600">
                Notícias rápidas e relevantes sobre o mundo da tecnologia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
          Nossos Valores
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              🔍 Profundidade
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Não fazemos reviews superficiais. Testamos cada produto por
              semanas, em situações reais, para trazer análises completas e
              detalhadas que realmente ajudam na decisão de compra.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              💡 Simplicidade
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Tecnologia não precisa ser complicada. Explicamos conceitos
              técnicos de forma clara e acessível, sem jargões desnecessários,
              para que todos possam entender.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              🤝 Comunidade
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Valorizamos nossa comunidade de leitores. Respondemos dúvidas,
              ouvimos sugestões e criamos conteúdo baseado no que vocês querem
              saber.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              🌱 Sustentabilidade
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Incentivamos o consumo consciente de tecnologia, com dicas para
              prolongar a vida útil dos dispositivos e reduzir o desperdício
              eletrônico.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
          Nossa História
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  2023
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  O Começo
                </h3>
                <p className="text-slate-600">
                  FujiViewTech nasceu da paixão por tecnologia e do desejo de
                  criar conteúdo de qualidade em português. Começamos com
                  reviews de smartphones e rapidamente ganhamos a confiança dos
                  leitores.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                  2024
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Expansão
                </h3>
                <p className="text-slate-600">
                  Expandimos para outras categorias: notebooks, gadgets,
                  wearables e smart home. Lançamos nossa seção de tutoriais,
                  que se tornou uma das mais acessadas do site.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                  2025
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Consolidação
                </h3>
                <p className="text-slate-600">
                  Hoje somos referência em reviews de tecnologia no Brasil, com
                  milhares de leitores mensais e parcerias com as principais
                  marcas do mercado. E estamos apenas começando!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white">
        <h2 className="text-4xl font-bold mb-12 text-center">
          FujiViewTech em Números
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-indigo-400 mb-2">
              500+
            </div>
            <div className="text-slate-300">Artigos Publicados</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-violet-400 mb-2">
              200+
            </div>
            <div className="text-slate-300">Reviews Completos</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-sky-400 mb-2">
              100K+
            </div>
            <div className="text-slate-300">Leitores Mensais</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-emerald-400 mb-2">
              50+
            </div>
            <div className="text-slate-300">Produtos Testados</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">
          Entre em Contato
        </h2>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-slate-600 mb-8">
            Tem alguma dúvida, sugestão ou quer fazer uma parceria? Entre em
            contato conosco!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="mailto:contato@fujiviewtech.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
            >
              <Mail size={20} />
              contato@fujiviewtech.com
            </a>
          </div>
          <div className="flex justify-center gap-6">
            <a
              href="https://twitter.com/fujiviewtech"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Twitter size={20} className="text-slate-700" />
            </a>
            <a
              href="https://instagram.com/fujiviewtech"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Instagram size={20} className="text-slate-700" />
            </a>
            <a
              href="https://linkedin.com/company/fujiviewtech"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <Linkedin size={20} className="text-slate-700" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Não Perca Nenhuma Novidade
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Acompanhe nossos reviews, tutoriais e notícias sobre tecnologia
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/categoria/reviews"
            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-slate-100 transition-colors"
          >
            Ver Reviews
          </Link>
          <Link
            href="/categoria/tutoriais"
            className="px-8 py-3 bg-indigo-800 text-white font-bold rounded-full hover:bg-indigo-900 transition-colors"
          >
            Ver Tutoriais
          </Link>
        </div>
      </section>
    </div>
  );
}
