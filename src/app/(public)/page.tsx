import Link from "next/link";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: <BookOpen size={24} strokeWidth={1.5} className="text-[var(--color-primary-text)]" />,
    title: "Explora congresos",
    description: "Descubre congresos academicos de instituciones en toda la region.",
  },
  {
    icon: <Users size={24} strokeWidth={1.5} className="text-[var(--color-primary-text)]" />,
    title: "Registra tu asistencia",
    description: "Inscribete a congresos y talleres con un solo clic desde tu cartera.",
  },
  {
    icon: <Award size={24} strokeWidth={1.5} className="text-[var(--color-primary-text)]" />,
    title: "Obtiene diplomas",
    description: "Recibe diplomas de participacion y ponencia al completar actividades.",
  },
];

export default function LandingPage(): React.ReactElement {
  return (
    <div className="flex flex-col" data-testid="landing-page">
      {/* Hero section */}
      <section className="flex flex-col items-center px-6 pb-16 pt-18 text-center">
        {/* Pill badge */}
        <span className="animate-fade-in mb-6 inline-flex items-center rounded-full bg-[var(--color-pale-blue)] px-3 py-1 font-secondary text-xs font-medium text-[var(--color-primary-text)]">
          Plataforma de gestion academica
        </span>

        <h1 className="animate-fade-in-up delay-75 mb-4 max-w-xl font-sans text-4xl font-medium leading-tight text-[var(--color-text-primary-black)]">
          Bienvenido a{" "}
          <span className="text-[var(--color-primary-text)]">Code n Bugs</span>
        </h1>

        <p className="animate-fade-in-up delay-150 mb-8 max-w-lg font-secondary text-base leading-relaxed text-[var(--color-text-secondary)]">
          Plataforma multi-tenant para la gestion de congresos academicos. Encuentra
          congresos, registra tu asistencia y gestiona tus diplomas.
        </p>

        <div className="animate-fade-in-up delay-225 flex flex-wrap items-center justify-center gap-4">
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

      {/* Divider */}
      <div className="mx-auto w-full max-w-3xl border-t border-[var(--color-border)]" />

      {/* Features section */}
      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in-up flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-elevated)]"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-pale-blue)]">
                {feature.icon}
              </div>
              <h2 className="font-sans text-sm font-medium text-[var(--color-text-primary-black)]">
                {feature.title}
              </h2>
              <p className="font-secondary text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
