import Link from "next/link";
import { ArrowRight, BookOpen, Award, Bug, Hexagon, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HexPattern } from "@/components/ui/hex-pattern";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: <BookOpen size={22} strokeWidth={1.5} className="text-[var(--color-primary-text)]" />,
    title: "Explora congresos",
    description: "Descubre congresos academicos de instituciones en toda la region.",
    accent: "group-hover:border-[var(--color-primary)]",
    iconBg: "bg-[var(--color-pale-blue)]",
  },
  {
    icon: (
      <CheckCircle size={22} strokeWidth={1.5} className="text-[var(--color-accent-amber-text)]" />
    ),
    title: "Inscripcion sencilla",
    description: "Registrate en talleres y ponencias en pocos pasos, sin papeleo.",
    accent: "group-hover:border-[var(--color-accent-amber-text)]",
    iconBg: "bg-[var(--color-accent-amber-bg)]",
  },
  {
    icon: <Award size={22} strokeWidth={1.5} className="text-[var(--color-accent-green-text)]" />,
    title: "Obtiene diplomas",
    description: "Recibe diplomas de participacion y ponencia al completar actividades.",
    accent: "group-hover:border-[var(--color-accent-green-text)]",
    iconBg: "bg-[var(--color-accent-green-bg)]",
  },
  {
    icon: <Shield size={22} strokeWidth={1.5} className="text-[var(--color-accent-violet-text)]" />,
    title: "Pagos seguros",
    description: "Cartera integrada con historial de transacciones y comisiones transparentes.",
    accent: "group-hover:border-[var(--color-accent-violet-text)]",
    iconBg: "bg-[var(--color-accent-violet-bg)]",
  },
];

export default function LandingPage(): React.ReactElement {
  return (
    <div className="flex flex-col" data-testid="landing-page">
      {/* Hero section */}
      <section className="relative flex flex-col items-center overflow-hidden bg-[var(--color-surface)] px-6 pb-20 pt-28 text-center">
        {/* Hex grid background — subtle on light surface */}
        <HexPattern size={32} opacity={0.045} stroke="var(--color-primary)" />

        {/* Radial gradient: pale blue bloom at top center */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,var(--color-pale-blue)/50,transparent_70%)]" />

        {/* Decorative large hexagon accents */}
        <span className="pointer-events-none absolute -right-20 top-0 text-[var(--color-primary)] opacity-[0.04]">
          <Hexagon size={340} strokeWidth={0.4} />
        </span>
        <span className="pointer-events-none absolute -left-24 bottom-0 text-[var(--color-primary)] opacity-[0.03]">
          <Hexagon size={380} strokeWidth={0.4} />
        </span>

        {/* Logo mark */}
        <div className="animate-fade-in relative mb-7 flex h-18 w-18 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-[var(--shadow-top)]">
          <Bug size={34} strokeWidth={1.5} className="text-white" />
        </div>

        {/* Pill badge */}
        <span className="animate-fade-in delay-75 mb-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-blue)] px-4 py-1.5 font-secondary text-xs font-medium text-[var(--color-primary-text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
          Plataforma de gestion academica
        </span>

        <h1 className="animate-fade-in-up delay-150 mb-5 max-w-2xl font-sans text-5xl font-medium leading-[1.1] text-[var(--color-text-primary-black)]">
          Bienvenido a{" "}
          <span className="text-[var(--color-primary-text)]">
            Code <em className="not-italic font-medium text-[var(--color-primary-text)]">n</em> Bugs
          </span>
        </h1>

        <p className="animate-fade-in-up delay-225 mb-10 max-w-xl font-secondary text-base leading-relaxed text-[var(--color-text-secondary)]">
          Encuentra congresos academicos, inscribete a talleres y ponencias, y recibe tus diplomas.
          Todo desde un solo lugar.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            className="group min-h-[46px] gap-2 px-6 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            data-testid="landing-browse-congresses"
          >
            <Link href="/congresses">
              Ver congresos
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="min-h-[46px] px-6 transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-text)]"
            data-testid="landing-register"
          >
            <Link href="/register">Registrarse gratis</Link>
          </Button>
        </div>
      </section>

      {/* Section divider */}
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="border-t border-[var(--color-border)]" />
      </div>

      {/* Features section */}
      <section className="px-6 py-16">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <h2 className="animate-fade-in font-sans text-2xl font-medium text-[var(--color-text-primary-black)]">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="animate-fade-in delay-75 mt-2 font-secondary text-sm text-[var(--color-text-secondary)]">
            Disenado para participantes, organizadores e instituciones academicas.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={`group animate-fade-in-up flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-6 pb-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] ${feature.accent}`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}
              >
                {feature.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-sm font-medium text-[var(--color-text-primary-black)]">
                  {feature.title}
                </h3>
                <p className="font-secondary text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative overflow-hidden bg-[var(--color-primary)] px-8 py-20">
        {/* Dense hex grid */}
        <HexPattern size={26} opacity={0.09} stroke="white" />

        {/* Corner depth overlays */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,30,90,0.5)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_55%)]" />

        <div className="relative mx-auto max-w-4xl">
          {/* Stats row */}
          <div className="mb-14 grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col gap-1">
              <span className="font-sans text-3xl font-semibold text-white">PDF</span>
              <span className="font-secondary text-sm text-white/65">Diplomas instantaneos</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-sans text-3xl font-semibold text-white">100%</span>
              <span className="font-secondary text-sm text-white/65">En linea</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-sans text-3xl font-semibold text-white">Gratis</span>
              <span className="font-secondary text-sm text-white/65">Registro de participante</span>
            </div>
          </div>

          {/* CTA content */}
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="font-sans text-3xl font-semibold leading-tight text-white">
              Comienza tu experiencia
              <br />
              academica hoy
            </h2>
            <p className="max-w-md font-secondary text-base text-white/70">
              Crea tu cuenta gratis y accede a los congresos, talleres y ponencias mas relevantes de
              tu area.
            </p>
            <Button
              asChild
              variant="outline"
              className="group mt-2 min-h-[48px] gap-2 border-white/40 bg-white/15 px-8 text-white backdrop-blur-sm transition-all duration-200 hover:border-white/70 hover:bg-white/25"
            >
              <Link href="/register">
                Registrarse ahora
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
