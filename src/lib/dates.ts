const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const MONTH_ID_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toLocalISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayLocal(): string {
  return toLocalISODate(new Date());
}

export function currentMonthId(): string {
  return todayLocal().slice(0, 7);
}

export function isValidMonthId(value: string): boolean {
  return MONTH_ID_RE.test(value);
}

export function isValidDate(value: string): boolean {
  return DATE_RE.test(value);
}

export function shiftMonthId(monthId: string, delta: number): string {
  const [y, m] = monthId.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function monthLabel(monthId: string): string {
  const [y, m] = monthId.split("-").map(Number);
  const name = MONTH_NAMES[m - 1];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

export function daysInMonth(monthId: string): number {
  const [y, m] = monthId.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function firstDayOfMonth(monthId: string): string {
  return `${monthId}-01`;
}

export function lastDayOfMonth(monthId: string): string {
  return `${monthId}-${pad2(daysInMonth(monthId))}`;
}

export function startOfWeek(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const jsDate = new Date(y, m - 1, d);
  const mondayOffset = (jsDate.getDay() + 6) % 7; // days since Monday
  jsDate.setDate(jsDate.getDate() - mondayOffset);
  return toLocalISODate(jsDate);
}

export function addDays(date: string, delta: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(y, m - 1, d + delta);
  return toLocalISODate(next);
}

export function formatDateHuman(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const jsDate = new Date(y, m - 1, d);
  return jsDate.toLocaleDateString("es", { day: "numeric", month: "short" });
}
