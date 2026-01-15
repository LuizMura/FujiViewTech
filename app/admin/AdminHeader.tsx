"use client";
export default function AdminHeader() {
  return (
    <header className="bg-[#2d313a] shadow flex flex-col md:flex-row md:items-center gap-3 md:gap-0 px-4 md:px-8 py-3 md:py-4">
      <h1 className="text-xl md:text-2xl font-bold text-[#bfc7d5] md:mr-8">
        FujiViewTech Admin
      </h1>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-6">
        <a
          href="/admin/dashboard"
          className="font-semibold text-sm md:text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6] hover:bg-[#353a45]"
        >
          Dashboard
        </a>
        <a
          href="/admin/home"
          className="font-semibold text-sm md:text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6] hover:bg-[#353a45]"
        >
          Home
        </a>
        <a
          href="/admin/artigos"
          className="font-semibold text-sm md:text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6] hover:bg-[#353a45]"
        >
          Artigos
        </a>
        <a
          href="/admin/afiliados"
          className="font-semibold text-sm md:text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6] hover:bg-[#353a45]"
        >
          Afiliados
        </a>
      </nav>
    </header>
  );
}
