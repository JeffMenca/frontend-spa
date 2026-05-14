import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CongressAdminReportsPage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-reports-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Reportes</h1>
      <Card><CardHeader><CardTitle>Reportes del congreso</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Reportes en construccion.</p></CardContent></Card>
    </div>
  );
}
