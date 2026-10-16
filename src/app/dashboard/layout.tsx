import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const { user } = await getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-full flex-col">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
          <Link href="/dashboard" className="font-semibold">Zewi</Link>
          <Link href="/dashboard/agent/social" className="text-muted hover:text-foreground">Social-Media-Agent</Link>
          <Link href="/dashboard/profil" className="text-muted hover:text-foreground">Profil</Link>
          <form action={signOut} className="ml-auto">
            <button className="text-muted hover:text-foreground">Abmelden</button>
          </form>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
