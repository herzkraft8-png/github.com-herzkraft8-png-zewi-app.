import type { Metadata } from "next";
import { Archivo, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TEXTE } from "@/lib/produkt";

// Schriften werden beim Build selbst gehostet – keine Verbindung zu Google beim Besuch (DSGVO).
const display = Archivo({ subsets: ["latin"], variable: "--f-display", axes: ["wdth"], display: "swap" });
const body = Source_Sans_3({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  title: TEXTE.titel,
  description: TEXTE.beschreibung,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
