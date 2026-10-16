"use client";

import { useActionState } from "react";
import { runSocialAgentAction, type AgentState } from "@/app/actions/agent";

const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "TikTok"];

export function SocialAgentForm() {
  const [state, action, pending] = useActionState<AgentState, FormData>(runSocialAgentAction, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="label" htmlFor="goal">Ziel dieser Woche</label>
        <input id="goal" name="goal" required className="input" placeholder="z. B. 5 Erstgespräche für mein Gruppenprogramm buchen" />
      </div>
      <div>
        <label className="label" htmlFor="topic">Thema oder Schwerpunkt (optional)</label>
        <input id="topic" name="topic" className="input" placeholder="z. B. Warum Selbstständige sich zu billig verkaufen" />
      </div>
      <fieldset>
        <legend className="label">Plattformen</legend>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p, i) => (
            <label key={p} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <input type="checkbox" name="platforms" value={p} defaultChecked={i < 2} />
              {p}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label className="label" htmlFor="postsPerWeek">Anzahl Beiträge</label>
        <select id="postsPerWeek" name="postsPerWeek" defaultValue="5" className="input max-w-32">
          {[3, 4, 5, 6, 7, 10, 14].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button className="btn" disabled={pending}>
        {pending ? "Agent arbeitet … (ca. 1 Minute)" : "Wochenplan erstellen"}
      </button>
    </form>
  );
}
