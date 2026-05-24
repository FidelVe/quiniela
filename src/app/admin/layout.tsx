import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-center gap-3 border-b border-edge pb-4">
        <div className="text-[10px] uppercase tracking-[0.5em] text-flame">
          Panel del organizador
        </div>
        <nav className="md:ml-auto flex gap-4 md:gap-6 text-[11px] uppercase tracking-[0.3em]">
          <Link href="/admin" className="hover:text-flame transition">
            Panel
          </Link>
          <Link href="/admin/participants" className="hover:text-flame transition">
            Participantes
          </Link>
          <Link href="/admin/matches" className="hover:text-flame transition">
            Partidos
          </Link>
          <form action="/api/logout" method="post" className="contents">
            <button
              type="submit"
              className="text-mute hover:text-clay transition uppercase tracking-[0.3em] text-[11px]"
            >
              Salir
            </button>
          </form>
        </nav>
      </div>
      {children}
    </div>
  );
}
