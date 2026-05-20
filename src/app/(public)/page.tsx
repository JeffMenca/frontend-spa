import Link from "next/link";
import { ArrowRight, BookOpen, Award, Bug, Hexagon, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    icon: <Zap size={22} strokeWidth={1.5} className="text-[var(--color-accent-amber-text)]" />,
    title: "Actividades en tiempo real",
    description: "Inscribete a talleres y ponencias con disponibilidad en tiempo real.",
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
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-16 pt-20 text-center">
        {/* Decorative hexagon watermarks */}
        <span className="pointer-events-none absolute -right-16 -top-10 text-[var(--color-primary)] opacity-[0.04]">
          <Hexagon size={280} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute -left-20 bottom-0 text-[var(--color-primary)] opacity-[0.03]">
          <Hexagon size={320} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute right-1/4 top-4 text-[var(--color-primary)] opacity-[0.04]">
          <Hexagon size={120} strokeWidth={0.5} />
        </span>

        {/* Logo mark */}
        <div className="animate-fade-in mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-[var(--shadow-top)]">
          <Bug size={32} strokeWidth={1.5} className="text-white" />
        </div>

        {/* Pill badge */}
        <span className="animate-fade-in delay-75 mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pale-blue)] px-3 py-1 font-secondary text-xs font-medium text-[var(--color-primary-text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
          Plataforma de gestion academica
        </span>

        <h1 className="animate-fade-in-up delay-150 mb-4 max-w-2xl font-sans text-5xl font-medium leading-tight text-[var(--color-text-primary-black)]">
          Bienvenido a{" "}
          <span className="text-[var(--color-primary-text)]">
            Code <em className="not-italic font-medium text-[var(--color-primary-text)]">n</em> Bugs
          </span>
        </h1>

        <p className="animate-fade-in-up delay-225 mb-8 max-w-lg font-secondary text-base leading-relaxed text-[var(--color-text-secondary)]">
          Plataforma multi-tenant para la gestion de congresos academicos. Encuentra congresos,
          registra tu asistencia y gestiona tus diplomas.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            className="group min-h-[44px] gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
            className="min-h-[44px] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-text)]"
            data-testid="landing-register"
          >
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </section>

      {/* Section divider */}
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="border-t border-[var(--color-border)]" />
      </div>

      {/* Features section */}
      <section className="px-6 py-14">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h2 className="animate-fade-in font-sans text-xl font-medium text-[var(--color-text-primary-black)]">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="animate-fade-in delay-75 mt-2 font-secondary text-sm text-[var(--color-text-secondary)]">
            Diseñado para participantes, organizadores e instituciones academicas.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={`group animate-fade-in-up flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] ${feature.accent}`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg}`}
              >
                {feature.icon}
              </div>
              <div className="flex flex-col gap-1.5">
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

      {/* CTA strip */}
      <section className="relative mx-6 mb-14 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-primary)] px-8 py-10">
        <span className="pointer-events-none absolute -right-8 -top-8 text-white opacity-[0.06]">
          <Hexagon size={180} strokeWidth={0.5} />
        </span>
        <span className="pointer-events-none absolute -bottom-10 left-12 text-white opacity-[0.05]">
          <Hexagon size={140} strokeWidth={0.5} />
        </span>
        <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-sans text-lg font-medium text-white">¿Listo para comenzar?</h2>
            <p className="font-secondary text-sm text-white/80">
              Crea tu cuenta y accede a los congresos academicos mas relevantes.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 min-h-[44px] gap-2 border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:border-white/60 transition-all duration-200"
          >
            <Link href="/register">
              Registrarse ahora
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
