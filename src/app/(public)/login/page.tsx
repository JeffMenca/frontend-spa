"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, Hexagon, Zap, Users, Award, ShieldCheck, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginRequestSchema, type LoginRequest } from "@/lib/validators/auth";
import { UserSchema } from "@/lib/validators/user";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";

const FEATURES = [
  { icon: <Users size={15} strokeWidth={2} />, label: "Gestion de participantes" },
  { icon: <Zap size={15} strokeWidth={2} />, label: "Actividades en tiempo real" },
  { icon: <Award size={15} strokeWidth={2} />, label: "Diplomas automaticos" },
  { icon: <BookOpen size={15} strokeWidth={2} />, label: "Propuestas y convocatorias" },
];

const STATS = [
  { value: "Multi-tenant", label: "Arquitectura" },
  { value: "4 roles", label: "De acceso" },
  { value: "PDF", label: "Diplomas" },
];

export default function LoginPage(): React.ReactElement {
  const toast = useToast();
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
          ERROR_MESSAGES["system.internal_error"] ??
          "Ocurrio un error inesperado.";
        toast.error(message);
        return;
      }

      const profileParsed = UserSchema.safeParse(body);
      if (!profileParsed.success) {
        toast.error(ERROR_MESSAGES["system.internal_error"] ?? "Ocurrio un error inesperado.");
        return;
      }

      const { roles } = profileParsed.data;

      // Hard redirect after login to bypass stale RSC cache.
      if (roles.includes("SYSTEM_ADMIN")) {
        window.location.href = "/system-admin/users";
      } else if (roles.includes("CONGRESS_ADMIN")) {
        window.location.href = "/congress-admin/congresses";
      } else {
        window.location.href = "/participant/profile";
      }
    } catch {
      toast.error(ERROR_MESSAGES["system.internal_error"] ?? "Ocurrio un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)]" data-testid="login-page">

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

        {/* Center: hero content */}
        <div className="relative flex flex-1 flex-col justify-center gap-10 px-10 py-12">
          {/* Logo + title */}
          <div className="flex flex-col gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm ring-1 ring-white/20">
              <Bug size={40} strokeWidth={1.25} className="animate-float text-white" />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-sans text-5xl font-semibold leading-[1.1] tracking-tight text-white">
                Plataforma<br />para congresos<br />academicos
              </h1>
              <p className="font-secondary text-sm leading-relaxed text-white/70 max-w-[280px]">
                Gestiona inscripciones, propuestas, asistencias y diplomas desde un solo lugar.
              </p>
            </div>
          </div>

          {/* Feature chips — 2×2 grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.label}
                className="animate-fade-in-up flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm ring-1 ring-white/10"
                style={{ animationDelay: `${(i + 1) * 80}ms` }}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                  {feature.icon}
                </span>
                <span className="font-secondary text-xs leading-snug text-white/90">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: stats strip */}
        <div className="relative border-t border-white/10 px-10 py-6">
          <div className="flex items-center justify-around">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <span className="font-sans text-base font-medium text-white">{stat.value}</span>
                <span className="font-secondary text-xs text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>
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

        {/* Form area — vertically centered */}
        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="animate-scale-in w-full max-w-[360px]">

            {/* Heading */}
            <div className="mb-8">
              <h2 className="font-sans text-2xl font-medium text-[var(--color-text-primary-black)]">
                Bienvenido de nuevo
              </h2>
              <p className="mt-1.5 font-secondary text-sm text-[var(--color-text-secondary)]">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
              }}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                  Correo electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
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
                <Label htmlFor="password" className="font-secondary text-sm font-medium text-[var(--color-text-primary)]">
                  Contrasena
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
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
                className="mt-1 min-h-[44px] w-full transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
                data-testid="login-submit"
              >
                {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 border-t border-[var(--color-border)]" />
              <span className="font-secondary text-xs text-[var(--color-text-secondary)]">o</span>
              <div className="flex-1 border-t border-[var(--color-border)]" />
            </div>

            {/* Register link */}
            <p className="text-center font-secondary text-sm text-[var(--color-text-secondary)]">
              No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-[var(--color-primary-text)] no-underline hover:underline"
                data-testid="login-register-link"
              >
                Crear cuenta gratis
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
