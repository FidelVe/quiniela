import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiniela 2026",
  description: "World Cup 2026 prediction pool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold">Quiniela 2026</Link>
            <Link href="/" className="hover:underline">Leaderboard</Link>
            <Link href="/fixtures" className="hover:underline">Fixtures</Link>
            <div className="ml-auto">
              <Link href="/admin" className="text-neutral-500 hover:underline">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
