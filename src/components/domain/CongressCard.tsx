import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { CongressSummary } from "@/types/congress";

interface CongressCardProps {
  congress: CongressSummary;
}

export function CongressCard({ congress }: CongressCardProps): React.ReactElement {
  return (
    <article
      className="group flex flex-col rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-high)]"
      data-testid="congress-card"
    >
      {/* Accent bar that grows on hover */}
      <div className="h-1 w-0 rounded-t-[var(--radius-md)] bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-sans text-base font-medium leading-snug text-[var(--color-text-primary-black)] transition-colors duration-200 group-hover:text-[var(--color-primary-text)]"
            data-testid="congress-card-name"
          >
            {congress.name}
          </h3>
          {/*
           * Badge uses solid primary bg + white text — works in both light and dark
           * because --color-primary is always a dark-enough blue for white text.
           */}
          <Badge
            className="shrink-0 rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 font-sans text-xs font-medium text-white hover:bg-[var(--color-primary)]"
            data-testid="congress-card-price"
          >
            {formatCurrency(congress.price)}
          </Badge>
        </div>

        {/* Institution */}
        <p
          className="font-secondary text-xs text-[var(--color-text-secondary)]"
          data-testid="congress-card-institution"
        >
          {congress.institutionName}
        </p>

        {/* Description */}
        <p className="line-clamp-2 flex-1 font-secondary text-sm leading-relaxed text-[var(--color-text-primary)]">
          {congress.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex flex-col gap-1">
            <span
              className="flex items-center gap-1 font-secondary text-xs text-[var(--color-text-secondary)]"
              data-testid="congress-card-dates"
            >
              <CalendarDays size={12} strokeWidth={1.5} />
              {formatDate(congress.startDate)} &ndash; {formatDate(congress.endDate)}
            </span>
            {congress.location !== undefined && congress.location !== "" && (
              <span className="flex items-center gap-1 font-secondary text-xs text-[var(--color-text-secondary)]">
                <MapPin size={12} strokeWidth={1.5} />
                {congress.location}
              </span>
            )}
          </div>

          <Link
            href={`/congresses/${congress.id}`}
            className="flex shrink-0 items-center gap-1 font-secondary text-sm font-medium text-[var(--color-primary-text)] no-underline opacity-0 transition-all duration-200 group-hover:opacity-100"
            data-testid="congress-card-detail-link"
          >
            Ver detalle
            <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
