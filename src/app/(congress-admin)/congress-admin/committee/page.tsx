import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { CommitteePageClient } from "@/components/domain/CommitteePageClient";
import { CongressListSchema } from "@/lib/validators/congress";
import { getSession } from "@/lib/auth/session";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function CommitteePage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const res = await fetch(`${BASE}/api/congresses`, { cache: "no-store" });
  if (res.status === 401) redirect("/login");

  const raw: unknown = await res.json();
  const parsed = CongressListSchema.safeParse(raw);

  if (!parsed.success) {
    return (
      <div className="flex flex-col gap-6" data-testid="congress-admin-committee-page">
        <PageHeader
          title="Comite cientifico"
          description="Gestiona los miembros del comite de evaluacion."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          Error al cargar los congresos. Intenta de nuevo mas tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="congress-admin-committee-page">
      <PageHeader
        title="Comite cientifico"
        description="Gestiona los miembros del comite de evaluacion."
      />
      <CommitteePageClient congresses={parsed.data.items} />
    </div>
  );
}
