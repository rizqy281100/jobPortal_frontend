import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfileFormClient from "./ProfileFormClient";

export default async function ProfilePage() {
  const session = await readSession();
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <header className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Lengkapi profil untuk meningkatkan peluang lolos screening.
        </p>
      </header>

      <ProfileFormClient
        defaultName={session.name}
        defaultEmail={session.email}
      />
    </div>
  );
}
