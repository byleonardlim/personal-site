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
    <html lang="en" className={fragmentMono.variable}>
      <body
        className={fragmentMono.variable}
      >
        {children}
      </body>
    </html>
  );
}
