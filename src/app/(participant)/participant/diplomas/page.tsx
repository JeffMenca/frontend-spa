import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiplomasPage(): React.ReactElement {
  return (
    <div data-testid="diplomas-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Mis diplomas
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Diplomas obtenidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Diplomas en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
