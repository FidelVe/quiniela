const LOCALE = "es";

export function formatKickoff(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatKickoffFull(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
