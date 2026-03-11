"use client";
import SearchBar from "./SearchBar";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoBrand from "./LogoBrand";
import { Menu, X } from "lucide-react";

function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowHeader(true);
      } else if (currentScrollY > 100) {
        setShowHeader(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Dicas", href: "/categorias/dicas" },
    { name: "Produtos", href: "/categorias/produtos" },
    { name: "Novidades", href: "/categorias/novidades" },
    { name: "Notícias", href: "/categorias/noticias" },
    { name: "Reviews", href: "/categorias/reviews" },
    { name: "Tutoriais", href: "/categorias/tutoriais" },
    { name: "Economia", href: "/categorias/economia" },
    { name: "Saúde", href: "/categorias/saude" },
    { name: "Filmes e Séries", href: "/categorias/filmes-e-series" },
    { name: "Viagens", href: "/categorias/viagens" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 backdrop-blur-md border-b border-neutral-400 ${
        showHeader ? "translate-y-0" : "-translate-y-[72%]"
      }`}
    >
      <div className="container-custom h-16 md:h-18 flex items-center justify-between">
        <Link href="/">
          <LogoBrand invert />
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <div className="w-56">
            {/* Barra de busca global */}
            <SearchBar />
          </div>
          <Link
            href="/newsletter"
            className="px-4 py-2 bg-neutral-800 text-white text-sm font-medium rounded-full hover:bg-indigo-900 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Inscrever-se
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-full hover:bg-slate-900 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Entrar
          </Link>
        </div>
        <button
          className="px-5 md:hidden p-2 text-slate-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
      <nav className="hidden md:flex border-t border-b border-neutral-400 bg-stone-200 py-0.5 backdrop-blur-md">
        <div className="container-custom flex items-center justify-between w-full">
          <span className="text-stone-400 font-bold px-2">|</span>
          {navLinks.map((link, idx) => (
            <div key={link.name} className="flex-1 text-center relative px-2">
              <Link
                href={link.href}
                className={`inline-block text-sm font-semibold transition-colors relative group whitespace-nowrap uppercase ${
                  pathname === link.href
                    ? "text-[#ac3e3e]"
                    : "text-stone-700 hover:text-[#ac3e3e]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#ac3e3e] transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
              {idx < navLinks.length - 1 && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                  |
                </span>
              )}
            </div>
          ))}
          <span className="text-stone-400 font-bold px-2">|</span>
        </div>
      </nav>
      {isMenuOpen && (
        /* Mobile nav + navLinks (menu sanduíche) */
        <div className="md:hidden absolute top-16 left-0 right-0 bg-stone-300 border-b border-slate-700 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="container-custom py-4 flex flex-col gap-1">
            {/* Mobile navLinks */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap uppercase ${
                  pathname === link.href
                    ? "bg-[#ac3e3e] text-white"
                    : "text-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-slate-100 my-2"></div>
            <Link
              href="/newsletter"
              className="px-4 py-3 text-center bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inscrever-se na Newsletter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
