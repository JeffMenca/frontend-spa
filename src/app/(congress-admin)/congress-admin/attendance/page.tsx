import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AttendancePageClient } from "@/components/domain/AttendancePageClient";
import { CongressListSchema } from "@/lib/validators/congress";
import { serverFetch } from "@/lib/api/server-fetch";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ congressId?: string; activityId?: string }>;
}): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const { congressId, activityId } = await searchParams;

  const res = await serverFetch(`${BASE}/api/congresses`, { cache: "no-store" });
  if (res.status === 401) redirect("/login");

  const raw: unknown = await res.json();
  const parsed = CongressListSchema.safeParse(raw);
  const congresses = parsed.success ? parsed.data.items : [];

  return (
    <AttendancePageClient
      congresses={congresses}
      initialCongressId={congressId}
      initialActivityId={activityId}
    />
  );
}
