import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Win Win Win — Coinwood",
  description: "A fun way for kids to learn money, saving, and investing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Lilita+One&family=Nunito:wght@400;600;700;900&family=Press+Start+2P&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
