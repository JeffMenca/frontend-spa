import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProposalsPage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-proposals-page">
      <h1 style={{ fontFamily: "var(--font-sans)", fontSize: "32px", fontWeight: 500, marginBottom: "24px", color: "var(--color-text-primary-black)" }}>Propuestas</h1>
      <Card><CardHeader><CardTitle>Gestion de propuestas</CardTitle></CardHeader><CardContent><p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>Propuestas en construccion.</p></CardContent></Card>
    </div>
  );
}
