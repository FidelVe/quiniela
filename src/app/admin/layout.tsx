import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-center gap-3 border-b border-edge pb-4">
        <div className="text-[10px] uppercase tracking-[0.5em] text-flame">
          Manager Console
        </div>
        <nav className="md:ml-auto flex gap-4 md:gap-6 text-[11px] uppercase tracking-[0.3em]">
          <Link href="/admin" className="hover:text-flame transition">
            Dashboard
          </Link>
          <Link href="/admin/participants" className="hover:text-flame transition">
            Participants
          </Link>
          <Link href="/admin/matches" className="hover:text-flame transition">
            Matches
          </Link>
          <form action="/api/logout" method="post" className="contents">
            <button
              type="submit"
              className="text-mute hover:text-clay transition uppercase tracking-[0.3em] text-[11px]"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
      {children}
    </div>
  );
}
