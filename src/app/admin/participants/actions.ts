"use server";

import { revalidatePath } from "next/cache";
import { query, withClient } from "@/lib/db";

const PG_UNIQUE_VIOLATION = "23505";

function isUniqueViolation(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === PG_UNIQUE_VIOLATION
  );
}

export async function addParticipantAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  try {
    await query("INSERT INTO participants (name) VALUES ($1)", [name]);
  } catch (e) {
    if (!isUniqueViolation(e)) throw e;
  }
  revalidatePath("/admin/participants");
}

export async function renameParticipantAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await query("UPDATE participants SET name = $1 WHERE id = $2", [name, id]);
  revalidatePath("/admin/participants");
}

export async function deleteParticipantAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await query("DELETE FROM participants WHERE id = $1", [id]);
  revalidatePath("/admin/participants");
}

export async function bulkAddParticipantsAction(formData: FormData) {
  const text = String(formData.get("names") ?? "");
  const names = text
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter(Boolean);
  if (names.length === 0) return;

  await withClient(async (client) => {
    await client.query("BEGIN");
    try {
      for (const n of names) {
        await client.query(
          "INSERT INTO participants (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
          [n]
        );
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
  revalidatePath("/admin/participants");
}
