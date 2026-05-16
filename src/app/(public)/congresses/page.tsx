import { Suspense } from "react";
import { CalendarDays } from "lucide-react";
import { CongressCard } from "@/components/domain/CongressCard";
import { CongressFilters } from "@/components/domain/CongressFilters";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { CongressListSchema } from "@/lib/validators/congress";
import { InstitutionListSchema, type InstitutionData } from "@/lib/validators/institution";
import type { CongressSummary } from "@/types/congress";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

interface CongressesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function fetchCongresses(params: URLSearchParams): Promise<CongressSummary[]> {
  const url = `${BASE}/api/congresses${params.size > 0 ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  const raw: unknown = await res.json();
  const parsed = CongressListSchema.safeParse(raw);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.items;
}

async function fetchInstitutions(): Promise<InstitutionData[]> {
  const res = await fetch(`${BASE}/api/institutions`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  const raw: unknown = await res.json();
  const parsed = InstitutionListSchema.safeParse(raw);
  if (!parsed.success) {
    return [];
  }
  return parsed.data.items;
}

export default async function CongressesPage({
  searchParams,
}: CongressesPageProps): Promise<React.ReactElement> {
  const resolvedParams = await searchParams;

  const search =
    typeof resolvedParams["search"] === "string" ? resolvedParams["search"] : "";
  const institutionId =
    typeof resolvedParams["institutionId"] === "string"
      ? resolvedParams["institutionId"]
      : "";

  const upstreamParams = new URLSearchParams();
  if (search !== "") upstreamParams.set("search", search);
  if (institutionId !== "") upstreamParams.set("institutionId", institutionId);

  const [congresses, institutions] = await Promise.all([
    fetchCongresses(upstreamParams),
    fetchInstitutions(),
  ]);

  return (
    <div data-testid="congresses-page" className="flex flex-col gap-6">
      <PageHeader
        title="Congresos disponibles"
        description="Explora los congresos academicos disponibles e inscribete."
      />

      <Suspense fallback={<LoadingPage />}>
        <CongressFilters
          institutions={institutions}
          currentSearch={search}
          currentInstitutionId={institutionId}
        />
      </Suspense>

      {congresses.length === 0 ? (
        <EmptyState
          icon={
            <CalendarDays size={28} strokeWidth={1.5} />
          }
          title="No hay congresos disponibles"
          description="Vuelve mas tarde para ver nuevos congresos."
          className="mt-4"
        />
      ) : (
        <div
          className="grid animate-fade-in-up grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="congress-grid"
        >
          {congresses.map((congress, index) => (
            <div
              key={congress.id}
              className="animate-fade-in-up"
              style={index > 0 ? { animationDelay: `${Math.min(index * 75, 450)}ms` } : undefined}
            >
              <CongressCard congress={congress} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
