import { SocialAgentForm } from "./form";

export default function SocialAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Social-Media-Agent</h1>
        <p className="mt-1 text-sm text-muted">
          Erstellt einen Wochenplan mit fertigen Texten. Nutzt Dein Firmenprofil und Deinen eigenen KI-Schlüssel.
        </p>
      </div>
      <div className="card">
        <SocialAgentForm />
      </div>
    </div>
  );
}
