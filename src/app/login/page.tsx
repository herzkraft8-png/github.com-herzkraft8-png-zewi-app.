import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Public";

export default async function Login({ searchParams }: { searchParams: Promise<{ weiter?: string }> }) {
  const { weiter } = await searchParams;
  return (
    <main className="wrap auth">
      <div className="card">
        <Logo />
        <h1 style={{ fontSize: 28 }}>Anmelden</h1>
        <AuthForm modus="login" weiter={weiter} />
        <p className="muted">Noch kein Konto? <Link href="/registrieren">Kostenlos starten</Link></p>
      </div>
    </main>
  );
}
