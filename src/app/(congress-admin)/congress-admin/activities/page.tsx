import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ActivitiesPageClient } from "@/components/domain/ActivitiesPageClient";
import { CongressListSchema } from "@/lib/validators/congress";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function ActivitiesPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const res = await fetch(`${BASE}/api/congresses`, { cache: "no-store" });
  if (res.status === 401) redirect("/login");

  const raw: unknown = await res.json();
  const parsed = CongressListSchema.safeParse(raw);
  const congresses = parsed.success ? parsed.data.items : [];

  return <ActivitiesPageClient congresses={congresses} />;
}
