"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TEXTE, IST_CAPITAL } from "@/lib/produkt";

const LINKS = [
  ["/app", "Dashboard"],
  ["/app/planer", IST_CAPITAL ? "Lern-Planer" : "Content Planner"],
  ["/app/studio", IST_CAPITAL ? "Alle Mentoren" : "Alle Agenten"],
  ["/app/auftraege", "Download-Center"],
  ["/app/marke", TEXTE.profilName],
  ["/app/lernen", "Learning Agent"],
  ["/app/abo", "Abo"],
];

export function SideNav() {
  const p = usePathname();
  return (
    <nav aria-label="App-Menü">
      {LINKS.map(([href, label]) => {
        const on = href === "/app" ? p === "/app" : p.startsWith(href);
        return <Link key={href} href={href} className={on ? "on" : ""}>{label}</Link>;
      })}
    </nav>
  );
}
