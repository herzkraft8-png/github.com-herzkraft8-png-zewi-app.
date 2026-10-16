const TEXT: Record<string, string> = {
  in_arbeit: "In Arbeit",
  zur_freigabe: "Zur Freigabe",
  freigegeben: "Freigegeben",
  fehler: "Fehler",
};
export function StatusChip({ status }: { status: string }) {
  return <span className={`status ${status}`}>{TEXT[status] ?? status}</span>;
}
