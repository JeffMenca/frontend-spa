import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CongressDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CongressDetailPage({
  params,
}: CongressDetailPageProps): Promise<React.ReactElement> {
  const { id } = await params;

  return (
    <div data-testid="congress-detail-page">
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "32px",
          fontWeight: 500,
          marginBottom: "24px",
          color: "var(--color-text-primary-black)",
        }}
      >
        Detalle del congreso
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Congreso {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            style={{
              fontFamily: "var(--font-secondary)",
              fontSize: "14px",
              color: "var(--color-text-secondary)",
            }}
          >
            Detalle del congreso en construccion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
