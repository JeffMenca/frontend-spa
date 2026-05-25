"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export function ReserveActivityButton(): React.ReactElement {
  const toast = useToast();

  function handleClick(): void {
    toast.info("Esta funcionalidad estara disponible pronto.");
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="min-h-[44px] border-[var(--color-primary)] text-[var(--color-primary-text)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
      data-testid="reserve-activity-button"
      aria-label="Reservar lugar en taller"
    >
      <Bookmark size={15} strokeWidth={1.5} aria-hidden="true" />
      <span className="ml-1.5">Reservar</span>
    </Button>
  );
}
