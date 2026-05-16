import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, CalendarDays, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { EnrollmentListSchema } from "@/lib/validators/enrollment";
import { getSession } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/format";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function EnrollmentsPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) {
    redirect("/login");
  }

  const res = await fetch(`${BASE}/api/users/${session.userId}/enrollments`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const raw: unknown = await res.json();
  const parsed = EnrollmentListSchema.safeParse(raw);

  if (!parsed.success) {
    return (
      <div data-testid="enrollments-page" className="flex flex-col gap-6">
        <PageHeader
          title="Mis inscripciones"
          description="Congresos en los que estas inscrito."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          Error al cargar las inscripciones. Intenta de nuevo mas tarde.
        </p>
      </div>
    );
  }

  const enrollments = parsed.data.items;

  return (
    <div data-testid="enrollments-page" className="flex flex-col gap-6">
      <PageHeader
        title="Mis inscripciones"
        description="Congresos en los que estas inscrito."
      />

      {enrollments.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={28} strokeWidth={1.5} />}
          title="No tienes inscripciones"
          description="Explora los congresos disponibles e inscribete."
          action={
            <Link
              href="/congresses"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 font-sans text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              Ver congresos
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          }
        />
      ) : (
        <ul
          className="flex flex-col gap-3"
          data-testid="enrollment-list"
          aria-label="Lista de inscripciones"
        >
          {enrollments.map((enrollment, index) => (
            <li
              key={enrollment.id}
              className="animate-fade-in-up rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-high)]"
              style={index > 0 ? { animationDelay: `${Math.min(index * 75, 450)}ms` } : undefined}
              data-testid="enrollment-item"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/congresses/${enrollment.congressId}`}
                    className="font-sans text-base font-medium text-[var(--color-primary-text)] hover:underline"
                    aria-label={`Ver congreso ${enrollment.congressId.slice(0, 8)}`}
                  >
                    Congreso {enrollment.congressId.slice(0, 8)}
                  </Link>

                  <div className="flex items-center gap-1.5 font-secondary text-xs text-[var(--color-text-secondary)]">
                    <CalendarDays size={12} strokeWidth={1.5} aria-hidden="true" />
                    <span>Inscripcion: {formatDate(enrollment.enrolledAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-secondary text-sm font-medium text-[var(--color-text-primary-black)]">
                    {formatDate(enrollment.paymentDate)}
                  </span>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-[var(--color-text-secondary)]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
