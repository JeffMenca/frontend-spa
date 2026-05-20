"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, Hexagon, CheckCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterRequestSchema, type RegisterRequest } from "@/lib/validators/auth";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";

const BENEFITS = [
  "Inscribete a congresos academicos con un clic",
  "Reserva talleres y gestiona tu asistencia",
  "Recibe diplomas de participacion en PDF",
  "Cartera integrada para pagos sin friccion",
];

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const toast = useToast();
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
        const parsedError = ProblemDetailSchema.safeParse(body);
        const code = parsedError.success ? parsedError.data.code : "system.internal_error";
        const message =
          ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ??
          ERROR_MESSAGES["system.internal_error"] ??
          "Ocurrio un error inesperado.";
        toast.error(message);
        return;
      }

      toast.success("Cuenta creada exitosamente. Inicia sesion para continuar.");
      router.push("/login");
    } catch {
      toast.error(ERROR_MESSAGES["system.internal_error"] ?? "Ocurrio un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)]" data-testid="register-page">

      {/* ── Left: brand panel ─────────────────────────────────────────── */}
      <div className="relative hidden w-[46%] flex-col overflow-hidden bg-[var(--color-primary)] md:flex">

        {/* Hexagon watermarks */}
        <span className="pointer-events-none absolute -right-10 -top-10 text-white opacity-[0.08]">
          <Hexagon size={240} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute -bottom-14 -left-14 text-white opacity-[0.06]">
          <Hexagon size={300} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute right-20 top-1/3 text-white opacity-[0.05]">
          <Hexagon size={140} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute left-6 top-16 text-white opacity-[0.06]">
          <Hexagon size={72} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute bottom-32 right-8 text-white opacity-[0.04]">
          <Hexagon size={96} strokeWidth={0.5} />
        </span>

        {/* Hero content */}
        <div className="relative flex flex-1 flex-col justify-center gap-10 px-10 py-12">
          {/* Logo + title */}
          <div className="flex flex-col gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm ring-1 ring-white/20">
              <Bug size={40} strokeWidth={1.25} className="animate-float text-white" />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-sans text-5xl font-semibold leading-[1.1] tracking-tight text-white">
                Unete a la<br />comunidad<br />academica
              </h1>
              <p className="max-w-[280px] font-secondary text-sm leading-relaxed text-white/70">
                Crea tu cuenta gratis y accede a todos los congresos y actividades disponibles.
              </p>
            </div>
          </div>

          {/* Benefits list */}
          <div className="flex flex-col gap-2.5">
            {BENEFITS.map((benefit, i) => (
              <div
                key={benefit}
                className="animate-fade-in-up flex items-center gap-3"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                  <CheckCircle size={12} strokeWidth={2} />
                </span>
                <span className="font-secondary text-sm text-white/85">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="relative border-t border-white/10 px-10 py-5">
          <p className="font-secondary text-xs text-white/50">
            Al registrarte aceptas los terminos de uso de la plataforma Code n Bugs.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col bg-[var(--color-white)]">

        {/* Mobile-only top bar */}
        <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-6 py-4 md:hidden">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
            <Bug size={14} strokeWidth={2} />
          </span>
          <span className="font-sans text-sm font-medium text-[var(--color-text-primary)]">
            Code n Bugs
          </span>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-8 py-10">
          <div className="animate-scale-in w-full max-w-[400px]">

            {/* Heading */}
            <div className="mb-7">
              <h2 className="font-sans text-2xl font-medium text-[var(--color-text-primary-black)]">
                Crear cuenta
              </h2>
              <p className="mt-1.5 font-secondary text-sm text-[var(--color-text-secondary)]">
                Completa los datos para registrarte como participante
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                  Nombre completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Juan Perez"
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

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                  Correo electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                  Contrasena
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
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

              {/* Organization + Phone — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="organization" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                    Organizacion
                  </Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="USAC"
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

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                    Telefono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="5555-5555"
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
              </div>

              {/* Personal ID */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="personalId" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                  DPI o identificacion
                </Label>
                <Input
                  id="personalId"
                  type="text"
                  placeholder="Numero de documento"
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
                className="mt-1 min-h-[44px] w-full transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
                data-testid="register-submit"
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            {/* Login link */}
            <p className="mt-5 text-center font-secondary text-sm text-[var(--color-text-secondary)]">
              Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-[var(--color-primary-text)] no-underline hover:underline"
                data-testid="register-login-link"
              >
                Iniciar sesion
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 border-t border-[var(--color-border)] px-6 py-4">
          <ShieldCheck size={13} strokeWidth={1.5} className="text-[var(--color-text-secondary)]" aria-hidden="true" />
          <span className="font-secondary text-xs text-[var(--color-text-secondary)]">
            Conexion segura · Code n Bugs
          </span>
        </div>
      </div>
    </div>
  );
}
