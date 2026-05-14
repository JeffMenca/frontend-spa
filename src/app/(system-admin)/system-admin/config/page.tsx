import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemConfigPage(): React.ReactElement {
  return (
    <div data-testid="system-admin-config-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Configuracion del sistema
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Porcentaje de comision</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "14px",
              color: "var(--color-text-secondary)",
            }}
          >
            Configuracion del sistema en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
