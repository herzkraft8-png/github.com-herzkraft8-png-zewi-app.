"use client";
export function Bestaetigen({ frage, children, className = "btn small" }: { frage: string; children: React.ReactNode; className?: string }) {
  return (
    <button className={className} type="submit" onClick={(e) => { if (!confirm(frage)) e.preventDefault(); }}>{children}</button>
  );
}
