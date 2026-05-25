import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getSession } from "@/lib/auth/session";

export default async function AttendancePage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) redirect("/login");

  return (
    <div className="flex flex-col gap-6" data-testid="congress-admin-attendance-page">
      <PageHeader
        title="Registro de asistencia"
        description="Registra y consulta la asistencia a actividades."
      />
      <EmptyState
        icon={<ClipboardList size={28} strokeWidth={1.5} />}
        title="Asistencia no disponible"
        description="Esta funcionalidad estara disponible pronto. Vuelve a intentarlo mas tarde."
      />
    </div>
  );
}
