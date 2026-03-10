"use client";

import React, { useMemo, useState } from "react";
import { Copy, Link as LinkIcon } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

type ShareFloatingMenuProps = {
  title: string;
  url: string;
};

export default function ShareFloatingMenu({
  title,
  url,
}: ShareFloatingMenuProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = useMemo(() => encodeURIComponent(url), [url]);
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title]);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: FaWhatsapp,
      className: "bg-emerald-600/85 text-white hover:bg-emerald-700/85",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FaFacebookF,
      className: "bg-blue-700/85 text-white hover:bg-blue-800/85",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedinIn,
      className: "bg-cyan-800/85 text-white hover:bg-cyan-900/85",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: FaXTwitter,
      className: "bg-slate-700/90 text-white hover:bg-slate-800/90",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className="hidden lg:flex fixed left-6 top-[58%] -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2 rounded-xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg p-2">
          {links.map((item) => {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Compartilhar no ${item.label}`}
                title={`Compartilhar no ${item.label}`}
                className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors ${item.className}`}
              >
                <item.icon size={17} />
              </a>
            );
          })}
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copiar link"
            title="Copiar link"
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {copied ? <LinkIcon size={17} /> : <Copy size={17} />}
          </button>
          <div className="flex justify-center pt-1">
            <span className="text-2xs font-semibold tracking-[0.22em] text-slate-500 [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">
              COMPARTILHE
            </span>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-lg px-3 py-2">
          {links.map((item) => {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Compartilhar no ${item.label}`}
                title={`Compartilhar no ${item.label}`}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${item.className}`}
              >
                <item.icon size={15} />
              </a>
            );
          })}
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copiar link"
            title="Copiar link"
            className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white"
          >
            {copied ? <LinkIcon size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>
    </>
  );
}
