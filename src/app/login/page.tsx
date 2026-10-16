import Link from "next/link";
import { AuthForm } from "./auth-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { modus } = await searchParams;
  const mode = modus === "registrieren" ? "signup" : "signin";

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-20">
      <Link href="/" className="text-sm text-muted">← Zewi</Link>
      <h1 className="mt-6 text-2xl font-semibold">
        {mode === "signup" ? "Konto erstellen" : "Einloggen"}
      </h1>
      <AuthForm mode={mode} />
      <p className="mt-6 text-sm text-muted">
        {mode === "signup" ? (
          <>Schon ein Konto? <Link href="/login" className="text-accent">Einloggen</Link></>
        ) : (
          <>Noch kein Konto? <Link href="/login?modus=registrieren" className="text-accent">Registrieren</Link></>
        )}
      </p>
    </main>
  );
}
