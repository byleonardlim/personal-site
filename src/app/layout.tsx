import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Oxygen_Mono } from "next/font/google";
import "./globals.css";

const oxygenMono = Oxygen_Mono({
  variable: "--font-oxygen-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byleonardlim.com"),
  title: "Leonard Lim - Fractional Design Partnership",
  description:
    "Fractional Design Leader in Singapore disrupting the user experience domain. Helping startups and lean organizations stay ahead of the market with artificial intelligence by transforming complex systems into simple, meaningful user experiences.",
  openGraph: {
    title: "Leonard Lim - Fractional Design Partnership",
    description:
      "Fractional Design Leader in Singapore disrupting the user experience domain. Helping startups and lean organizations stay ahead of the market with artificial intelligence by transforming complex systems into simple, meaningful user experiences.",
    url: "https://byleonardlim.com/",
    siteName: "byleonardlim",
    type: "website",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leonard Lim - Fractional Design Partnership",
    description:
      "Fractional Design Leader in Singapore disrupting the user experience domain. Helping startups and lean organizations stay ahead of the market with artificial intelligence by transforming complex systems into simple, meaningful user experiences.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e1e2e7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1b26" },
  ],
};

export default function RootLayout({
  children,
  drawer,
}: Readonly<{
  children: React.ReactNode;
  drawer: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxygenMono.variable}`} suppressHydrationWarning>
      <head>
        {/* No-flash theme script: sets the `.dark` class before paint based on user preference or system */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const ls = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const wantDark = ls === 'dark' || (ls === null && systemDark);
    document.documentElement.classList.toggle('dark', wantDark);
  } catch (e) { /* no-op */ }
})();`,
          }}
        />
      </head>
      <body
        className={`${oxygenMono.variable}`}
      >
        {/* Overtracking Pixel Code */}
        <Script
          src="https://cdn.overtracking.com/t/tn8ge3igett516ovg/"
          strategy="afterInteractive"
          defer
        />
        {children}
        {drawer}
      </body>
    </html>
  );
}
