import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage(): React.ReactElement {
  return (
    <div data-testid="profile-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Mi perfil
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Informacion personal</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontFamily: "var(--font-secondary)", fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Perfil en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
