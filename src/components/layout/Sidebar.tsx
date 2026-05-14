"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  CalendarDays,
  Users,
  DoorOpen,
  Activity,
  Megaphone,
  FileText,
  ClipboardCheck,
  BarChart2,
  Settings,
  CheckSquare,
} from "lucide-react";
import type { Role } from "@/types/auth";
import { cn } from "@/lib/utils";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const CONGRESS_ADMIN_ITEMS: SidebarItem[] = [
  { href: "/congress-admin/congresses", label: "Mis congresos", icon: <CalendarDays size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/rooms",      label: "Salas",          icon: <DoorOpen size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/activities", label: "Actividades",    icon: <Activity size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/calls",      label: "Convocatorias",  icon: <Megaphone size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/proposals",  label: "Propuestas",     icon: <FileText size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/committee",  label: "Comite",         icon: <Users size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/attendance", label: "Asistencia",     icon: <CheckSquare size={20} strokeWidth={1.5} /> },
  { href: "/congress-admin/reports",    label: "Reportes",       icon: <BarChart2 size={20} strokeWidth={1.5} /> },
];

const SYSTEM_ADMIN_ITEMS: SidebarItem[] = [
  { href: "/system-admin/users",        label: "Usuarios",      icon: <Users size={20} strokeWidth={1.5} /> },
  { href: "/system-admin/institutions", label: "Instituciones", icon: <Building2 size={20} strokeWidth={1.5} /> },
  { href: "/system-admin/config",       label: "Configuracion", icon: <Settings size={20} strokeWidth={1.5} /> },
  { href: "/system-admin/reports",      label: "Reportes",      icon: <ClipboardCheck size={20} strokeWidth={1.5} /> },
];

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const items =
    role === "CONGRESS_ADMIN"
      ? CONGRESS_ADMIN_ITEMS
      : role === "SYSTEM_ADMIN"
        ? SYSTEM_ADMIN_ITEMS
        : [];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300",
        collapsed ? "w-14" : "w-60",
      )}
      style={{ height: "100%" }}
      data-testid="sidebar"
      aria-label="Navegacion lateral"
    >
      <nav className="flex-1 py-2">
        {items.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              data-testid={`sidebar-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "group flex items-center gap-3 overflow-hidden px-4 py-3 no-underline transition-all duration-200",
                "animate-slide-in-left",
                isActive
                  ? "bg-[var(--color-pale-blue)] text-[var(--color-primary-text)]"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary-text)]",
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span className={cn("shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")}>
                {item.icon}
              </span>
              <span
                className={cn(
                  "overflow-hidden text-ellipsis whitespace-nowrap font-secondary text-sm transition-all duration-300",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                )}
              >
                {item.label}
              </span>
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-text)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center border-t border-[var(--color-border)] bg-transparent p-3 text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary-text)]"
        aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
        data-testid="sidebar-toggle"
      >
        <span className="transition-transform duration-300">
          {collapsed
            ? <ChevronRight size={20} strokeWidth={1.5} />
            : <ChevronLeft size={20} strokeWidth={1.5} />
          }
        </span>
      </button>
    </aside>
  );
}
