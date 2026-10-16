"use client";

import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    mode === "signup" ? signUp : signIn,
    {},
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="email">E-Mail</label>
        <input id="email" name="email" type="email" required className="input" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">Passwort</label>
        <input
          id="password" name="password" type="password" required minLength={8} className="input"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-accent">{state.message}</p>}
      <button className="btn w-full" disabled={pending}>
        {pending ? "Bitte warten …" : mode === "signup" ? "Konto erstellen" : "Einloggen"}
      </button>
    </form>
  );
}
