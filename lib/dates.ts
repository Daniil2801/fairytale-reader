const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

export function isSameWeek(a: Date, b: Date): boolean {
  return startOfWeek(a).getTime() === startOfWeek(b).getTime();
}

export function isWithinDays(isoDate: string, days: number): boolean {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return now - then <= days * MS_PER_DAY;
}

export function isAvailable(isoDate: string): boolean {
  return new Date(isoDate).getTime() <= Date.now();
}

export function formatWeekReset(weekStartedAt: string): string {
  const start = new Date(weekStartedAt);
  const reset = new Date(start);
  reset.setDate(reset.getDate() + 7);
  return reset.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
