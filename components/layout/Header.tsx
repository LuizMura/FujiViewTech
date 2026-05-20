"use client";
import SearchBar from "./SearchBar";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoBrand from "./LogoBrand";
import { Menu, X, ChevronDown } from "lucide-react";

type Subcategory = { name: string; slug: string };

function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [subcategories, setSubcategories] = useState<
    Record<string, Subcategory[]>
  >({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const categoryLinks = ["reviews", "produtos", "noticias", "novidades"];

  useEffect(() => {
    async function fetchAllSubcategories() {
      const results = await Promise.allSettled(
        categoryLinks.map(async (cat) => {
          const res = await fetch(`/api/content/subcategories?category=${cat}`);
          if (!res.ok) return { cat, subs: [] as Subcategory[] };
          const data = await res.json();
          return { cat, subs: (data.items ?? []) as Subcategory[] };
        }),
      );
      const map: Record<string, Subcategory[]> = {};
      for (const r of results) {
        if (r.status === "fulfilled") {
          const { cat, subs } = r.value;
          if (subs.length > 0) map[cat] = subs;
        }
      }
      setSubcategories(map);
    }
    fetchAllSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMouseEnter(slug: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (subcategories[slug]?.length) setOpenDropdown(slug);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  const navLinks = [
    { name: "Início", href: "/", slug: null },
    { name: "Reviews", href: "/categorias/reviews", slug: "reviews" },
    { name: "Produtos", href: "/categorias/produtos", slug: "produtos" },
    { name: "Notícias", href: "/categorias/noticias", slug: "noticias" },
    { name: "Novidades", href: "/categorias/novidades", slug: "novidades" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 backdrop-blur-md border-b border-neutral-400 ${
        showHeader ? "translate-y-0" : "-translate-y-[72%]"
      }`}
    >
      <div className="container-custom h-16 md:h-18 flex items-center justify-between">
        <Link href="/">
          <LogoBrand />
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
          {navLinks.map((link, idx) => {
            const subs = link.slug ? (subcategories[link.slug] ?? []) : [];
            const isOpen = openDropdown === link.slug;
            return (
              <div
                key={link.name}
                className="flex-1 text-center relative px-2"
                onMouseEnter={() => link.slug && handleMouseEnter(link.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors relative group whitespace-nowrap uppercase ${
                    pathname === link.href ||
                    pathname.startsWith(link.href + "?")
                      ? "text-[#ac3e3e]"
                      : "text-stone-700 hover:text-[#ac3e3e]"
                  }`}
                >
                  {link.name}
                  {subs.length > 0 && (
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#ac3e3e] transition-all duration-300 ${
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>

                {/* Dropdown subcategorias */}
                {subs.length > 0 && isOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 min-w-[160px] bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseEnter={() => {
                      if (closeTimer.current) clearTimeout(closeTimer.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider hover:bg-stone-50 hover:text-[#ac3e3e] transition-colors"
                    >
                      Ver todos
                    </Link>
                    <div className="h-px bg-neutral-100 mx-2 mb-1" />
                    {subs.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`${link.href}?sub=${sub.slug}`}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-[#ac3e3e] transition-colors capitalize"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

                {idx < navLinks.length - 1 && (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                    |
                  </span>
                )}
              </div>
            );
          })}
          <span className="text-stone-400 font-bold px-2">|</span>
        </div>
      </nav>
      {isMenuOpen && (
        /* Mobile nav + navLinks (menu sanduíche) */
        <div className="md:hidden absolute top-16 left-0 right-0 bg-stone-300 border-b border-slate-700 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="container-custom py-4 flex flex-col gap-1">
            {/* Mobile navLinks */}
            {navLinks.map((link) => {
              const subs = link.slug ? (subcategories[link.slug] ?? []) : [];
              return (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap uppercase ${
                      pathname === link.href
                        ? "bg-[#ac3e3e] text-white"
                        : "text-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {subs.length > 0 && (
                    <div className="pl-4 flex flex-col gap-0.5 mt-0.5 mb-1">
                      {subs.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`${link.href}?sub=${sub.slug}`}
                          className="block px-4 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors capitalize"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
