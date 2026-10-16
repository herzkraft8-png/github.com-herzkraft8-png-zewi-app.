"use client";

import { useActionState } from "react";
import { deleteApiKey, saveApiKey, saveProfile, type FormState } from "@/app/actions/profile";

type Profile = {
  business_name: string;
  offer: string;
  audience: string;
  tone: string;
  extra_notes: string;
};

function Status({ state }: { state: FormState }) {
  if (state.error) return <p className="text-sm text-red-600">{state.error}</p>;
  if (state.message) return <p className="text-sm text-accent">{state.message}</p>;
  return null;
}

export function ProfileForm({ initial }: { initial: Profile }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, {});

  return (
    <form action={action} className="mt-5 space-y-4">
      <div>
        <label className="label" htmlFor="business_name">Name / Marke</label>
        <input id="business_name" name="business_name" defaultValue={initial.business_name} className="input" placeholder="z. B. Mindset Coaching Anna Berger" />
      </div>
      <div>
        <label className="label" htmlFor="offer">Angebot</label>
        <textarea id="offer" name="offer" rows={3} defaultValue={initial.offer} className="input" placeholder="Was verkaufst Du, zu welchem Preis, mit welchem Ergebnis für den Kunden?" />
      </div>
      <div>
        <label className="label" htmlFor="audience">Zielgruppe</label>
        <textarea id="audience" name="audience" rows={3} defaultValue={initial.audience} className="input" placeholder="Wer genau? Welche Probleme, Wünsche, Einwände?" />
      </div>
      <div>
        <label className="label" htmlFor="tone">Tonalität</label>
        <input id="tone" name="tone" defaultValue={initial.tone} className="input" placeholder="z. B. per Du, warm, direkt, mit Humor" />
      </div>
      <div>
        <label className="label" htmlFor="extra_notes">Weitere Hinweise (optional)</label>
        <textarea id="extra_notes" name="extra_notes" rows={2} defaultValue={initial.extra_notes} className="input" placeholder="z. B. Begriffe, die Du nie verwendest; Deine Geschichte; aktuelle Aktionen" />
      </div>
      <Status state={state} />
      <button className="btn" disabled={pending}>{pending ? "Speichern …" : "Profil speichern"}</button>
    </form>
  );
}

export function ApiKeyForm({ last4 }: { last4: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveApiKey, {});

  return (
    <div className="mt-5 space-y-4">
      {last4 && (
        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
          <span>Gespeichert: sk-ant-…{last4}</span>
          <form action={deleteApiKey}>
            <button className="text-red-600">Entfernen</button>
          </form>
        </div>
      )}
      <form action={action} className="space-y-3">
        <label className="label" htmlFor="api_key">{last4 ? "Neuen Schlüssel eintragen" : "Schlüssel eintragen"}</label>
        <input id="api_key" name="api_key" type="password" autoComplete="off" className="input" placeholder="sk-ant-..." />
        <Status state={state} />
        <button className="btn" disabled={pending}>{pending ? "Speichern …" : "Schlüssel speichern"}</button>
      </form>
    </div>
  );
}
