import Link from "next/link";

const steps = [
  { title: "Profil anlegen", text: "Angebot, Zielgruppe und Tonalität einmal hinterlegen. Jeder Agent nutzt diese Infos." },
  { title: "Eigenen KI-Schlüssel verbinden", text: "Du zahlst die KI direkt bei Anthropic, nur was Du nutzt. Dein Schlüssel wird verschlüsselt gespeichert." },
  { title: "Wochenplan erstellen", text: "Ziel und Thema eingeben, Plattformen wählen. In rund einer Minute steht ein fertiger Plan mit allen Texten." },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16">
      <header className="flex items-center justify-between">
        <span className="text-lg font-semibold">Zewi</span>
        <Link href="/login" className="btn-secondary">Einloggen</Link>
      </header>

      <section className="mt-20 max-w-2xl">
        <p className="text-sm font-medium text-accent">KI-Marketing-Agenten für Coaches und Berater</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Dein Social-Media-Wochenplan. Fertig in einer Minute.
        </h1>
        <p className="mt-5 text-lg text-muted">
          Zewi schreibt Beiträge, die zu Deinem Angebot passen und Anfragen bringen sollen,
          nicht nur Likes. Du prüfst, passt an und postest.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/login?modus=registrieren" className="btn">Kostenlos starten</Link>
        </div>
      </section>

      <section className="mt-24 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="card">
            <p className="text-sm text-muted">Schritt {i + 1}</p>
            <h2 className="mt-1 font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted">{s.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
