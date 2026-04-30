import "./globals.css";
import { LayoutWrapper } from "./LayoutWrapper";
import { Poppins } from "next/font/google";
import Script from "next/script";

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
