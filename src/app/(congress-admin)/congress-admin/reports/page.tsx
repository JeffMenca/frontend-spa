"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ReportTable } from "@/components/domain/ReportTable";
import {
  CongressListSchema,
  type CongressData,
} from "@/lib/validators/congress";
import {
  ParticipantReportSchema,
  AttendanceByActivityReportSchema,
  WorkshopReservationReportSchema,
  EarningsByCongressReportSchema,
  type ParticipantReportRowData,
  type AttendanceByActivityRowData,
  type WorkshopReservationRowData,
  type EarningsByCongressRowData,
} from "@/lib/validators/reports";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/hooks/useToast";

type TabKey = "participants" | "attendance" | "reservations" | "earnings";

const TAB_LABELS: Record<TabKey, string> = {
  participants: "Participantes",
  attendance: "Asistencia",
  reservations: "Reservas",
  earnings: "Ganancias",
};

const TAB_TEST_IDS: Record<TabKey, string> = {
  participants: "tab-participants",
  attendance: "tab-attendance",
  reservations: "tab-reservations",
  earnings: "tab-earnings",
};

export default function CongressAdminReportsPage(): React.ReactElement {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>("participants");
  const [congresses, setCongresses] = useState<CongressData[]>([]);
  const [selectedCongressId, setSelectedCongressId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingCongresses, setLoadingCongresses] = useState(true);

  const [participantsData, setParticipantsData] = useState<ParticipantReportRowData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceByActivityRowData[]>([]);
  const [reservationsData, setReservationsData] = useState<WorkshopReservationRowData[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsByCongressRowData[]>([]);
  const [earningsGrandTotal, setEarningsGrandTotal] = useState<number>(0);

  useEffect(() => {
    const loadCongresses = async () => {
      try {
        const res = await fetch("/api/congresses");
        if (!res.ok) {
          toast.error("Error al cargar los congresos.");
          return;
        }
        const raw: unknown = await res.json();
        const parsed = CongressListSchema.safeParse(raw);
        if (parsed.success) {
          setCongresses(parsed.data.items);
        }
      } catch {
        toast.error("Error de conexion al cargar los congresos.");
      } finally {
        setLoadingCongresses(false);
      }
    };
    void loadCongresses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async () => {
    if (activeTab !== "earnings" && selectedCongressId === "") {
      toast.error("Selecciona un congreso para buscar.");
      return;
    }
    setLoading(true);
    try {
      if (activeTab === "participants") {
        const res = await fetch(
          `/api/reports/participants?congressId=${encodeURIComponent(selectedCongressId)}`,
        );
        if (!res.ok) { toast.error("Error al obtener reporte de participantes."); return; }
        const raw: unknown = await res.json();
        const parsed = ParticipantReportSchema.safeParse(raw);
        if (parsed.success) setParticipantsData(parsed.data.items);
        else toast.error("Error al procesar reporte de participantes.");
      } else if (activeTab === "attendance") {
        const res = await fetch(
          `/api/reports/attendance-by-activity?congressId=${encodeURIComponent(selectedCongressId)}`,
        );
        if (!res.ok) { toast.error("Error al obtener reporte de asistencia."); return; }
        const raw: unknown = await res.json();
        const parsed = AttendanceByActivityReportSchema.safeParse(raw);
        if (parsed.success) setAttendanceData(parsed.data.items);
        else toast.error("Error al procesar reporte de asistencia.");
      } else if (activeTab === "reservations") {
        const res = await fetch(
          `/api/reports/workshop-reservations?congressId=${encodeURIComponent(selectedCongressId)}`,
        );
        if (!res.ok) { toast.error("Error al obtener reporte de reservas."); return; }
        const raw: unknown = await res.json();
        const parsed = WorkshopReservationReportSchema.safeParse(raw);
        if (parsed.success) setReservationsData(parsed.data.items);
        else toast.error("Error al procesar reporte de reservas.");
      } else if (activeTab === "earnings") {
        const params = selectedCongressId !== ""
          ? `?congressId=${encodeURIComponent(selectedCongressId)}`
          : "";
        const res = await fetch(`/api/reports/earnings-by-congress${params}`);
        if (!res.ok) { toast.error("Error al obtener reporte de ganancias."); return; }
        const raw: unknown = await res.json();
        const parsed = EarningsByCongressReportSchema.safeParse(raw);
        if (parsed.success) {
          setEarningsData(parsed.data.items);
          setEarningsGrandTotal(parsed.data.grandTotal);
        } else {
          toast.error("Error al procesar reporte de ganancias.");
        }
      }
    } catch {
      toast.error("Error de conexion al obtener el reporte.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedCongressId, toast]);

  const handleExportHtml = () => {
    const base = activeTab === "participants"
      ? `/api/reports/participants?congressId=${encodeURIComponent(selectedCongressId)}&format=html`
      : activeTab === "attendance"
      ? `/api/reports/attendance-by-activity?congressId=${encodeURIComponent(selectedCongressId)}&format=html`
      : activeTab === "reservations"
      ? `/api/reports/workshop-reservations?congressId=${encodeURIComponent(selectedCongressId)}&format=html`
      : selectedCongressId !== ""
      ? `/api/reports/earnings-by-congress?congressId=${encodeURIComponent(selectedCongressId)}&format=html`
      : "/api/reports/earnings-by-congress?format=html";
    window.open(base, "_blank");
  };

  const participantColumns: Array<{
    key: keyof ParticipantReportRowData;
    header: string;
    render?: (value: ParticipantReportRowData[keyof ParticipantReportRowData], row: ParticipantReportRowData) => React.ReactNode;
  }> = [
    { key: "personalId", header: "Identificacion" },
    { key: "fullName", header: "Nombre" },
    { key: "organization", header: "Organizacion" },
    { key: "email", header: "Correo" },
    { key: "phone", header: "Telefono" },
    {
      key: "participationTypes",
      header: "Tipos de participacion",
      render: (value) =>
        Array.isArray(value) ? (value as string[]).join(", ") : String(value),
    },
  ];

  const attendanceColumns: Array<{
    key: keyof AttendanceByActivityRowData;
    header: string;
    render?: (value: AttendanceByActivityRowData[keyof AttendanceByActivityRowData], row: AttendanceByActivityRowData) => React.ReactNode;
  }> = [
    { key: "activityName", header: "Actividad" },
    { key: "roomName", header: "Sala" },
    {
      key: "startTime",
      header: "Inicio",
      render: (value) => formatDateTime(String(value)),
    },
    { key: "attendanceCount", header: "Asistentes" },
  ];

  const reservationColumns: Array<{
    key: keyof WorkshopReservationRowData;
    header: string;
  }> = [
    { key: "activityName", header: "Taller" },
    { key: "workshopCapacity", header: "Capacidad" },
    { key: "reservationCount", header: "Reservas" },
    { key: "availableSeats", header: "Disponibles" },
  ];

  const earningsColumns: Array<{
    key: keyof EarningsByCongressRowData;
    header: string;
    render?: (value: EarningsByCongressRowData[keyof EarningsByCongressRowData], row: EarningsByCongressRowData) => React.ReactNode;
  }> = [
    { key: "congressName", header: "Congreso" },
    {
      key: "totalAmount",
      header: "Total",
      render: (value) => formatCurrency(Number(value)),
    },
    {
      key: "commissionAmount",
      header: "Comision",
      render: (value) => formatCurrency(Number(value)),
    },
    {
      key: "netAmount",
      header: "Neto",
      render: (value) => formatCurrency(Number(value)),
    },
  ];

  return (
    <div className="flex flex-col gap-6" data-testid="congress-admin-reports-page">
      <PageHeader
        title="Reportes"
        description="Consulta y exporta reportes de tus congresos."
        action={
          <div className="flex items-center gap-2 text-[var(--color-primary-text)]">
            <BarChart3 size={20} strokeWidth={1.5} />
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-0">
        {(["participants", "attendance", "reservations", "earnings"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(tab); }}
            className={`min-h-[44px] rounded-t-lg px-4 py-2 font-sans text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] ${
              activeTab === tab
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-soft-blue)]"
            }`}
            data-testid={TAB_TEST_IDS[tab]}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] p-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="report-congress-select"
            className="font-sans text-sm font-medium text-[var(--color-text-primary)]"
          >
            Congreso
            {activeTab === "earnings" ? " (opcional)" : ""}
          </label>
          <select
            id="report-congress-select"
            value={selectedCongressId}
            onChange={(e) => { setSelectedCongressId(e.target.value); }}
            disabled={loadingCongresses}
            className="h-11 min-w-[220px] rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="report-congress-select"
          >
            <option value="">
              {loadingCongresses ? "Cargando..." : activeTab === "earnings" ? "-- Todos --" : "-- Selecciona un congreso --"}
            </option>
            {congresses.map((congress) => (
              <option key={congress.id} value={congress.id}>
                {congress.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => void handleSearch()}
            disabled={loading || loadingCongresses}
            className="min-h-[44px] bg-[var(--color-primary)] text-white hover:scale-[1.01] active:scale-[0.99]"
            data-testid="report-search-button"
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleExportHtml}
            className="min-h-[44px] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
            data-testid="export-html-button"
          >
            Exportar HTML
          </Button>
        </div>
      </div>

      {/* Contenido del tab activo */}
      <div className="animate-fade-in-up">
        {activeTab === "participants" && (
          <ReportTable<ParticipantReportRowData>
            columns={participantColumns}
            data={participantsData}
            caption="Listado de participantes"
          />
        )}

        {activeTab === "attendance" && (
          <ReportTable<AttendanceByActivityRowData>
            columns={attendanceColumns}
            data={attendanceData}
            caption="Asistencia por actividad"
          />
        )}

        {activeTab === "reservations" && (
          <ReportTable<WorkshopReservationRowData>
            columns={reservationColumns}
            data={reservationsData}
            caption="Reservas de talleres"
          />
        )}

        {activeTab === "earnings" && (
          <div className="flex flex-col gap-4">
            <ReportTable<EarningsByCongressRowData>
              columns={earningsColumns}
              data={earningsData}
              caption="Ganancias por congreso"
            />
            {earningsData.length > 0 && (
              <div className="flex justify-end rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <p className="font-sans text-sm font-medium text-[var(--color-text-primary-black)]">
                  Total general:{" "}
                  <span className="text-[var(--color-primary-text)]">
                    {formatCurrency(earningsGrandTotal)}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
