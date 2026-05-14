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
import { LoginRequestSchema, type LoginRequest } from "@/lib/validators/auth";
import { UserSchema } from "@/lib/validators/user";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });

  async function onSubmit(data: LoginRequest): Promise<void> {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body: unknown = await response.json();

      if (!response.ok) {
        const errorParsed = ProblemDetailSchema.safeParse(body);
        const code = errorParsed.success ? errorParsed.data.code : "system.internal_error";
        const message =
          ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ??
          ERROR_MESSAGES["system.internal_error"];
        toast.error(message);
        return;
      }

      const profileParsed = UserSchema.safeParse(body);
      if (!profileParsed.success) {
        toast.error(ERROR_MESSAGES["system.internal_error"]);
        return;
      }

      const { roles } = profileParsed.data;

      if (roles.includes("SYSTEM_ADMIN")) {
        router.push("/system-admin/users");
      } else if (roles.includes("CONGRESS_ADMIN")) {
        router.push("/congress-admin/congresses");
      } else {
        router.push("/participant/profile");
      }

      router.refresh();
    } catch {
      toast.error(ERROR_MESSAGES["system.internal_error"]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-[calc(100vh-60px-48px)] items-center justify-center px-4"
      data-testid="login-page"
    >
      <Card className="animate-scale-in w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="font-sans text-2xl font-medium text-[var(--color-text-primary-black)]">
            Iniciar sesion
          </CardTitle>
          <p className="font-secondary text-sm text-[var(--color-text-secondary)]">
            Ingresa tus credenciales para continuar
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                data-testid="login-email"
                {...register("email")}
              />
              {errors.email !== undefined && (
                <p
                  className="font-secondary text-xs text-[var(--color-error)]"
                  data-testid="login-email-error"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                data-testid="login-password"
                {...register("password")}
              />
              {errors.password !== undefined && (
                <p
                  className="font-secondary text-xs text-[var(--color-error)]"
                  data-testid="login-password-error"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 min-h-[44px] w-full transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
              data-testid="login-submit"
            >
              {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
            </Button>
          </form>

          <p className="mt-4 text-center font-secondary text-sm text-[var(--color-text-secondary)]">
            No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-[var(--color-primary-text)] no-underline hover:underline"
              data-testid="login-register-link"
            >
              Registrarse
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
