import "./globals.css";
import { LayoutWrapper } from "./LayoutWrapper";

export const metadata = {
  metadataBase: new URL("https://www.fujiviewtech.com"),
  title: {
    default: "FujiviewTech",
    template: "%s | FujiviewTech",
  },
  description:
    "FujiviewTech — Portal de tecnologia, reviews, tutoriais e notícias.",

  keywords: [
    "tecnologia",
    "reviews",
    "smartphones",
    "computadores",
    "notebooks",
    "gadgets",
    "tutoriais",
    "FujiviewTech",
  ],

  authors: [{ name: "FujiviewTech" }],
  creator: "FujiviewTech",

  icons: {
    icon: "/images/fujiviewtech-logo.png",
    shortcut: "/images/fujiviewtech-logo.png",
    apple: "/images/fujiviewtech-logo.png",
  },

  openGraph: {
    title: "FujiviewTech",
    description: "Portal de tecnologia, reviews e notícias.",
    url: "https://www.fujiviewtech.com",
    siteName: "FujiviewTech",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "FujiviewTech",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FujiviewTech",
    description: "Portal de tecnologia, reviews e notícias.",
    images: ["/images/og-default.png"],
  },
};

import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-700">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
