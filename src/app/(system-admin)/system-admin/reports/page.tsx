import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function SystemAdminReportsPage(): React.ReactElement {
  return (
    <div data-testid="system-admin-reports-page" className="flex flex-col gap-6">
      <PageHeader
        title="Reportes"
        description="Consulta y exporta los reportes del sistema."
      />
      <EmptyState
        icon={<BarChart3 size={28} strokeWidth={1.5} />}
        title="Reportes no disponibles"
        description="Esta funcionalidad estara disponible pronto. Vuelve a intentarlo mas tarde."
      />
    </div>
  );
}
