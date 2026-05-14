import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnrollmentsPage(): React.ReactElement {
  return (
    <div data-testid="enrollments-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Mis matriculas
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Congresos matriculados</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Matriculas en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
