import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { CongressesPageClient } from "@/components/domain/CongressesPageClient";
import { CongressListSchema } from "@/lib/validators/congress";
import { InstitutionListSchema } from "@/lib/validators/institution";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function CongressesManagementPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const [congressesRes, institutionsRes] = await Promise.all([
    fetch(`${BASE}/api/congresses`, { cache: "no-store" }),
    fetch(`${BASE}/api/institutions`, { cache: "no-store" }),
  ]);

  if (congressesRes.status === 401 || institutionsRes.status === 401) {
    redirect("/login");
  }

  const rawCongresses: unknown = await congressesRes.json();
  const rawInstitutions: unknown = await institutionsRes.json();

  const parsedCongresses = CongressListSchema.safeParse(rawCongresses);
  const parsedInstitutions = InstitutionListSchema.safeParse(rawInstitutions);

  const congresses = parsedCongresses.success
    ? parsedCongresses.data.items
    : [];
  const institutions = parsedInstitutions.success
    ? parsedInstitutions.data.items
    : [];

  return (
    <CongressesPageClient
      congresses={congresses}
      institutions={institutions}
    />
  );
}
