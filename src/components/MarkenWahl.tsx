"use client";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { markeWechseln } from "@/lib/aktionen";

export function MarkenWahl({ aktiv, alle }: { aktiv: string; alle: { id: string; name: string }[] }) {
  const p = usePathname();
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={markeWechseln} className="markenwahl">
      <label htmlFor="marke-wahl" className="tag">Aktives Profil</label>
      <input type="hidden" name="zurueck" value={p} />
      <select id="marke-wahl" name="id" defaultValue={aktiv} onChange={() => form.current?.requestSubmit()}>
        {alle.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    </form>
  );
}
