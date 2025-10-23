import type { Metadata } from "next";
import { Oxygen_Mono } from "next/font/google";
import "./globals.css";

const oxygenMono = Oxygen_Mono({
  variable: "--font-oxygen-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byleonardlim.com"),
  title: "Leonard Lim - Independent UX Design Consultant",
  description:
    "Independent UX Design Consultant based in Singapore with 10+ years of experience. specializing in zero-to-one product design for early-stage startups and design consultancy for businesses.",
  openGraph: {
    title: "Leonard Lim - Independent UX Design Consultant",
    description:
      "Independent UX Design Consultant based in Singapore with 10+ years of experience.",
    url: "https://byleonardlim.com/",
    siteName: "byleonardlim",
    type: "website",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leonard Lim - Independent UX Design Consultant",
    description:
      "Independent UX Design Consultant based in Singapore with 10+ years of experience.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
        {children}
      </body>
    </html>
  );
}
