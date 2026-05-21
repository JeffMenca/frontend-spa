"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, BookOpen, Award, Wallet, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexPattern } from "@/components/ui/hex-pattern";
import { LoginRequestSchema, type LoginRequest } from "@/lib/validators/auth";
import { UserSchema } from "@/lib/validators/user";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";

const BENEFITS = [
  {
    icon: <BookOpen size={20} strokeWidth={1.5} className="text-white" />,
    title: "Congresos academicos",
    desc: "Explora y participa en los mejores congresos de tu region.",
  },
  {
    icon: <Award size={20} strokeWidth={1.5} className="text-white" />,
    title: "Diplomas en minutos",
    desc: "Descarga tu diploma en PDF al completar cada actividad.",
  },
  {
    icon: <Wallet size={20} strokeWidth={1.5} className="text-white" />,
    title: "Pagos seguros",
    desc: "Cartera integrada con historial de transacciones transparente.",
  },
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
      <div className="relative hidden w-[55%] flex-col overflow-hidden bg-[var(--color-primary)] md:flex">
        {/* Dense hex grid — the hero visual */}
        <HexPattern size={22} opacity={0.12} stroke="white" />

        {/* Depth overlays */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,rgba(255,255,255,0.07)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(0,30,90,0.45)_0%,transparent_60%)]" />

        {/* Main content */}
        <div className="relative flex flex-1 flex-col justify-center px-14 py-16">
          {/* Logo + wordmark */}
          <div className="mb-12 flex flex-col gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-white/25">
              <Bug size={30} strokeWidth={1.25} className="animate-float text-white" />
            </div>
            <div>
              <p className="font-sans text-2xl font-semibold tracking-tight text-white">
                Code n Bugs
              </p>
              <p className="mt-0.5 font-secondary text-sm text-white/55">
                Plataforma de congresos academicos
              </p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-14">
            <h1 className="font-sans text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-white">
              Gestiona tus
              <br />
              congresos
              <br />
              <span className="text-white/75">en un solo lugar.</span>
            </h1>
            <p className="mt-5 max-w-[300px] font-secondary text-[0.95rem] leading-relaxed text-white/65">
              Inscribete, participa y recibe tu diploma. Sin complicaciones.
            </p>
          </div>

          {/* Benefit rows */}
          <div className="flex flex-col gap-7">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  {b.icon}
                </div>
                <div className="pt-0.5">
                  <p className="font-sans text-sm font-semibold text-white">{b.title}</p>
                  <p className="mt-1 font-secondary text-[0.8rem] leading-snug text-white/60">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="relative border-t border-white/10 px-14 py-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} strokeWidth={1.5} className="text-white/50" />
            <span className="font-secondary text-xs text-white/50">
              Conexion cifrada y datos protegidos
            </span>
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
        <div className="flex flex-1 items-center justify-center px-10 py-12">
          <div className="animate-scale-in w-full max-w-[380px]">
            {/* Heading */}
            <div className="mb-9">
              <h2 className="font-sans text-[1.75rem] font-medium leading-tight text-[var(--color-text-primary-black)]">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 font-secondary text-sm text-[var(--color-text-secondary)]">
                Ingresa tus datos para acceder a tu cuenta
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
                <Label
                  htmlFor="email"
                  className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                >
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
                <Label
                  htmlFor="password"
                  className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                >
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
                className="mt-2 min-h-[44px] w-full transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
                data-testid="login-submit"
              >
                {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-3">
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
          <ShieldCheck
            size={13}
            strokeWidth={1.5}
            className="text-[var(--color-text-secondary)]"
            aria-hidden="true"
          />
          <span className="font-secondary text-xs text-[var(--color-text-secondary)]">
            Conexion segura · Code n Bugs
          </span>
        </div>
      </div>
    </div>
  );
}
