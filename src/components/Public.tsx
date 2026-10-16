import Link from "next/link";
import { TEXTE } from "@/lib/produkt";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="ZEWI Startseite">
      <i>Z</i>{TEXTE.kurz.toUpperCase()}
    </Link>
  );
}

export function PublicNav() {
  return (
    <div className="wrap topnav">
      <Logo />
      <nav aria-label="Hauptmenü">
        <a href="/#agenten">{TEXTE.kurz === "ZEWI Capital" ? "Mentoren" : "Agenten"}</a>
        <a href="/#ablauf">So funktioniert's</a>
        <a href="/#preise">Preise</a>
        <Link href="/login">Login</Link>
        <Link href="/registrieren" className="btn primary small">Kostenlos starten →</Link>
      </nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="wrap footer">
      <span>© {new Date().getFullYear()} ZEWI · Micheldorf, Oberösterreich</span>
      <Link href="/impressum">Impressum</Link>
      <Link href="/datenschutz">Datenschutz</Link>
      <Link href="/agb">AGB</Link>
      {TEXTE.risiko && <p style={{ flexBasis: "100%", margin: 0 }}>{TEXTE.risiko}</p>}
    </footer>
  );
}
