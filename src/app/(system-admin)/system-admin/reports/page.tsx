"use client";

import { useState } from "react";
import { Search, FileDown } from "lucide-react";
import {
  EarningsReportSchema,
  CongressesByInstitutionReportSchema,
  type EarningsRowData,
  type CongressesByInstitutionRowData,
} from "@/lib/validators/reports";
import { InstitutionListSchema, type InstitutionData } from "@/lib/validators/institution";
import { PageHeader } from "@/components/ui/page-header";
import { ReportTable } from "@/components/domain/ReportTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { useEffect } from "react";

type TabId = "earnings" | "congresses";

interface EarningsFilters {
  dateFrom: string;
  dateTo: string;
  institutionId: string;
}

interface CongressesFilters {
  dateFrom: string;
  dateTo: string;
}

interface FlatEarningsRow extends Record<string, unknown> {
  institutionName: string;
  congressName: string;
  totalAmount: string;
  commissionAmount: string;
  netAmount: string;
}

interface FlatCongressRow extends Record<string, unknown> {
  institutionName: string;
  congressName: string;
  startDate: string;
}

function buildEarningsUrl(filters: EarningsFilters): string {
  const params = new URLSearchParams();
  if (filters.dateFrom !== "") params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo !== "") params.set("dateTo", filters.dateTo);
  if (filters.institutionId !== "") params.set("institutionId", filters.institutionId);
  const qs = params.toString();
  return qs !== "" ? `/api/reports/earnings?${qs}` : "/api/reports/earnings";
}

function buildCongressesUrl(filters: CongressesFilters): string {
  const params = new URLSearchParams();
  if (filters.dateFrom !== "") params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo !== "") params.set("dateTo", filters.dateTo);
  const qs = params.toString();
  return qs !== "" ? `/api/reports/congresses-by-institution?${qs}` : "/api/reports/congresses-by-institution";
}

function flattenEarningsData(rows: EarningsRowData[]): FlatEarningsRow[] {
  const result: FlatEarningsRow[] = [];
  for (const row of rows) {
    for (const congress of row.congresses) {
      result.push({
        institutionName: row.institutionName,
        congressName: congress.congressName,
        totalAmount: formatCurrency(congress.totalAmount),
        commissionAmount: formatCurrency(congress.commissionAmount),
        netAmount: formatCurrency(congress.netAmount),
      });
    }
  }
  return result;
}

const earningsColumns = [
  { key: "institutionName" as const, header: "Institucion" },
  { key: "congressName" as const, header: "Congreso" },
  { key: "totalAmount" as const, header: "Total" },
  { key: "commissionAmount" as const, header: "Comision" },
  { key: "netAmount" as const, header: "Neto" },
];

const congressesColumns = [
  { key: "institutionName" as const, header: "Institucion" },
  { key: "congressName" as const, header: "Congreso" },
  {
    key: "startDate" as const,
    header: "Fecha de inicio",
    render: (value: unknown) => formatDate(String(value)),
  },
];

export default function SystemAdminReportsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>("earnings");
  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);

  const [earningsFilters, setEarningsFilters] = useState<EarningsFilters>({
    dateFrom: "",
    dateTo: "",
    institutionId: "",
  });
  const [earningsData, setEarningsData] = useState<FlatEarningsRow[]>([]);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [earningsError, setEarningsError] = useState<string | null>(null);
  const [earningsSearched, setEarningsSearched] = useState(false);

  const [congressesFilters, setCongressesFilters] = useState<CongressesFilters>({
    dateFrom: "",
    dateTo: "",
  });
  const [congressesData, setCongressesData] = useState<FlatCongressRow[]>([]);
  const [congressesLoading, setCongressesLoading] = useState(false);
  const [congressesError, setCongressesError] = useState<string | null>(null);
  const [congressesSearched, setCongressesSearched] = useState(false);

  useEffect(() => {
    const loadInstitutions = async (): Promise<void> => {
      const res = await fetch("/api/institutions", { cache: "no-store" });
      if (!res.ok) return;
      const raw = await res.json() as unknown;
      const parsed = InstitutionListSchema.safeParse(raw);
      if (parsed.success) setInstitutions(parsed.data.items);
    };
    void loadInstitutions();
  }, []);

  const searchEarnings = async (): Promise<void> => {
    setEarningsLoading(true);
    setEarningsError(null);
    setEarningsSearched(true);
    const res = await fetch(buildEarningsUrl(earningsFilters), { cache: "no-store" });
    setEarningsLoading(false);
    if (!res.ok) {
      setEarningsError("Error al cargar el reporte de ganancias.");
      setEarningsData([]);
      return;
    }
    const raw = await res.json() as unknown;
    const parsed = EarningsReportSchema.safeParse(raw);
    if (parsed.success) {
      setEarningsData(flattenEarningsData(parsed.data.items));
    } else {
      setEarningsError("Error al procesar los datos del reporte.");
      setEarningsData([]);
    }
  };

  const searchCongresses = async (): Promise<void> => {
    setCongressesLoading(true);
    setCongressesError(null);
    setCongressesSearched(true);
    const res = await fetch(buildCongressesUrl(congressesFilters), { cache: "no-store" });
    setCongressesLoading(false);
    if (!res.ok) {
      setCongressesError("Error al cargar el reporte de congresos.");
      setCongressesData([]);
      return;
    }
    const raw = await res.json() as unknown;
    const parsed = CongressesByInstitutionReportSchema.safeParse(raw);
    if (parsed.success) {
      const flat: FlatCongressRow[] = parsed.data.items.map(
        (row: CongressesByInstitutionRowData) => ({
          institutionName: row.institutionName,
          congressName: row.congressName,
          startDate: row.startDate,
        }),
      );
      setCongressesData(flat);
    } else {
      setCongressesError("Error al procesar los datos del reporte.");
      setCongressesData([]);
    }
  };

  const exportEarningsHtml = (): void => {
    const url = buildEarningsUrl(earningsFilters).replace(
      /(\?|$)/,
      (match) => (match === "?" ? "&format=html" : "?format=html"),
    );
    window.open(url, "_blank");
  };

  const exportCongressesHtml = (): void => {
    const url = buildCongressesUrl(congressesFilters).replace(
      /(\?|$)/,
      (match) => (match === "?" ? "&format=html" : "?format=html"),
    );
    window.open(url, "_blank");
  };

  return (
    <div data-testid="system-admin-reports-page" className="flex flex-col gap-6">
      <PageHeader
        title="Reportes"
        description="Consulta y exporta los reportes del sistema."
      />

      <div className="flex gap-0 border-b border-[var(--color-border)]">
        <button
          data-testid="earnings-tab"
          onClick={() => { setActiveTab("earnings"); }}
          className={[
            "px-4 py-2 font-secondary text-sm font-medium transition-colors duration-150 min-h-[44px]",
            activeTab === "earnings"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary-text)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
          ].join(" ")}
        >
          Ganancias
        </button>
        <button
          data-testid="congresses-tab"
          onClick={() => { setActiveTab("congresses"); }}
          className={[
            "px-4 py-2 font-secondary text-sm font-medium transition-colors duration-150 min-h-[44px]",
            activeTab === "congresses"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary-text)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
          ].join(" ")}
        >
          Congresos por institucion
        </button>
      </div>

      {activeTab === "earnings" && (
        <div className="animate-fade-in flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="earnings-dateFrom">Desde</Label>
              <Input
                id="earnings-dateFrom"
                type="date"
                value={earningsFilters.dateFrom}
                onChange={(e) => {
                  setEarningsFilters((prev) => ({ ...prev, dateFrom: e.target.value }));
                }}
                className="h-11 min-w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="earnings-dateTo">Hasta</Label>
              <Input
                id="earnings-dateTo"
                type="date"
                value={earningsFilters.dateTo}
                onChange={(e) => {
                  setEarningsFilters((prev) => ({ ...prev, dateTo: e.target.value }));
                }}
                className="h-11 min-w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="earnings-institution">Institucion</Label>
              <select
                id="earnings-institution"
                value={earningsFilters.institutionId}
                onChange={(e) => {
                  setEarningsFilters((prev) => ({ ...prev, institutionId: e.target.value }));
                }}
                className="h-11 min-w-[200px] rounded-md border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              >
                <option value="">Todas</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-testid="report-search-button"
                disabled={earningsLoading}
                onClick={() => { void searchEarnings(); }}
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 min-h-[44px] gap-1.5"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
                {earningsLoading ? "Buscando..." : "Buscar"}
              </Button>
              {earningsSearched && (
                <Button
                  data-testid="export-html-button"
                  variant="outline"
                  onClick={exportEarningsHtml}
                  className="min-h-[44px] gap-1.5 border-[var(--color-border)]"
                >
                  <FileDown className="h-4 w-4" strokeWidth={1.5} />
                  Exportar HTML
                </Button>
              )}
            </div>
          </div>
          {earningsError !== null && (
            <p className="font-secondary text-sm text-[var(--color-error)]">{earningsError}</p>
          )}
          {earningsSearched && (
            <ReportTable<FlatEarningsRow>
              columns={earningsColumns}
              data={earningsData}
              caption="Reporte de ganancias por congreso"
            />
          )}
        </div>
      )}

      {activeTab === "congresses" && (
        <div className="animate-fade-in flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="cong-dateFrom">Desde</Label>
              <Input
                id="cong-dateFrom"
                type="date"
                value={congressesFilters.dateFrom}
                onChange={(e) => {
                  setCongressesFilters((prev) => ({ ...prev, dateFrom: e.target.value }));
                }}
                className="h-11 min-w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="cong-dateTo">Hasta</Label>
              <Input
                id="cong-dateTo"
                type="date"
                value={congressesFilters.dateTo}
                onChange={(e) => {
                  setCongressesFilters((prev) => ({ ...prev, dateTo: e.target.value }));
                }}
                className="h-11 min-w-[160px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-testid="report-search-button"
                disabled={congressesLoading}
                onClick={() => { void searchCongresses(); }}
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 min-h-[44px] gap-1.5"
              >
                <Search className="h-4 w-4" strokeWidth={2} />
                {congressesLoading ? "Buscando..." : "Buscar"}
              </Button>
              {congressesSearched && (
                <Button
                  data-testid="export-html-button"
                  variant="outline"
                  onClick={exportCongressesHtml}
                  className="min-h-[44px] gap-1.5 border-[var(--color-border)]"
                >
                  <FileDown className="h-4 w-4" strokeWidth={1.5} />
                  Exportar HTML
                </Button>
              )}
            </div>
          </div>
          {congressesError !== null && (
            <p className="font-secondary text-sm text-[var(--color-error)]">
              {congressesError}
            </p>
          )}
          {congressesSearched && (
            <ReportTable<FlatCongressRow>
              columns={congressesColumns}
              data={congressesData}
              caption="Congresos por institucion"
            />
          )}
        </div>
      )}
    </div>
  );
}
