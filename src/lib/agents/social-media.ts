import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";

export const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "TikTok"] as const;
export type Platform = (typeof PLATFORMS)[number];

export type BusinessProfile = {
  business_name: string;
  offer: string;
  audience: string;
  tone: string;
  extra_notes: string;
};

export type SocialAgentInput = {
  goal: string;
  topic: string;
  platforms: Platform[];
  postsPerWeek: number;
};

export const socialPlanSchema = z.object({
  strategy: z
    .string()
    .describe("2-3 Sätze: roter Faden der Woche und warum er zum Ziel passt"),
  posts: z.array(
    z.object({
      day: z.string().describe("Wochentag, z. B. Montag"),
      platform: z.string(),
      format: z.string().describe("z. B. Karussell, Reel, Textpost, Story"),
      hook: z.string().describe("Erste Zeile, die zum Weiterlesen bringt"),
      text: z.string().describe("Vollständiger, sofort postbarer Text"),
      call_to_action: z.string(),
      hashtags: z.array(z.string()),
      visual_idea: z.string().describe("Kurze Idee für Bild oder Video"),
    }),
  ),
});

export type SocialPlan = z.infer<typeof socialPlanSchema>;

const SYSTEM_PROMPT = `Du bist ein erfahrener Social-Media-Stratege für Coaches und Berater im deutschsprachigen Raum.
Du schreibst Beiträge, die Vertrauen aufbauen und zu Anfragen führen, nicht nur Likes.

Regeln:
- Schreibe natürliches, modernes Deutsch ohne KI-Floskeln ("In der heutigen schnelllebigen Welt", "Tauche ein", "Gamechanger").
- Jeder Beitrag hat einen konkreten Nutzen für die Zielgruppe: ein Aha, ein Beispiel, eine Anleitung oder eine Geschichte.
- Keine Heilsversprechen, keine erfundenen Zahlen, Studien oder Kundenstimmen.
- Passe Länge und Stil an die Plattform an (LinkedIn sachlicher und länger, Instagram persönlicher, TikTok als Skript in kurzen Sätzen).
- Mische Formate: Mehrwert, Einblick hinter die Kulissen, Einwandbehandlung, klare Einladung zum Angebot.
- Verteile die Beiträge sinnvoll über die Woche (Montag bis Sonntag).`;

function buildUserPrompt(profile: BusinessProfile, input: SocialAgentInput) {
  return `Firmenprofil:
- Name: ${profile.business_name || "(nicht angegeben)"}
- Angebot: ${profile.offer || "(nicht angegeben)"}
- Zielgruppe: ${profile.audience || "(nicht angegeben)"}
- Tonalität: ${profile.tone || "(nicht angegeben)"}
- Weitere Hinweise: ${profile.extra_notes || "-"}

Auftrag für diese Woche:
- Ziel: ${input.goal}
- Thema/Schwerpunkt: ${input.topic || "frei wählen, passend zum Angebot"}
- Plattformen: ${input.platforms.join(", ")}
- Anzahl Beiträge: genau ${input.postsPerWeek}

Erstelle den Wochenplan.`;
}

export class AgentError extends Error {}

export async function runSocialAgent(
  apiKey: string,
  profile: BusinessProfile,
  input: SocialAgentInput,
) {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 120_000 });
  const model = process.env.AGENT_MODEL || "claude-sonnet-5-5";

  try {
    const message = await client.messages.parse({
      model,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(profile, input) }],
      output_config: { format: zodOutputFormat(socialPlanSchema) },
    });

    if (!message.parsed_output) {
      throw new AgentError("Die KI hat kein gültiges Ergebnis geliefert. Bitte erneut versuchen.");
    }

    return {
      plan: message.parsed_output,
      model,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    };
  } catch (err) {
    if (err instanceof AgentError) throw err;
    if (err instanceof Anthropic.AuthenticationError) {
      throw new AgentError("Dein API-Schlüssel ist ungültig. Bitte im Profil prüfen.");
    }
    if (err instanceof Anthropic.PermissionDeniedError) {
      throw new AgentError("Dein API-Schlüssel hat keine Berechtigung für dieses Modell.");
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new AgentError(
        "Limit erreicht oder kein Guthaben auf Deinem Anthropic-Konto. Bitte Guthaben prüfen und später erneut versuchen.",
      );
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw new AgentError("Keine Verbindung zur KI. Bitte später erneut versuchen.");
    }
    if (err instanceof Anthropic.APIError) {
      throw new AgentError(`Fehler von der KI (${err.status ?? "?"}). Bitte später erneut versuchen.`);
    }
    throw err;
  }
}
