import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommitteePage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-committee-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Comite cientifico</h1>
      <Card><CardHeader><CardTitle>Miembros del comite</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Comite en construccion.</p></CardContent></Card>
    </div>
  );
}
