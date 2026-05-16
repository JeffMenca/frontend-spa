"use client";

import { useState, useCallback } from "react";
import { Users, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  CommitteeMemberListSchema,
  AddCommitteeMemberSchema,
  type CommitteeMemberData,
  type AddCommitteeMemberData,
} from "@/lib/validators/committee";
import { type CongressData } from "@/lib/validators/congress";
import { formatDate } from "@/lib/utils/format";
import { useToast } from "@/hooks/useToast";

interface CommitteePageClientProps {
  congresses: CongressData[];
}

export function CommitteePageClient({
  congresses,
}: CommitteePageClientProps): React.ReactElement {
  const toast = useToast();

  const [selectedCongressId, setSelectedCongressId] = useState<string>("");
  const [members, setMembers] = useState<CommitteeMemberData[]>([]);
  const [loading, setLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<CommitteeMemberData | null>(null);
  const [mutating, setMutating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCommitteeMemberData>({
    resolver: zodResolver(AddCommitteeMemberSchema),
  });

  const fetchMembers = useCallback(
    async (congressId: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/congresses/${congressId}/committee`);
        if (!res.ok) {
          toast.error("Error al cargar los miembros del comite.");
          return;
        }
        const raw: unknown = await res.json();
        const parsed = CommitteeMemberListSchema.safeParse(raw);
        if (!parsed.success) {
          toast.error("Error al procesar los datos del comite.");
          return;
        }
        setMembers(parsed.data.items);
      } catch {
        toast.error("Error de conexion al cargar los miembros.");
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const handleCongressChange = async (congressId: string) => {
    setSelectedCongressId(congressId);
    setMembers([]);
    if (congressId !== "") {
      await fetchMembers(congressId);
    }
  };

  const onAddMember = async (data: AddCommitteeMemberData) => {
    if (selectedCongressId === "") return;
    setMutating(true);
    try {
      const res = await fetch(`/api/congresses/${selectedCongressId}/committee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body: unknown = await res.json();
        const msg =
          typeof body === "object" &&
          body !== null &&
          "title" in body &&
          typeof (body as Record<string, unknown>)["title"] === "string"
            ? String((body as Record<string, unknown>)["title"])
            : "Error al agregar el miembro.";
        toast.error(msg);
        return;
      }
      toast.success("Miembro agregado al comite.");
      reset();
      setAddDialogOpen(false);
      await fetchMembers(selectedCongressId);
    } catch {
      toast.error("Error de conexion al agregar el miembro.");
    } finally {
      setMutating(false);
    }
  };

  const handleRemoveMember = async () => {
    if (selectedCongressId === "" || memberToRemove === null) return;
    setMutating(true);
    try {
      const res = await fetch(
        `/api/congresses/${selectedCongressId}/committee/${memberToRemove.userId}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        toast.error("Error al quitar el miembro del comite.");
        return;
      }
      toast.success("Miembro eliminado del comite.");
      setRemoveDialogOpen(false);
      setMemberToRemove(null);
      await fetchMembers(selectedCongressId);
    } catch {
      toast.error("Error de conexion al quitar el miembro.");
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="congress-select-committee"
          className="font-sans text-sm font-medium text-[var(--color-text-primary)]"
        >
          Selecciona un congreso
        </label>
        <select
          id="congress-select-committee"
          value={selectedCongressId}
          onChange={(e) => void handleCongressChange(e.target.value)}
          className="h-11 w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-3 font-secondary text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
        >
          <option value="">-- Selecciona un congreso --</option>
          {congresses.map((congress) => (
            <option key={congress.id} value={congress.id}>
              {congress.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCongressId !== "" && (
        <div className="flex items-center justify-between">
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            {loading ? "Cargando miembros..." : `${members.length} miembro(s)`}
          </p>
          <Button
            onClick={() => { setAddDialogOpen(true); }}
            disabled={loading}
            className="min-h-[44px] bg-[var(--color-primary)] text-white hover:scale-[1.01] active:scale-[0.99]"
            data-testid="add-member-button"
          >
            <Plus size={16} strokeWidth={1.5} />
            Agregar miembro
          </Button>
        </div>
      )}

      {selectedCongressId !== "" && !loading && (
        <>
          {members.length === 0 ? (
            <EmptyState
              icon={<Users size={24} strokeWidth={1.5} />}
              title="Sin miembros"
              description="Este congreso no tiene miembros de comite registrados."
              action={
                <Button
                  onClick={() => { setAddDialogOpen(true); }}
                  className="min-h-[44px] bg-[var(--color-primary)] text-white hover:scale-[1.01] active:scale-[0.99]"
                  data-testid="add-member-button"
                >
                  <Plus size={16} strokeWidth={1.5} />
                  Agregar miembro
                </Button>
              }
            />
          ) : (
            <div
              className="flex flex-col gap-3 animate-fade-in-up"
              data-testid="committee-list"
            >
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-white)] px-4 py-4"
                  data-testid="committee-member-row"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="font-sans text-sm font-medium text-[var(--color-text-primary-black)]">
                      {member.fullName}
                    </p>
                    <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
                      {member.email}
                    </p>
                    <p className="font-secondary text-xs text-[var(--color-text-secondary)]">
                      Agregado: {formatDate(member.addedAt)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMemberToRemove(member);
                      setRemoveDialogOpen(true);
                    }}
                    className="min-h-[44px] border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    data-testid="remove-member-button"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    Quitar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedCongressId === "" && (
        <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 text-center">
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            Selecciona un congreso para ver su comite.
          </p>
        </div>
      )}

      {/* Dialog: Agregar miembro */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar miembro al comite</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => void handleSubmit(onAddMember)(e)} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userId-input">ID del usuario (UUID)</Label>
              <Input
                id="userId-input"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                {...register("userId")}
                className="h-11"
              />
              {errors.userId !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]">
                  {errors.userId.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[44px]"
                  onClick={() => { reset(); }}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={mutating}
                className="min-h-[44px] bg-[var(--color-primary)] text-white"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmacion de eliminar */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quitar miembro del comite</DialogTitle>
          </DialogHeader>
          <p className="font-secondary text-sm text-[var(--color-text-primary)]">
            {memberToRemove !== null
              ? `Vas a quitar a ${memberToRemove.fullName} del comite. Esta accion no se puede deshacer.`
              : "Confirma la eliminacion del miembro."}
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="min-h-[44px]"
                onClick={() => { setMemberToRemove(null); }}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={() => void handleRemoveMember()}
              disabled={mutating}
              className="min-h-[44px] bg-red-600 text-white hover:bg-red-700"
              data-testid="remove-member-confirm"
            >
              Quitar miembro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
