const LOCALE = "es";
// All kickoff times are stored in UTC; display them in Venezuela time.
export const TIME_ZONE = "America/Caracas";

export function formatKickoff(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

// YYYY-MM-DD of the kickoff in Venezuela time, for grouping by day.
export function kickoffDayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

export function formatKickoffFull(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
