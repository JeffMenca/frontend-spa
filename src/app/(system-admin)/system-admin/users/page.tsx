import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage(): React.ReactElement {
  return (
    <div data-testid="system-admin-users-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Usuarios</h1>
      <Card><CardHeader><CardTitle>Gestion de usuarios</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Gestion de usuarios en construccion.</p></CardContent></Card>
    </div>
  );
}
