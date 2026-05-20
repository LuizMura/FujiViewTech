import "./globals.css";
import { LayoutWrapper } from "./LayoutWrapper";
import { Poppins } from "next/font/google";
import Script from "next/script";
import type { Metadata } from "next";

const siteTitle = "FujiviewTech";
const siteDescription =
  "FujiviewTech — Portal de tecnologia com Reviews, Produtos, Notícias e Novidades.";
const ogImage = "/images/og-default.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fujiviewtech.com"),
  applicationName: siteTitle,
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,

  keywords: [
    "tecnologia",
    "reviews",
    "smartphones",
    "computadores",
    "notebooks",
    "gadgets",
    "produtos",
    "novidades",
    "FujiviewTech",
  ],

  authors: [{ name: siteTitle }],
  creator: siteTitle,
  category: "technology",

  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://www.fujiviewtech.com",
    siteName: siteTitle,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteTitle} - Portal de tecnologia`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

import { AuthProvider } from "./context/AuthContext";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RTSWWHK7YW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configuração principal do GA4
            gtag('config', 'G-RTSWWHK7YW', {
              'anonymize_ip': true,
              'allow_google_signals': true,
              'allow_ad_personalization_signals': true,
              'cookie_domain': 'auto',
              'send_page_view': true,
            });
            
            // Registrar eventos como conversões no GA4
            gtag('config', 'G-RTSWWHK7YW', {
              'conversion_linker': true,
            });
          `}
        </Script>
      </head>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-700`}
      >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
