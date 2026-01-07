import Image from "next/image";

export default function LogoBrand() {
  return (
    <span className="flex items-center gap-2 group">
      <Image
        src="/images/logo-fujiviewtech.png"
        alt="FujiviewTech Logo"
        width={75}
        height={75}
        className="transition-transform duration-300 group-hover:scale-110"
      />

      <span className="font-extrabold text-3xl md:text-4xl tracking-tight text-slate-900 transition-colors group-hover:text-[#4a7c59]">
        Fujiview<span className="text-[#ac3e3e]">Tech</span>
      </span>
    </span>
  );
}
