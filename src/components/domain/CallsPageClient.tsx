"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Megaphone } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { CallListSchema, type CallData } from "@/lib/validators/call";
import { type CongressData } from "@/lib/validators/congress";
import { formatDateTime } from "@/lib/utils/format";
import { useToast } from "@/hooks/useToast";

interface CallsPageClientProps {
  congresses: CongressData[];
}

export function CallsPageClient({
  congresses,
}: CallsPageClientProps): React.ReactElement {
  const router = useRouter();
  const toast = useToast();

  const [selectedCongressId, setSelectedCongressId] = useState<string>("");
  const [calls, setCalls] = useState<CallData[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [mutating, setMutating] = useState(false);

  const fetchCalls = useCallback(
    async (congressId: string) => {
      if (congressId === "") return;
      setLoadingCalls(true);
      try {
        const res = await fetch(`/api/congresses/${congressId}/calls`);
        if (!res.ok) {
          toast.error("Error al cargar las convocatorias.");
          return;
        }
        const raw: unknown = await res.json();
        const parsed = CallListSchema.safeParse(raw);
        if (!parsed.success) {
          toast.error("Error al procesar las convocatorias.");
          return;
        }
        setCalls(parsed.data.items);
      } catch {
        toast.error("Error de conexion al cargar las convocatorias.");
      } finally {
        setLoadingCalls(false);
      }
    },
    [toast],
  );

  const handleCongressChange = async (congressId: string) => {
    setSelectedCongressId(congressId);
    setCalls([]);
    await fetchCalls(congressId);
  };

  const handleOpenCall = async () => {
    if (selectedCongressId === "") return;
    setMutating(true);
    try {
      const res = await fetch(`/api/congresses/${selectedCongressId}/calls`, {
        method: "POST",
      });
      if (!res.ok) {
        const body: unknown = await res.json();
        const msg =
          typeof body === "object" &&
          body !== null &&
          "title" in body &&
          typeof (body as Record<string, unknown>)["title"] === "string"
            ? (body as Record<string, unknown>)["title"]
            : "Error al abrir la convocatoria.";
        toast.error(String(msg));
        return;
      }
      toast.success("Convocatoria abierta exitosamente.");
      router.refresh();
      await fetchCalls(selectedCongressId);
    } catch {
      toast.error("Error de conexion al abrir la convocatoria.");
    } finally {
      setMutating(false);
    }
  };

  const handleCloseCall = async (callId: string) => {
    setMutating(true);
    try {
      const res = await fetch(`/api/calls/${callId}/close`, {
        method: "PATCH",
      });
      if (!res.ok) {
        toast.error("Error al cerrar la convocatoria.");
        return;
      }
      toast.success("Convocatoria cerrada exitosamente.");
      router.refresh();
      await fetchCalls(selectedCongressId);
    } catch {
      toast.error("Error de conexion al cerrar la convocatoria.");
    } finally {
      setMutating(false);
    }
  };

  const hasOpenCall = calls.some((c) => c.status === "OPEN");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="congress-select-calls"
          className="font-sans text-sm font-medium text-[var(--color-text-primary)]"
        >
          Selecciona un congreso
        </label>
        <select
          id="congress-select-calls"
          value={selectedCongressId}
          onChange={(e) => void handleCongressChange(e.target.value)}
          className="h-11 w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
        >
          <option value="">-- Selecciona un congreso --</option>
          {congresses.map((congress) => (
            <option key={congress.id} value={congress.id}>
              {congress.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCongressId !== "" && (
        <div className="flex items-center justify-between">
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            {loadingCalls ? "Cargando convocatorias..." : `${calls.length} convocatoria(s)`}
          </p>
          {!hasOpenCall && (
            <Button
              onClick={() => void handleOpenCall()}
              disabled={mutating || loadingCalls}
              className="min-h-[44px] bg-[var(--color-primary)] text-white hover:scale-[1.01] active:scale-[0.99]"
              data-testid="open-call-button"
            >
              <Megaphone size={16} strokeWidth={1.5} />
              Abrir convocatoria
            </Button>
          )}
        </div>
      )}

      {selectedCongressId !== "" && !loadingCalls && (
        <>
          {calls.length === 0 ? (
            <EmptyState
              icon={<Megaphone size={24} strokeWidth={1.5} />}
              title="Sin convocatorias"
              description="Este congreso no tiene convocatorias registradas aun."
              action={
                <Button
                  onClick={() => void handleOpenCall()}
                  disabled={mutating}
                  className="min-h-[44px] bg-[var(--color-primary)] text-white hover:scale-[1.01] active:scale-[0.99]"
                  data-testid="open-call-button"
                >
                  <Megaphone size={16} strokeWidth={1.5} />
                  Abrir convocatoria
                </Button>
              }
            />
          ) : (
            <div
              className="flex flex-col gap-3 animate-fade-in-up"
              data-testid="calls-list"
            >
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-4 py-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-sans text-xs font-medium text-white ${
                          call.status === "OPEN"
                            ? "bg-green-600"
                            : "bg-[var(--color-text-secondary)]"
                        }`}
                      >
                        {call.status === "OPEN" ? "Abierta" : "Cerrada"}
                      </span>
                    </div>
                    <p className="font-secondary text-xs text-[var(--color-text-secondary)]">
                      Apertura: {formatDateTime(call.openedAt)}
                    </p>
                    {call.closedAt !== null && (
                      <p className="font-secondary text-xs text-[var(--color-text-secondary)]">
                        Cierre: {formatDateTime(call.closedAt)}
                      </p>
                    )}
                  </div>
                  {call.status === "OPEN" && (
                    <Button
                      variant="outline"
                      onClick={() => void handleCloseCall(call.id)}
                      disabled={mutating}
                      className="min-h-[44px] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                      data-testid="close-call-button"
                    >
                      Cerrar convocatoria
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedCongressId === "" && (
        <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 text-center">
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            Selecciona un congreso para ver sus convocatorias.
          </p>
        </div>
      )}
    </div>
  );
}
