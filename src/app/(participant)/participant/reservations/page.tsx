import { redirect } from "next/navigation";
import { BookmarkX, CalendarDays, Layers } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CancelReservationButton } from "@/components/domain/CancelReservationButton";
import { ReservationListSchema } from "@/lib/validators/reservation";
import { getSession } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/format";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function ReservationsPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) {
    redirect("/login");
  }

  const res = await fetch(`${BASE}/api/users/${session.userId}/reservations`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const raw: unknown = await res.json();
  const parsed = ReservationListSchema.safeParse(raw);

  if (!parsed.success) {
    return (
      <div data-testid="reservations-page" className="flex flex-col gap-6">
        <PageHeader
          title="Mis reservas"
          description="Talleres en los que tienes lugar reservado."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          Error al cargar las reservas. Intenta de nuevo mas tarde.
        </p>
      </div>
    );
  }

  const reservations = parsed.data.items;

  return (
    <div data-testid="reservations-page" className="flex flex-col gap-6">
      <PageHeader
        title="Mis reservas"
        description="Talleres en los que tienes lugar reservado."
      />

      {reservations.length === 0 ? (
        <EmptyState
          icon={<BookmarkX size={28} strokeWidth={1.5} />}
          title="No tienes reservas activas"
          description="Reserva un lugar en los talleres disponibles desde el detalle del congreso."
        />
      ) : (
        <ul
          className="flex flex-col gap-3"
          data-testid="reservation-list"
          aria-label="Lista de reservas"
        >
          {reservations.map((reservation, index) => (
            <li
              key={reservation.id}
              className="animate-fade-in-up rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-high)]"
              style={index > 0 ? { animationDelay: `${Math.min(index * 75, 450)}ms` } : undefined}
              data-testid="reservation-item"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-pale-blue)] text-[var(--color-primary-text)]">
                      <Layers size={14} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="font-sans text-base font-medium text-[var(--color-text-primary-black)]">
                      Taller {reservation.activityId.slice(0, 8)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-secondary text-xs text-[var(--color-text-secondary)]">
                    <CalendarDays size={12} strokeWidth={1.5} aria-hidden="true" />
                    <span>Reservado el {formatDate(reservation.reservedAt)}</span>
                  </div>
                </div>

                <CancelReservationButton reservationId={reservation.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
