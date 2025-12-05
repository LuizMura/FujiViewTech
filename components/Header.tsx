"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Se subiu ou está no topo = mostra
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowHeader(true);
      }
      // Se desceu = esconde
      else if (currentScrollY > 100) {
        setShowHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Reviews", href: "/reviews" },
    { name: "Notícias", href: "/noticias" },
    { name: "Tutoriais", href: "/tutoriais" },
    { name: "Sobre", href: "/sobre" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-100 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Main Header Content */}
      <div className="container-custom h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/fujiviewtech-logo.png"
            alt="FujiviewTech Logo"
            width={60}
            height={60}
            className="transition-all duration-300 group-hover:scale-110"
          />
          <span className="font-bold text-3xl tracking-tight text-slate-900 group-hover:text-[#43a047] transition-colors">
            Fujiview<span className="text-[#ac3e3e]">Tech</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100">
            <Search size={20} />
          </button>
          <Link
            href="/newsletter"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Inscrever-se
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-36 left-0 right-0 bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="container-custom py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg font-medium transition-colors"
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
