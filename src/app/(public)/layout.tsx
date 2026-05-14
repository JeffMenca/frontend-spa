import { NavBar } from "@/components/layout/NavBar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-[var(--color-white)] transition-colors duration-300">
      <NavBar />
      <main className="mx-auto min-h-[calc(100vh-60px)] max-w-[var(--container-max)] px-6 py-6">
        {children}
      </main>
    </div>
  );
}
