import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AttendancePage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-attendance-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Asistencia</h1>
      <Card><CardHeader><CardTitle>Registro de asistencia</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Registro de asistencia en construccion.</p></CardContent></Card>
    </div>
  );
}
