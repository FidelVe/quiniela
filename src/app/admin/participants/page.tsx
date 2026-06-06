import { listParticipants } from "@/lib/queries";
import {
  addParticipantAction,
  bulkAddParticipantsAction,
  deleteParticipantAction,
  renameParticipantAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function ParticipantsPage() {
  const participants = await listParticipants();

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10 border-b border-edge pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-flame mb-2">La Quiniela</p>
          <h1 className="display text-5xl md:text-7xl text-paper leading-none">Participantes</h1>
        </div>
        <div className="text-right">
          <div className="score-num text-3xl md:text-5xl text-flame leading-none">
            {participants.length}
          </div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-mute mt-1">total</div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-3 mb-12">
        <form action={addParticipantAction} className="border border-edge bg-coal p-5">
          <div className="text-[10px] uppercase tracking-[0.4em] text-flame mb-3">Agregar uno</div>
          <div className="flex gap-2">
            <input
              name="name"
              placeholder="Nombre"
              required
              className="flex-1 bg-ink border border-edge focus:border-flame text-paper px-3 py-2 outline-none transition"
            />
            <button
              type="submit"
              className="display tracking-[0.15em] bg-flame text-ink px-5 py-2 hover:bg-paper transition"
            >
              Agregar
            </button>
          </div>
        </form>

        <form action={bulkAddParticipantsAction} className="border border-edge bg-coal p-5">
          <div className="text-[10px] uppercase tracking-[0.4em] text-flame mb-3">Agregar varios</div>
          <textarea
            name="names"
            rows={3}
            placeholder="Un nombre por línea, o separados por coma"
            className="w-full bg-ink border border-edge focus:border-flame text-paper px-3 py-2 outline-none transition text-sm resize-none"
          />
          <button
            type="submit"
            className="mt-2 display tracking-[0.15em] bg-paper text-ink px-4 py-2 hover:bg-flame transition text-sm"
          >
            Agregar lote
          </button>
        </form>
      </div>

      {participants.length === 0 ? (
        <div className="border border-edge bg-coal px-6 py-12 text-center">
          <p className="display text-2xl text-mute">Lista vacía</p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-mute mt-2">
            Agrega los primeros nombres arriba
          </p>
        </div>
      ) : (
        <ul className="border border-edge bg-coal/40">
          {participants.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-edge last:border-b-0 group"
            >
              <span className="score-num text-xs text-mute w-7 text-right">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <form action={renameParticipantAction} className="flex-1 flex gap-2 items-center">
                <input type="hidden" name="id" value={p.id} />
                <input
                  name="name"
                  defaultValue={p.name}
                  className="flex-1 bg-transparent text-paper border-b border-transparent focus:border-flame outline-none py-1"
                />
                <button
                  type="submit"
                  className="text-[10px] uppercase tracking-[0.3em] text-mute hover:text-flame transition"
                >
                  Guardar
                </button>
              </form>
              <form action={deleteParticipantAction}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="text-[10px] uppercase tracking-[0.3em] text-mute hover:text-clay transition"
                >
                  Eliminar
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
