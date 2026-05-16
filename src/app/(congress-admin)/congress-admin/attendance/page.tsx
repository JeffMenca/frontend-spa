import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AttendancePageClient } from "@/components/domain/AttendancePageClient";
import { CongressListSchema } from "@/lib/validators/congress";
import { getSession } from "@/lib/auth/session";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function AttendancePage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  const res = await fetch(`${BASE}/api/congresses`, { cache: "no-store" });
  if (res.status === 401) redirect("/login");

  const raw: unknown = await res.json();
  const parsed = CongressListSchema.safeParse(raw);

  if (!parsed.success) {
    return (
      <div className="flex flex-col gap-6" data-testid="congress-admin-attendance-page">
        <PageHeader
          title="Registro de asistencia"
          description="Registra y consulta la asistencia a actividades."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          Error al cargar los congresos. Intenta de nuevo mas tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="congress-admin-attendance-page">
      <PageHeader
        title="Registro de asistencia"
        description="Registra y consulta la asistencia a actividades."
      />
      <AttendancePageClient congresses={parsed.data.items} />
    </div>
  );
}
