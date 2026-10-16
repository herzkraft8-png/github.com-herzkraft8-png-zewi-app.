import { Footer, PublicNav } from "./Public";

export function Legal({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="wrap legal">
        <h1>{titel}</h1>
        <p className="notice">Vorlage – vor dem Start von einer Juristin / einem Juristen oder über die WKO prüfen lassen. Gelb markierte Stellen ausfüllen.</p>
        {children}
      </main>
      <Footer />
    </>
  );
}
export const T = ({ children }: { children: React.ReactNode }) => <span className="todo">{children}</span>;
