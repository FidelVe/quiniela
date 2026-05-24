"use client";

import { useTransition, useState, useEffect } from "react";
import { clearMatchResultAction } from "@/app/admin/matches/[id]/actions";

export function ClearResultButton({
  matchId,
  hasResult,
  inputNames,
}: {
  matchId: number;
  hasResult: boolean;
  inputNames: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [justCleared, setJustCleared] = useState(false);

  useEffect(() => {
    if (!justCleared) return;
    const t = setTimeout(() => setJustCleared(false), 2000);
    return () => clearTimeout(t);
  }, [justCleared]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (form) {
      for (const name of inputNames) {
        const el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
        if (el) el.value = "";
      }
    }
    if (!hasResult) return;
    startTransition(async () => {
      await clearMatchResultAction(matchId);
      setJustCleared(true);
    });
  };

  let label: React.ReactNode = "Limpiar resultado";
  if (isPending) label = "Limpiando…";
  else if (justCleared) label = "✓ Limpiado";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={onClick}
      className={`text-[10px] uppercase tracking-[0.3em] border border-edge px-3 py-1.5 transition ${
        justCleared
          ? "border-jade text-jade"
          : "text-mute hover:text-clay hover:border-clay"
      } ${isPending ? "opacity-60 cursor-wait" : ""}`}
    >
      {label}
    </button>
  );
}
