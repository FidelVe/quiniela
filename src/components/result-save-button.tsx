"use client";

import { useTransition, useState, useEffect } from "react";
import { saveMatchResultAction } from "@/app/admin/matches/[id]/actions";

export function ResultSaveButton({
  matchId,
  inputNames,
}: {
  matchId: number;
  inputNames: [string, string];
}) {
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 2000);
    return () => clearTimeout(t);
  }, [justSaved]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    const home =
      form?.querySelector<HTMLInputElement>(`input[name="${inputNames[0]}"]`)?.value ?? "";
    const away =
      form?.querySelector<HTMLInputElement>(`input[name="${inputNames[1]}"]`)?.value ?? "";
    startTransition(async () => {
      await saveMatchResultAction(matchId, home, away);
      setJustSaved(true);
    });
  };

  let label: React.ReactNode = "Guardar resultado";
  let styles = "border-flame text-flame hover:bg-flame hover:text-ink";
  if (isPending) {
    label = "Guardando…";
    styles = "border-flame text-flame opacity-75 cursor-wait";
  } else if (justSaved) {
    label = "✓ Guardado";
    styles = "border-jade text-jade bg-jade/10";
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={onClick}
      className={`text-[10px] uppercase tracking-[0.3em] px-3 py-1.5 border transition ${styles}`}
    >
      {label}
    </button>
  );
}
