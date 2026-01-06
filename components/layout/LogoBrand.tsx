import Image from "next/image";

export default function LogoBrand({ size = 100 }: { size?: number }) {
  // Calcula o tamanho da fonte proporcional ao tamanho da logo
  const fontSize =
    size >= 60
      ? "text-3xl"
      : size >= 40
      ? "text-2xl"
      : size >= 28
      ? "text-xl"
      : "text-lg";
  return (
    <span className="flex items-center gap-2 group">
      <Image
        src="/images/logo-fujiviewtech.png"
        alt="FujiviewTech Logo"
        width={size}
        height={size}
        className="transition-all duration-300 group-hover:scale-110"
      />
      <span
        className={`font-extrabold ${
          size >= 70 ? "text-3xl" : "text-xl"
        } tracking-tight text-slate-900 group-hover:text-[#4a7c59] transition-colors`}
      >
        Fujiview<span className="text-[#ac3e3e]">Tech</span>
      </span>
    </span>
  );
}
