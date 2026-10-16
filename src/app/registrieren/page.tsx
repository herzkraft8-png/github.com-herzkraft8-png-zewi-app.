import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Public";

export default function Registrieren() {
  return (
    <main className="wrap auth">
      <div className="card">
        <Logo />
        <h1 style={{ fontSize: 28 }}>Kostenlos starten</h1>
        <p className="muted">5 Aufträge pro Monat gratis. Keine Kreditkarte nötig.</p>
        <AuthForm modus="registrieren" />
        <p className="muted">Schon registriert? <Link href="/login">Anmelden</Link></p>
      </div>
    </main>
  );
}
