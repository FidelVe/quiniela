"use client";

import { useTransition, useState, useEffect } from "react";
import { savePredictionAction } from "@/app/admin/matches/[id]/actions";

export function RowSaveButton({
  matchId,
  participantId,
  inputNames,
}: {
  matchId: number;
  participantId: number;
  inputNames: [string, string];
}) {
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 1600);
    return () => clearTimeout(t);
  }, [justSaved]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const row = e.currentTarget.closest("[data-row]");
    const home =
      row?.querySelector<HTMLInputElement>(`input[name="${inputNames[0]}"]`)?.value ?? "";
    const away =
      row?.querySelector<HTMLInputElement>(`input[name="${inputNames[1]}"]`)?.value ?? "";
    startTransition(async () => {
      await savePredictionAction(matchId, participantId, home, away);
      setJustSaved(true);
    });
  };

  const base =
    "inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 border transition text-sm";

  if (isPending) {
    return (
      <button type="button" disabled className={`${base} border-edge text-mute opacity-75 cursor-wait`}>
        <Spinner />
      </button>
    );
  }
  if (justSaved) {
    return (
      <button type="button" disabled className={`${base} border-jade text-jade bg-jade/10`} aria-label="Guardado">
        <CheckIcon />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title="Guardar fila"
      aria-label="Guardar fila"
      className={`${base} border-edge text-mute hover:text-flame hover:border-flame`}
    >
      <SaveIcon />
    </button>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SaveIcon() {
  // Down-arrow-into-tray glyph — reads as "commit / save".
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 4v12" />
      <polyline points="7 11 12 16 17 11" />
      <path d="M5 20h14" />
    </svg>
  );
}
