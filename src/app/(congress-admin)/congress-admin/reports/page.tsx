import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function CongressAdminReportsPage(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6" data-testid="congress-admin-reports-page">
      <PageHeader
        title="Reportes"
        description="Consulta y exporta reportes de tus congresos."
      />
      <EmptyState
        icon={<BarChart3 size={28} strokeWidth={1.5} />}
        title="Reportes no disponibles"
        description="Esta funcionalidad estara disponible pronto. Vuelve a intentarlo mas tarde."
      />
    </div>
  );
}
