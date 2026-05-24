import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <section className="max-w-md mx-auto mt-8 md:mt-16">
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-3">Acceso del organizador</p>
        <h1 className="display text-6xl md:text-7xl text-paper">Administración</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-mute mt-3">
          Quiniela 26 · Solo personal autorizado
        </p>
      </div>

      <form
        action={loginAction}
        className="border border-edge bg-coal p-7 md:p-8 space-y-5 relative pitch-bg"
      >
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <div>
          <label className="block text-[10px] uppercase tracking-[0.4em] text-mute mb-2">
            Usuario
          </label>
          <input
            name="user"
            autoComplete="username"
            required
            className="w-full bg-ink border border-edge focus:border-flame text-paper px-3 py-3 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.4em] text-mute mb-2">
            Contraseña
          </label>
          <input
            name="pass"
            type="password"
            autoComplete="current-password"
            required
            className="w-full bg-ink border border-edge focus:border-flame text-paper px-3 py-3 outline-none transition"
          />
        </div>
        {error && (
          <div className="text-[10px] uppercase tracking-[0.4em] text-clay border-l-2 border-clay pl-3 py-1">
            Acceso denegado
          </div>
        )}
        <button
          type="submit"
          className="display block w-full text-lg bg-flame text-ink py-3 hover:bg-paper transition tracking-[0.2em]"
        >
          Entrar
        </button>
      </form>
    </section>
  );
}
