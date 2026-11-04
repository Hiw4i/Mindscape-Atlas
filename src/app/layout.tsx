import type { Metadata } from "next";
import { Literata, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { THEME_SCRIPT } from "@/lib/theme";

export const dynamic = "force-dynamic";

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Атлас психологии человека",
    template: "%s - Атлас психологии",
  },
  description:
    "Интерактивная энциклопедия психологии: отношения, мышление, эмоции и жизнь. Глубокие объяснения без воды и псевдонауки.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${literata.variable} ${plexMono.variable}`}>
        <Header />
        <main className="min-h-[calc(100vh-9rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
