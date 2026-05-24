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
      <h1 className="text-2xl font-bold mb-6">Participants ({participants.length})</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <form action={addParticipantAction} className="flex gap-2">
          <input
            name="name"
            placeholder="New participant name"
            required
            className="flex-1 border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-neutral-900"
          />
          <button
            type="submit"
            className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded px-4 py-2 font-medium"
          >
            Add
          </button>
        </form>

        <form action={bulkAddParticipantsAction} className="flex flex-col gap-2">
          <textarea
            name="names"
            placeholder="Paste names — one per line or comma-separated"
            rows={3}
            className="border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-neutral-900 text-sm"
          />
          <button
            type="submit"
            className="self-start text-sm border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2"
          >
            Bulk add
          </button>
        </form>
      </div>

      {participants.length === 0 ? (
        <p className="text-neutral-500">No participants yet.</p>
      ) : (
        <ul className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800">
          {participants.map((p) => (
            <li key={p.id} className="flex items-center gap-2 px-3 py-2">
              <form action={renameParticipantAction} className="flex-1 flex gap-2">
                <input type="hidden" name="id" value={p.id} />
                <input
                  name="name"
                  defaultValue={p.name}
                  className="flex-1 bg-transparent border-b border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 px-1 py-1 outline-none"
                />
                <button type="submit" className="text-xs text-neutral-500 hover:underline">
                  Save
                </button>
              </form>
              <form action={deleteParticipantAction}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-xs text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
