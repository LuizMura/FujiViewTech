"use client";
export default function AdminHeader() {
  return (
    <header className="bg-[#2d313a] shadow flex items-center px-8 py-4">
      <h1 className="text-2xl font-bold text-[#bfc7d5] mr-8">FujiViewTech Admin</h1>
      <nav className="flex gap-6">
        <a href="/admin/dashboard" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Dashboard</a>
        <a href="/admin/home" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Home</a>
        <a href="/admin/artigos" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Criar/Editar Artigos</a>
        <a href="/admin/afiliados" className="font-semibold text-lg px-2 py-1 rounded transition-colors text-[#bfc7d5] hover:text-[#7f8fa6]">Criar/Editar AfiliadosCard</a>
      </nav>
    </header>
  );
}
