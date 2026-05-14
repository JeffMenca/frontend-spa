import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoomsPage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-rooms-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Salas</h1>
      <Card><CardHeader><CardTitle>Gestion de salas</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Gestion de salas en construccion.</p></CardContent></Card>
    </div>
  );
}
