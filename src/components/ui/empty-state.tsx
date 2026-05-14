import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      className={cn(
        "animate-fade-in flex flex-col items-center justify-center gap-4 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 text-center",
        className,
      )}
      data-testid="empty-state"
    >
      {icon !== undefined && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-pale-blue)] text-[var(--color-primary-text)]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <p className="font-sans text-sm font-medium text-[var(--color-text-primary-black)]">
          {title}
        </p>
        {description !== undefined && (
          <p className="font-secondary text-xs text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {action !== undefined && <div className="mt-1">{action}</div>}
    </div>
  );
}
