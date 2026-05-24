import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { WalletPageClient } from "@/components/domain/WalletPageClient";
import { WalletBalanceSchema, TransactionListSchema } from "@/lib/validators/wallet";
import { getSession } from "@/lib/auth/session";
import { serverFetch } from "@/lib/api/server-fetch";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function WalletPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) {
    redirect("/login");
  }

  const [balanceRes, transactionsRes] = await Promise.all([
    serverFetch(`${BASE}/api/wallet/balance`, { cache: "no-store" }),
    serverFetch(`${BASE}/api/wallet/transactions`, { cache: "no-store" }),
  ]);

  // Only redirect if the BFF itself has no session (cookie absent/invalid).
  // A 401 from the downstream wallet service (JWT key mismatch or expired token)
  // shows an error state instead of bouncing the user to login.
  if (
    (balanceRes.status === 401 || transactionsRes.status === 401) &&
    session === null
  ) {
    redirect("/login");
  }

  let balanceRaw: unknown;
  let transactionsRaw: unknown;
  try {
    balanceRaw = await balanceRes.json();
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mi cartera"
          description="Gestiona tu saldo y revisa tu historial de transacciones."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          No se pudo cargar el saldo. Intenta de nuevo.
        </p>
      </div>
    );
  }
  try {
    transactionsRaw = await transactionsRes.json();
  } catch {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mi cartera"
          description="Gestiona tu saldo y revisa tu historial de transacciones."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          No se pudo cargar el historial de transacciones. Intenta de nuevo.
        </p>
      </div>
    );
  }

  const walletParsed = WalletBalanceSchema.safeParse(balanceRaw);
  const transactionsParsed = TransactionListSchema.safeParse(transactionsRaw);

  if (!walletParsed.success || !transactionsParsed.success) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mi cartera"
          description="Gestiona tu saldo y revisa tu historial de transacciones."
        />
        <p className="font-secondary text-sm text-[var(--color-error)]">
          No se pudo conectar con el servicio de cartera. Verifica que el servicio este disponible e intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mi cartera"
        description="Gestiona tu saldo y revisa tu historial de transacciones."
      />
      <WalletPageClient wallet={walletParsed.data} transactions={transactionsParsed.data} />
    </div>
  );
}
