import type { Metadata } from "next";
import { Fragment_Mono } from "next/font/google";
import "./globals.css";

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Leonard Lim - Independent UX Design Consultant",
  description: "Independent UX Design Consultant based in Singapore with 10+ years of experience. specializing in zero-to-one product design for early-stage startups and design consultancy for businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fragmentMono.variable} suppressHydrationWarning>
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
        className={fragmentMono.variable}
      >
        {children}
      </body>
    </html>
  );
}
