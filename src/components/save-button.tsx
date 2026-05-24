"use client";

import { useEffect, useState } from "react";
import { useSaveFormState } from "./save-form";

export function SaveButton({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const { state, isPending } = useSaveFormState();
  const [showSuccess, setShowSuccess] = useState(false);

  // The action returns a fresh `ts` on every success, so this effect re-runs
  // each time, restarting the 2.5s success-display window.
  const successTs = state?.ok ? state.ts : 0;
  useEffect(() => {
    if (!successTs) return;
    setShowSuccess(true);
    const t = setTimeout(() => setShowSuccess(false), 2500);
    return () => clearTimeout(t);
  }, [successTs]);

  const failed = state && state.ok === false;

  if (isPending) {
    return (
      <button
        type="submit"
        disabled
        className={`inline-flex items-center justify-center gap-2 bg-flame text-ink opacity-75 cursor-wait ${className}`}
      >
        <Spinner />
        Guardando…
      </button>
    );
  }

  if (showSuccess) {
    return (
      <button
        type="submit"
        disabled
        className={`inline-flex items-center justify-center gap-2 bg-jade text-ink ${className}`}
      >
        <CheckIcon />
        ¡Guardado!
      </button>
    );
  }

  if (failed) {
    return (
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 bg-clay text-paper hover:bg-flame ${className}`}
        title={state.error}
      >
        ✕ Error · Reintentar
      </button>
    );
  }

  return (
    <button
      type="submit"
      className={`bg-flame text-ink hover:bg-paper transition ${className}`}
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
