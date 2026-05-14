import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CongressesPage(): React.ReactElement {
  return (
    <div data-testid="congresses-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Congresos disponibles
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Catalogo de congresos</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "14px",
              color: "var(--color-text-secondary)",
            }}
          >
            Catalogo de congresos en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
