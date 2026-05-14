import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CongressesManagementPage(): React.ReactElement {
  return (
    <div data-testid="congress-admin-congresses-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Mis congresos
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestion de congresos</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Gestion de congresos en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
