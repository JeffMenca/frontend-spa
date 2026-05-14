import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivitiesPage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-activities-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Actividades</h1>
      <Card><CardHeader><CardTitle>Gestion de actividades</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Gestion de actividades en construccion.</p></CardContent></Card>
    </div>
  );
}
