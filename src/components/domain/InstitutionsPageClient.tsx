"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Pencil, Plus } from "lucide-react";
import type { InstitutionData } from "@/lib/validators/institution";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { InstitutionFormDialog } from "@/components/domain/InstitutionFormDialog";
import { DeleteInstitutionDialog } from "@/components/domain/DeleteInstitutionDialog";

interface InstitutionsPageClientProps {
  institutions: InstitutionData[];
}

export function InstitutionsPageClient({
  institutions,
}: InstitutionsPageClientProps): React.ReactElement {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<InstitutionData | null>(null);

  const handleSuccess = (): void => {
    setCreateOpen(false);
    setEditTarget(null);
    router.refresh();
  };

  return (
    <div data-testid="system-admin-institutions-page" className="flex flex-col gap-6">
      <PageHeader
        title="Instituciones"
        description="Administra las instituciones vinculadas a la plataforma."
        action={
          <Button
            data-testid="new-institution-button"
            onClick={() => { setCreateOpen(true); }}
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 min-h-[44px] gap-1.5"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nueva institucion
          </Button>
        }
      />

      {institutions.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" strokeWidth={1.5} />}
          title="Sin instituciones registradas"
          description="Crea la primera institucion para comenzar."
          action={
            <Button
              onClick={() => { setCreateOpen(true); }}
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 min-h-[44px]"
            >
              Nueva institucion
            </Button>
          }
        />
      ) : (
        <div
          data-testid="institutions-list"
          className="animate-fade-in-up overflow-x-auto rounded-lg border border-[var(--color-border)]"
        >
          <table className="w-full border-collapse font-secondary text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-primary)]">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-primary)]">
                  Correo de contacto
                </th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-primary)]">
                  Estado
                </th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-primary)]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((inst, idx) => (
                <tr
                  key={inst.id}
                  className={
                    idx % 2 === 0
                      ? "border-b border-[var(--color-border)] bg-[var(--color-white)] transition-colors duration-150"
                      : "border-b border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-150"
                  }
                >
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary-black)]">
                    {inst.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-primary)]">
                    {inst.contactEmail}
                  </td>
                  <td className="px-4 py-3">
                    {inst.active ? (
                      <span className="inline-flex items-center rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[var(--color-text-secondary)] px-2 py-0.5 text-xs font-medium text-white">
                        Inactiva
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditTarget(inst); }}
                        className="min-h-[44px] gap-1.5 border-[var(--color-border)]"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        Editar
                      </Button>
                      <DeleteInstitutionDialog
                        institutionId={inst.id}
                        institutionName={inst.name}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InstitutionFormDialog
        open={createOpen}
        mode="create"
        institution={undefined}
        onSuccess={handleSuccess}
        onClose={() => { setCreateOpen(false); }}
      />

      <InstitutionFormDialog
        open={editTarget !== null}
        mode="edit"
        institution={editTarget ?? undefined}
        onSuccess={handleSuccess}
        onClose={() => { setEditTarget(null); }}
      />
    </div>
  );
}
