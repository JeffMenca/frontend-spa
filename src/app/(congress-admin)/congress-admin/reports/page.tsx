import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { CongressAdminReportsClient } from "@/components/domain/CongressAdminReportsClient";
import { CongressListSchema } from "@/lib/validators/congress";
import { serverFetch } from "@/lib/api/server-fetch";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function CongressAdminReportsPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const res = await serverFetch(`${BASE}/api/congresses`, { cache: "no-store" });
  if (res.status === 401) redirect("/login");

  const raw: unknown = await res.json().catch(() => ({}));
  const parsed = CongressListSchema.safeParse(raw);
  const congresses = parsed.success ? parsed.data.items : [];

  return <CongressAdminReportsClient congresses={congresses} />;
}
