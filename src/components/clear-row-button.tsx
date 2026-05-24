"use client";

import { useTransition } from "react";
import { clearPredictionAction } from "@/app/admin/matches/[id]/actions";

export function ClearRowButton({
  matchId,
  participantId,
  hasPrediction,
}: {
  matchId: number;
  participantId: number;
  hasPrediction: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const row = e.currentTarget.closest("[data-row]");
    if (row) {
      row.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach((el) => {
        el.value = "";
      });
    }
    if (!hasPrediction) return;
    startTransition(async () => {
      await clearPredictionAction(matchId, participantId);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      title={hasPrediction ? "Eliminar pronóstico" : "Limpiar campos"}
      aria-label={hasPrediction ? "Eliminar pronóstico" : "Limpiar campos"}
      className={`inline-flex items-center justify-center w-7 h-7 md:w-8 md:h-8 border border-edge text-mute hover:text-clay hover:border-clay transition text-base ${
        isPending ? "opacity-60 cursor-wait" : ""
      }`}
    >
      {isPending ? <DotPulse /> : "×"}
    </button>
  );
}

function DotPulse() {
  return (
    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}
