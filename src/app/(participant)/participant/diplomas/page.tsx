import { redirect } from "next/navigation";
import { Award, Download, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { DiplomaListSchema } from "@/lib/validators/diploma";
import type { DiplomaData } from "@/lib/validators/diploma";
import { getSession } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/format";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

function DiplomaBadge({ type }: { type: DiplomaData["type"] }): React.ReactElement {
  if (type === "LEADERSHIP") {
    return (
      <span className="inline-flex items-center rounded-full bg-[var(--color-warning-bg)] border border-[var(--color-warning)] px-2 py-0.5 font-sans text-xs font-medium text-[var(--color-warning-text)]">
        Ponente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-2 py-0.5 font-sans text-xs font-medium text-white">
      Participacion
    </span>
  );
}

export default async function DiplomasPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) {
    redirect("/login");
  }

  const res = await fetch(`${BASE}/api/users/${session.userId}/diplomas`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const raw: unknown = await res.json();
  const parsed = DiplomaListSchema.safeParse(raw);

  if (!parsed.success) {
    return (
      <div data-testid="diplomas-page" className="flex flex-col gap-6">
        <PageHeader
          title="Mis diplomas"
          description="Certificados obtenidos por tu participacion en congresos."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          Error al cargar los diplomas. Intenta de nuevo mas tarde.
        </p>
      </div>
    );
  }

  const diplomas = parsed.data.items;

  return (
    <div data-testid="diplomas-page" className="flex flex-col gap-6">
      <PageHeader
        title="Mis diplomas"
        description="Certificados obtenidos por tu participacion en congresos."
      />

      {diplomas.length === 0 ? (
        <EmptyState
          icon={<Award size={28} strokeWidth={1.5} />}
          title="Aun no tienes diplomas"
          description="Participa en congresos y actividades para obtener tus diplomas."
        />
      ) : (
        <ul
          className="flex flex-col gap-3"
          data-testid="diploma-list"
          aria-label="Lista de diplomas"
        >
          {diplomas.map((diploma, index) => (
            <li
              key={diploma.id}
              className="animate-fade-in-up rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-high)]"
              style={index > 0 ? { animationDelay: `${Math.min(index * 75, 450)}ms` } : undefined}
              data-testid="diploma-item"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <DiplomaBadge type={diploma.type} />
                    <span className="font-sans text-base font-medium text-[var(--color-text-primary-black)]">
                      {diploma.congressName}
                    </span>
                  </div>

                  {diploma.type === "LEADERSHIP" && diploma.activityName !== null && (
                    <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
                      Actividad: {diploma.activityName}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 font-secondary text-xs text-[var(--color-text-secondary)]">
                    <CalendarDays size={12} strokeWidth={1.5} aria-hidden="true" />
                    <span>Emitido el {formatDate(diploma.issuedAt)}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {diploma.available ? (
                    <a
                      href={`/api/diplomas/${diploma.id}/download`}
                      download
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 font-sans text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
                      data-testid="diploma-download-button"
                      aria-label={`Descargar diploma de ${diploma.congressName}`}
                    >
                      <Download size={16} strokeWidth={1.5} aria-hidden="true" />
                      Descargar
                    </a>
                  ) : (
                    <span className="font-secondary text-sm text-[var(--color-text-secondary)]">
                      No disponible aun
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
