"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterRequestSchema, type RegisterRequest } from "@/lib/validators/auth";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
  });

  async function onSubmit(data: RegisterRequest): Promise<void> {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => ({}));
        const errorBody = body as { code?: string };
        const code = errorBody.code ?? "system.internal_error";
        const message =
          ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ??
          ERROR_MESSAGES["system.internal_error"];
        toast.error(message);
        return;
      }

      toast.success("Cuenta creada exitosamente. Inicia sesion para continuar.");
      router.push("/login");
    } catch {
      toast.error(ERROR_MESSAGES["system.internal_error"]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex items-start justify-center px-4 py-10"
      data-testid="register-page"
    >
      <Card className="animate-scale-in w-full max-w-[480px]">
        <CardHeader>
          <CardTitle className="font-sans text-2xl font-medium text-[var(--color-text-primary-black)]">
            Crear cuenta
          </CardTitle>
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            Completa los datos para registrarte como participante
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                disabled={isLoading}
                data-testid="register-full-name"
                {...register("fullName")}
              />
              {errors.fullName !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]" role="alert" data-testid="register-full-name-error">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                data-testid="register-email"
                {...register("email")}
              />
              {errors.email !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]" role="alert" data-testid="register-email-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                data-testid="register-password"
                {...register("password")}
              />
              {errors.password !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]" role="alert" data-testid="register-password-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="organization">Organizacion</Label>
              <Input
                id="organization"
                type="text"
                disabled={isLoading}
                data-testid="register-organization"
                {...register("organization")}
              />
              {errors.organization !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]" role="alert" data-testid="register-organization-error">
                  {errors.organization.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                disabled={isLoading}
                data-testid="register-phone"
                {...register("phone")}
              />
              {errors.phone !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]" role="alert" data-testid="register-phone-error">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="personalId">DPI o identificacion</Label>
              <Input
                id="personalId"
                type="text"
                disabled={isLoading}
                data-testid="register-personal-id"
                {...register("personalId")}
              />
              {errors.personalId !== undefined && (
                <p className="font-secondary text-xs text-[var(--color-error)]" role="alert" data-testid="register-personal-id-error">
                  {errors.personalId.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 min-h-[44px] w-full transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
              data-testid="register-submit"
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-4 text-center font-secondary text-sm text-[var(--color-text-secondary)]">
            Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--color-primary-text)] no-underline hover:underline"
              data-testid="register-login-link"
            >
              Iniciar sesion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
