import React from "react";
import LogoBrand from "./LogoBrand";
import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";
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
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <LogoBrand />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 ">
              Seu canal de notícias, dicas, viagens, reviews e novidades da
              tecnologia.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Linkedin size={18} />} />
              <SocialLink href="#" icon={<Github size={18} />} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Categorias</h3>
            <ul className="space-y-3 text-slate-600">
              <FooterLink href="/categoria/reviews">Reviews</FooterLink>
              <FooterLink href="/categoria/noticias">Notícias</FooterLink>
              <FooterLink href="/categoria/tutoriais">Tutoriais</FooterLink>
              <FooterLink href="/categoria/comparativos">
                Comparativos
              </FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Empresa</h3>
            <ul className="space-y-3 text-slate-600">
              <FooterLink href="/sobre">Sobre Nós</FooterLink>
              <FooterLink href="/contato">Contato</FooterLink>
              <FooterLink href="/anuncie">Anuncie</FooterLink>
              <FooterLink href="/carreiras">Trabalhe Conosco</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Fique atualizado</h3>
            <p className="text-slate-500 text-sm mb-4">
              Receba as melhores notícias de tecnologia diretamente no seu
              e-mail.
            </p>
            <form className="flex flex-col gap-2">
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
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} FujiviewTech. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
// ...existing code will be moved here
