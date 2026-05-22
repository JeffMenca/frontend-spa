"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, BookOpen, Award, Wallet, ShieldCheck } from "lucide-react";
import { HexPattern } from "@/components/ui/hex-pattern";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterRequestSchema, type RegisterRequest } from "@/lib/validators/auth";
import { ProblemDetailSchema } from "@/lib/validators/error";
import { ERROR_MESSAGES } from "@/lib/utils/error-messages";

const FEATURES = [
  {
    icon: <BookOpen size={15} strokeWidth={1.5} className="text-white" />,
    title: "Congresos",
    desc: "Explora y participa",
  },
  {
    icon: <Award size={15} strokeWidth={1.5} className="text-white" />,
    title: "Diplomas PDF",
    desc: "Instantaneos al completar",
  },
  {
    icon: <Wallet size={15} strokeWidth={1.5} className="text-white" />,
    title: "Pagos seguros",
    desc: "Cartera integrada",
  },
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
      <div className="relative hidden w-[55%] flex-col overflow-hidden bg-[var(--color-primary)] md:flex">
        {/* Layer 1: subtle hex texture */}
        <HexPattern size={22} opacity={0.08} stroke="white" />

        {/* Layer 2: giant Bug mascot — background art, bottom-right anchor */}
        <span className="pointer-events-none absolute -bottom-10 -right-16 text-white opacity-[0.065]">
          <Bug size={400} strokeWidth={0.4} />
        </span>

        {/* Layer 3: directional gradient for depth and text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(5,38,128,0.55)_0%,rgba(5,38,128,0.1)_50%,transparent_100%)]" />

        {/* Content — spread top / middle / bottom */}
        <div className="relative flex flex-1 flex-col justify-between px-12 py-10">
          {/* TOP: compact logo strip */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/25">
              <Bug size={18} strokeWidth={1.5} className="animate-float text-white" />
            </div>
            <span className="font-sans text-base font-semibold tracking-tight text-white">
              Congress n Bugs
            </span>
          </div>

          {/* MIDDLE: editorial display headline */}
          <div>
            <h1 className="font-sans text-[3.75rem] font-semibold leading-[0.95] tracking-tight text-white">
              Unete a la
              <br />
              comunidad
              <br />
              <span className="text-white/55">academica.</span>
            </h1>
            <p className="mt-5 max-w-[300px] font-secondary text-sm leading-relaxed text-white/60">
              Crea tu cuenta gratis y accede a todos los congresos disponibles.
            </p>
          </div>

          {/* BOTTOM: compact 3-column features strip */}
          <div>
            <div className="mb-5 h-px bg-white/15" />
            <div className="grid grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex flex-col gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                    {f.icon}
                  </div>
                  <p className="font-sans text-xs font-semibold text-white">{f.title}</p>
                  <p className="font-secondary text-[0.7rem] leading-snug text-white/50">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
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
            Congress n Bugs
          </span>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-10 py-10">
          <div className="animate-scale-in w-full max-w-[420px]">
            {/* Heading */}
            <div className="mb-7">
              <h2 className="font-sans text-[1.75rem] font-medium leading-tight text-[var(--color-text-primary-black)]">
                Crear cuenta
              </h2>
              <p className="mt-2 font-secondary text-sm text-[var(--color-text-secondary)]">
                Completa los datos para registrarte como participante
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
              }}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="fullName"
                  className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                >
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
                  <p
                    className="font-secondary text-xs text-[var(--color-error)]"
                    role="alert"
                    data-testid="register-full-name-error"
                  >
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
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
                  data-testid="register-email"
                  {...register("email")}
                />
                {errors.email !== undefined && (
                  <p
                    className="font-secondary text-xs text-[var(--color-error)]"
                    role="alert"
                    data-testid="register-email-error"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="password"
                  className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                >
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
                  <p
                    className="font-secondary text-xs text-[var(--color-error)]"
                    role="alert"
                    data-testid="register-password-error"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Organization + Phone — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="organization"
                    className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                  >
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
                    <p
                      className="font-secondary text-xs text-[var(--color-error)]"
                      role="alert"
                      data-testid="register-organization-error"
                    >
                      {errors.organization.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="phone"
                    className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                  >
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
                    <p
                      className="font-secondary text-xs text-[var(--color-error)]"
                      role="alert"
                      data-testid="register-phone-error"
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Personal ID */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="personalId"
                  className="font-secondary text-sm font-medium text-[var(--color-text-primary)]"
                >
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
                  <p
                    className="font-secondary text-xs text-[var(--color-error)]"
                    role="alert"
                    data-testid="register-personal-id-error"
                  >
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
          <ShieldCheck
            size={13}
            strokeWidth={1.5}
            className="text-[var(--color-text-secondary)]"
            aria-hidden="true"
          />
          <span className="font-secondary text-xs text-[var(--color-text-secondary)]">
            Conexion segura · Congress n Bugs
          </span>
        </div>
      </div>
    </div>
  );
}
