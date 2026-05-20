import Link from "next/link";
import { Bug } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import type { Role, Session } from "@/types/auth";

interface NavLink {
  href: string;
  label: string;
}

function getNavLinks(session: Session | null): NavLink[] {
  if (session === null) {
    return [
      { href: "/congresses", label: "Congresos" },
      { href: "/login", label: "Iniciar sesion" },
      { href: "/register", label: "Registrarse" },
    ];
  }

  const roles: Role[] = session.roles;

  if (roles.includes("SYSTEM_ADMIN")) {
    return [
      { href: "/system-admin", label: "Inicio" },
      { href: "/system-admin/users", label: "Usuarios" },
      { href: "/system-admin/institutions", label: "Instituciones" },
      { href: "/system-admin/config", label: "Configuracion" },
      { href: "/system-admin/reports", label: "Reportes" },
    ];
  }

  if (roles.includes("CONGRESS_ADMIN")) {
    return [
      { href: "/congress-admin", label: "Inicio" },
      { href: "/congress-admin/congresses", label: "Mis congresos" },
      { href: "/congress-admin/reports", label: "Reportes" },
    ];
  }

  if (roles.includes("PARTICIPANT") || roles.includes("GUEST_SPEAKER")) {
    return [
      { href: "/participant", label: "Inicio" },
      { href: "/congresses", label: "Congresos" },
      { href: "/participant/profile", label: "Mi perfil" },
      { href: "/participant/wallet", label: "Mi cartera" },
      { href: "/participant/enrollments", label: "Mis matriculas" },
      { href: "/participant/diplomas", label: "Mis diplomas" },
    ];
  }

  return [{ href: "/congresses", label: "Congresos" }];
}

export async function NavBar(): Promise<React.ReactElement> {
  const session = await getSession();
  const links = getNavLinks(session);

  return (
    <header
      className="sticky top-0 z-50 h-[60px] border-b border-[var(--color-border)] bg-[var(--color-white)] shadow-[var(--shadow-raised)] transition-colors duration-300"
      data-testid="navbar"
    >
      <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between px-6">
        {/* Wordmark with bug icon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline transition-opacity duration-200 hover:opacity-90"
          data-testid="navbar-wordmark"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white shadow-[var(--shadow-elevated)] transition-transform duration-200 hover:scale-110">
            <Bug size={18} strokeWidth={2} />
          </span>
          <span className="font-sans text-xl font-medium">
            <span className="text-[var(--color-text-primary-black)]">Code </span>
            <span className="text-[var(--color-primary-text)]">n</span>
            <span className="text-[var(--color-text-primary-black)]"> Bugs</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navegacion principal"
          data-testid="navbar-desktop-nav"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-1.5 font-secondary text-sm text-[var(--color-text-primary)] no-underline transition-colors duration-200 hover:text-[var(--color-primary-text)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--color-primary-text)] after:transition-all after:duration-300 hover:after:w-full"
              data-testid={`navbar-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mx-2 h-5 w-px bg-[var(--color-border)]" />
          <DarkModeToggle />

          {session !== null && (
            <>
              <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />
              <UserMenu session={session} />
            </>
          )}
        </nav>

        {/* Mobile: toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden" data-testid="navbar-mobile-trigger">
          <DarkModeToggle />
          <MobileMenu links={links} session={session} />
        </div>
      </div>
    </header>
  );
}
