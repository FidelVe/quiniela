import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <section className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Manager login</h1>
      <form action={loginAction} className="space-y-4">
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            name="user"
            autoComplete="username"
            required
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-neutral-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="pass"
            type="password"
            autoComplete="current-password"
            required
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-neutral-900"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">Invalid credentials.</p>
        )}
        <button
          type="submit"
          className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded px-3 py-2 font-medium"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
