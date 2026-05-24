"use client";

import { useState, useCallback } from "react";
import { Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ActivityBadge } from "@/components/domain/ActivityBadge";
import { ActivityFormDialog } from "@/components/domain/ActivityFormDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ActivityListSchema, type ActivityData } from "@/lib/validators/activity";
import type { CongressData } from "@/lib/validators/congress";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";
import { formatDateTime } from "@/lib/utils/format";
import { useToast } from "@/hooks/useToast";

interface ActivitiesPageClientProps {
  congresses: CongressData[];
}

export function ActivitiesPageClient({
  congresses,
}: ActivitiesPageClientProps): React.ReactElement {
  const toast = useToast();
  const [selectedCongressId, setSelectedCongressId] = useState<string | null>(
    null,
  );
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editTarget, setEditTarget] = useState<ActivityData | undefined>(
    undefined,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ActivityData | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const loadActivities = useCallback(
    async (congressId: string): Promise<void> => {
      setIsLoadingActivities(true);
      try {
        const res = await fetch(`/api/congresses/${congressId}/activities`);
        if (!res.ok) {
          toast.error("Error al cargar las actividades.");
          setActivities([]);
          return;
        }
        const raw: unknown = await res.json();
        const parsed = ActivityListSchema.safeParse(raw);
        if (parsed.success) {
          setActivities(parsed.data.items);
        } else {
          setActivities([]);
        }
      } catch {
        toast.error(
          ERROR_MESSAGES["system.internal_error"] ?? "Error inesperado.",
        );
        setActivities([]);
      } finally {
        setIsLoadingActivities(false);
      }
    },
    [toast],
  );

  function handleCongressChange(congressId: string): void {
    setSelectedCongressId(congressId === "" ? null : congressId);
    if (congressId !== "") {
      void loadActivities(congressId);
    } else {
      setActivities([]);
    }
  }

  function openCreate(): void {
    setEditTarget(undefined);
    setFormMode("create");
    setFormOpen(true);
  }

  function openEdit(activity: ActivityData): void {
    setEditTarget(activity);
    setFormMode("edit");
    setFormOpen(true);
  }

  function openDelete(activity: ActivityData): void {
    setDeleteTarget(activity);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm(): Promise<void> {
    if (deleteTarget === undefined) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/activities/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (response.status === 204 || response.ok) {
        toast.success("Actividad eliminada correctamente.");
        setDeleteDialogOpen(false);
        setDeleteTarget(undefined);
        if (selectedCongressId !== null) {
          void loadActivities(selectedCongressId);
        }
        return;
      }

      const body: unknown = await response.json();
      const errorParsed = ProblemDetailSchema.safeParse(body);
      const code = errorParsed.success
        ? errorParsed.data.code
        : "system.internal_error";
      const message =
        ERROR_MESSAGES[code] ??
        ERROR_MESSAGES["system.internal_error"] ??
        "Error inesperado.";
      toast.error(message);
    } catch {
      toast.error(
        ERROR_MESSAGES["system.internal_error"] ?? "Error inesperado.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleActivityFormSuccess(): void {
    if (selectedCongressId !== null) {
      void loadActivities(selectedCongressId);
    }
  }

  return (
    <div
      data-testid="congress-admin-activities-page"
      className="flex flex-col gap-6"
    >
      <PageHeader
        title="Actividades"
        description="Administra las actividades de tus congresos."
        action={
          selectedCongressId !== null ? (
            <Button
              onClick={openCreate}
              className="min-h-[44px] bg-[var(--color-primary)] text-white transition-transform duration-200 hover:scale-[1.01] hover:bg-[var(--color-primary)] active:scale-[0.99]"
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
              Nueva actividad
            </Button>
          ) : undefined
        }
      />

      {congresses.length === 0 ? (
        <EmptyState
          icon={<Building2 size={24} strokeWidth={1.5} />}
          title="No tienes congresos"
          description="Crea un congreso primero para poder agregar actividades."
        />
      ) : (
        <>
          {/* Congress selector */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="congress-select-activities"
              className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
            >
              Selecciona un congreso
            </label>
            <select
              id="congress-select-activities"
              value={selectedCongressId ?? ""}
              onChange={(e) => handleCongressChange(e.target.value)}
              className="h-11 w-full max-w-sm rounded-md border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary-black)] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">-- Selecciona un congreso --</option>
              {congresses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Activities list */}
          {selectedCongressId !== null && (
            <div>
              {isLoadingActivities ? (
                <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
                  Cargando actividades...
                </p>
              ) : activities.length === 0 ? (
                <EmptyState
                  icon={<Building2 size={24} strokeWidth={1.5} />}
                  title="No hay actividades registradas"
                  description="Agrega la primera actividad para este congreso."
                  action={
                    <Button
                      onClick={openCreate}
                      className="min-h-[44px] bg-[var(--color-primary)] text-white transition-transform duration-200 hover:scale-[1.01] hover:bg-[var(--color-primary)] active:scale-[0.99]"
                    >
                      <Plus size={16} strokeWidth={2} aria-hidden="true" />
                      Nueva actividad
                    </Button>
                  }
                />
              ) : (
                <ul
                  className="flex flex-col gap-3"
                  data-testid="activities-list"
                  aria-label="Lista de actividades"
                >
                  {activities.map((activity, index) => (
                    <li
                      key={activity.id}
                      className="animate-fade-in-up rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]"
                      style={
                        index > 0
                          ? {
                              animationDelay: `${Math.min(index * 75, 450)}ms`,
                            }
                          : undefined
                      }
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* Info block */}
                        <div className="flex flex-1 flex-col gap-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-sans text-sm font-medium text-[var(--color-text-primary-black)]">
                              {activity.name}
                            </h3>
                            <ActivityBadge type={activity.type} />
                          </div>
                          <p className="line-clamp-2 font-secondary text-xs text-[var(--color-text-primary)]">
                            {activity.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                            <span className="font-secondary">
                              Sala: {activity.roomId.slice(0, 8)}...
                            </span>
                            <span className="font-secondary">
                              {formatDateTime(activity.startTime)} &ndash;{" "}
                              {formatDateTime(activity.endTime)}
                            </span>
                            {activity.workshopCapacity !== null && (
                              <span className="font-secondary">
                                Capacidad: {activity.workshopCapacity}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(activity)}
                            className="min-h-[44px] border-[var(--color-border)] text-[var(--color-text-primary)]"
                            aria-label={`Editar actividad ${activity.name}`}
                          >
                            <Pencil
                              size={16}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="ml-1.5">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDelete(activity)}
                            className="min-h-[44px] border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white"
                            aria-label={`Eliminar actividad ${activity.name}`}
                          >
                            <Trash2
                              size={16}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="ml-1.5">Eliminar</span>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {/* Activity form dialog */}
      {selectedCongressId !== null && (
        <ActivityFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          congressId={selectedCongressId}
          mode={formMode}
          activity={editTarget}
          onSuccess={handleActivityFormSuccess}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-[var(--color-border)] bg-[var(--color-white)] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-sans text-lg font-medium text-[var(--color-text-primary-black)]">
              Eliminar actividad
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm text-[var(--color-text-secondary)]">
              Esta accion no se puede deshacer. Se eliminara la actividad{" "}
              <span className="font-medium text-[var(--color-text-primary-black)]">
                {deleteTarget?.name ?? ""}
              </span>{" "}
              y sus asignaciones de lideres.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteDialogOpen(false)}
              className="min-h-[44px]"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                void handleDeleteConfirm();
              }}
              className="min-h-[44px] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isDeleting ? "Eliminando..." : "Confirmar eliminacion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
