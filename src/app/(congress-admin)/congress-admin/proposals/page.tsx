import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProposalsAdminPageClient } from "@/components/domain/ProposalsAdminPageClient";
import { CongressListSchema } from "@/lib/validators/congress";
import { UserSchema } from "@/lib/validators/user";
import { getSession } from "@/lib/auth/session";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function ProposalsPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const [congressesRes, meRes] = await Promise.all([
    fetch(`${BASE}/api/congresses`, { cache: "no-store" }),
    fetch(`${BASE}/api/users/me`, { cache: "no-store" }),
  ]);

  if (congressesRes.status === 401 || meRes.status === 401) redirect("/login");

  const [congressesRaw, meRaw] = await Promise.all([
    congressesRes.json() as Promise<unknown>,
    meRes.json() as Promise<unknown>,
  ]);

  const congressesParsed = CongressListSchema.safeParse(congressesRaw);
  const meParsed = UserSchema.safeParse(meRaw);
  const userId = meParsed.success ? meParsed.data.id : session.userId;

  if (!congressesParsed.success) {
    return (
      <div className="flex flex-col gap-6" data-testid="congress-admin-proposals-page">
        <PageHeader
          title="Propuestas"
          description="Revisa y evalua las propuestas recibidas."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          Error al cargar los congresos. Intenta de nuevo mas tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="congress-admin-proposals-page">
      <PageHeader
        title="Propuestas"
        description="Revisa y evalua las propuestas recibidas."
      />
      <ProposalsAdminPageClient
        congresses={congressesParsed.data.items}
        currentUserId={userId}
      />
    </div>
  );
}
