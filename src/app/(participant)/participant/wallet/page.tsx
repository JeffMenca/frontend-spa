import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletPage(): React.ReactElement {
  return (
    <div data-testid="wallet-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Mi cartera
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Saldo y transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Cartera en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
