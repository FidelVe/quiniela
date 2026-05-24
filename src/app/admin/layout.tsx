import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-4 text-sm mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <Link href="/admin" className="font-semibold">Admin</Link>
        <Link href="/admin/participants" className="hover:underline">Participants</Link>
        <Link href="/admin/matches" className="hover:underline">Matches</Link>
        <form action="/api/logout" method="post" className="ml-auto">
          <button type="submit" className="text-neutral-500 hover:underline">
            Sign out
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
