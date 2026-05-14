import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps): React.ReactElement {
  return (
    <div
      className={cn(
        "animate-fade-in-down mb-6 flex flex-wrap items-start justify-between gap-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-sans text-2xl font-medium text-[var(--color-text-primary-black)]">
          {title}
        </h1>
        {description !== undefined && (
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {action !== undefined && <div className="shrink-0">{action}</div>}
    </div>
  );
}
