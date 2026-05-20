import React from "react";
import LogoBrand from "./LogoBrand";
import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";
import { FIXED_CATEGORIES } from "@/lib/constants/categories";
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-slate-500 hover:text-indigo-600 transition-colors"
    >
      {icon}
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="hover:text-indigo-600 transition-colors">
        {children}
      </Link>
    </li>
  );
}
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = FIXED_CATEGORIES.map((category) => ({
    label: category.label,
    href: `/categorias/${category.slug}`,
  }));

  return (
    <footer className="md:pl-0 bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <span className="flex justify-center items-center gap-2 mb-2">
              <Link href="/">
                <div className="bg-black rounded-lg p-1 inline-block">
                  <LogoBrand size={280} />
                </div>
              </Link>
            </span>
            <p className="px-4 text-slate-500 text-sm leading-relaxed mb-6 md:px-0">
              Seu canal de Reviews, Produtos, Notícias e Novidades de
              tecnologia.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <SocialLink
                href="https://x.com/LuizMurak"
                icon={<Twitter size={18} />}
              />
              <SocialLink
                href="https://www.instagram.com/luizmurak"
                icon={<Instagram size={18} />}
              />
              <SocialLink
                href="https://www.linkedin.com/in/luizmura/"
                icon={<Linkedin size={18} />}
              />
              <SocialLink
                href="https://github.com/LuizMura"
                icon={<Github size={18} />}
              />
            </div>
          </div>
          <div className="text-center">
            <ul className="space-y-3 text-slate-600">
              {categories.slice(0, 2).map((category) => (
                <FooterLink key={category.href} href={category.href}>
                  {category.label}
                </FooterLink>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <ul className="space-y-3 text-slate-600">
              {categories.slice(2).map((category) => (
                <FooterLink key={category.href} href={category.href}>
                  {category.label}
                </FooterLink>
              ))}
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-slate-900 mb-4">Fique atualizado</h3>
            <p className="px-4 md:px-0 text-slate-500 text-sm mb-4">
              Receba as melhores notícias de tecnologia diretamente no seu
              e-mail.
            </p>

            <form className="p-6 md:p-0 flex flex-col gap-2">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm placeholder-slate-400"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-around items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} FujiviewTech. Todos os direitos reservados.
          </p>
          <p className="text-slate-500 text-sm">
            Desenvolvido por:{" "}
            <a
              href="https://luizmura.github.io/Profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors border-silver border-1 rounded-2xl px-3 py-1 font-semibold bg-teal-600 text-white"
            >
              Luiz Murakami
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
// ...existing code will be moved here
