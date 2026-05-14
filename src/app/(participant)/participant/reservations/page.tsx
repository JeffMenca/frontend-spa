import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReservationsPage(): React.ReactElement {
  return (
    <div data-testid="reservations-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Mis reservaciones
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Talleres reservados</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Reservaciones en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
