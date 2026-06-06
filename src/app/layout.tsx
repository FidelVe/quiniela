import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Big_Shoulders, DM_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display-face",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quiniela 26",
  description: "La Quiniela de Chande - Mundial 2026",
};

const TICKER = "★ JORNADA · 2026 · NORTEAMÉRICA · USA · CAN · MEX ·";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        {/* Marquee */}
        <div className="border-b border-edge bg-coal overflow-hidden">
          <div className="flex w-max ticker-anim">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex whitespace-nowrap py-1.5 text-[10px] tracking-[0.4em] text-mute uppercase">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="px-6">
                    {TICKER}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tri-stripe accent */}
        <div className="h-[3px] flex">
          <div className="flex-1 bg-flame" />
          <div className="flex-1 bg-paper" />
          <div className="flex-1 bg-jade" />
        </div>

        <header className="border-b border-edge">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-5 md:py-7 flex items-end gap-6 flex-wrap">
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="display text-4xl md:text-5xl text-paper group-hover:text-flame transition">
                Quiniela
              </span>
              <span className="display text-4xl md:text-5xl text-flame glow-flame">26</span>
            </Link>
            <nav className="ml-auto flex gap-5 md:gap-7 text-[11px] md:text-xs uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-flame transition">Posiciones</Link>
              <Link href="/fixtures" className="hover:text-flame transition">Calendario</Link>
              <Link href="/info" className="hover:text-flame transition">Info</Link>
              <Link href="/admin" className="text-mute hover:text-paper transition">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">{children}</main>

        <footer className="mt-24 border-t border-edge">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-6 flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-mute">
            <span>Quiniela 26</span>
            <span>La quiniela de Chande</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
