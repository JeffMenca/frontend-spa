"use client";

import { useState, useCallback } from "react";
import { ClipboardCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AttendanceListSchema,
  RegisterAttendanceSchema,
  type AttendanceData,
  type RegisterAttendanceData,
} from "@/lib/validators/attendance";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ActivityListSchema, type ActivityData } from "@/lib/validators/activity";
import { type CongressData } from "@/lib/validators/congress";
import { formatDateTime } from "@/lib/utils/format";
import { useToast } from "@/hooks/useToast";

interface AttendancePageClientProps {
  congresses: CongressData[];
}

export function AttendancePageClient({
  congresses,
}: AttendancePageClientProps): React.ReactElement {
  const toast = useToast();

  const [selectedCongressId, setSelectedCongressId] = useState<string>("");
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterAttendanceData>({
    resolver: zodResolver(RegisterAttendanceSchema),
    defaultValues: { activityId: "", personalId: "" },
  });

  const selectedActivityId = watch("activityId");

  const fetchActivities = useCallback(
    async (congressId: string) => {
      setLoadingActivities(true);
      setActivities([]);
      setValue("activityId", "");
      setAttendanceHistory([]);
      try {
        const res = await fetch(`/api/congresses/${congressId}/activities`);
        if (!res.ok) {
          toast.error("Error al cargar las actividades.");
          return;
        }
        const raw: unknown = await res.json();
        const parsed = ActivityListSchema.safeParse(raw);
        if (!parsed.success) {
          toast.error("Error al procesar las actividades.");
          return;
        }
        setActivities(parsed.data.items);
      } catch {
        toast.error("Error de conexion al cargar las actividades.");
      } finally {
        setLoadingActivities(false);
      }
    },
    [setValue, toast],
  );

  const handleCongressChange = async (congressId: string) => {
    setSelectedCongressId(congressId);
    if (congressId !== "") {
      await fetchActivities(congressId);
    } else {
      setActivities([]);
      setValue("activityId", "");
    }
  };

  const onRegisterAttendance = async (data: RegisterAttendanceData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/attendance/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body: unknown = await res.json();
        const parsed = ProblemDetailSchema.safeParse(body);
        toast.error(parsed.success ? parsed.data.detail : "Error al registrar asistencia.");
        return;
      }
      toast.success("Asistencia registrada exitosamente.");
      reset({ activityId: data.activityId, personalId: "" });
    } catch {
      toast.error("Error de conexion al registrar asistencia.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewHistory = async () => {
    if (selectedActivityId === "") {
      toast.error("Selecciona una actividad para ver el historial.");
      return;
    }
    setLoadingHistory(true);
    try {
      const res = await fetch(
        `/api/attendance?activityId=${encodeURIComponent(selectedActivityId)}`,
      );
      if (!res.ok) {
        toast.error("Error al cargar el historial de asistencia.");
        return;
      }
      const raw: unknown = await res.json();
      const parsed = AttendanceListSchema.safeParse(raw);
      if (!parsed.success) {
        toast.error("Error al procesar el historial.");
        return;
      }
      setAttendanceHistory(parsed.data.items);
    } catch {
      toast.error("Error de conexion al cargar el historial.");
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Seccion 1: Registro */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck size={20} strokeWidth={1.5} className="text-[var(--color-primary-text)]" />
          <h2 className="font-sans text-lg font-medium text-[var(--color-text-primary-black)]">
            Registrar asistencia
          </h2>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(onRegisterAttendance)(e)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="attendance-congress-select">Congreso</Label>
            <select
              id="attendance-congress-select"
              value={selectedCongressId}
              onChange={(e) => void handleCongressChange(e.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              data-testid="attendance-congress-select"
            >
              <option value="">-- Selecciona un congreso --</option>
              {congresses.map((congress) => (
                <option key={congress.id} value={congress.id}>
                  {congress.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="attendance-activity-select">Actividad</Label>
            <select
              id="attendance-activity-select"
              value={selectedActivityId}
              onChange={(e) => setValue("activityId", e.target.value)}
              disabled={selectedCongressId === "" || loadingActivities}
              className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="attendance-activity-select"
            >
              <option value="">
                {loadingActivities ? "Cargando actividades..." : "-- Selecciona una actividad --"}
              </option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} ({activity.type})
                </option>
              ))}
            </select>
            {errors.activityId !== undefined && (
              <p className="font-secondary text-xs text-[var(--color-error)]">
                {errors.activityId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="attendance-personalid-input">Identificacion del participante</Label>
            <Input
              id="attendance-personalid-input"
              placeholder="Ej. 12345678 o ABC123"
              {...register("personalId")}
              className="h-11"
              data-testid="attendance-personalid-input"
            />
            {errors.personalId !== undefined && (
              <p className="font-secondary text-xs text-[var(--color-error)]">
                {errors.personalId.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={submitting || selectedCongressId === ""}
              className="min-h-[44px] bg-[var(--color-primary)] text-white hover:scale-[1.01] active:scale-[0.99]"
              data-testid="attendance-register-button"
            >
              {submitting ? "Registrando..." : "Registrar asistencia"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleViewHistory()}
              disabled={selectedActivityId === "" || loadingHistory}
              className="min-h-[44px] border-[var(--color-border)] text-[var(--color-text-primary)]"
            >
              {loadingHistory ? "Cargando..." : "Ver historial"}
            </Button>
          </div>
        </form>
      </div>

      {/* Seccion 2: Historial */}
      {attendanceHistory.length > 0 && (
        <div className="flex flex-col gap-3 animate-fade-in-up">
          <h2 className="font-sans text-lg font-medium text-[var(--color-text-primary-black)]">
            Historial de asistencia
          </h2>
          <div
            className="overflow-x-auto rounded-lg border border-[var(--color-border)]"
            data-testid="attendance-history-table"
          >
            <table className="w-full border-collapse font-secondary text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-primary)]">
                    Identificacion
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-text-primary)]">
                    Fecha de registro
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`border-b border-[var(--color-border)] transition-colors duration-150 ${
                      idx % 2 === 0 ? "bg-[var(--color-white)]" : "bg-[var(--color-surface)]"
                    }`}
                  >
                    <td className="px-4 py-3 text-[var(--color-text-primary)]">
                      {record.personalId}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)]">
                      {formatDateTime(record.registeredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
