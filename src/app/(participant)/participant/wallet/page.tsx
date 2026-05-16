import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { WalletPageClient } from "@/components/domain/WalletPageClient";
import { WalletBalanceSchema, TransactionListSchema } from "@/lib/validators/wallet";
import { getSession } from "@/lib/auth/session";

const BASE = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";

export default async function WalletPage(): Promise<React.ReactElement> {
  const session = await getSession();
  if (session === null) {
    redirect("/login");
  }

  const [balanceRes, transactionsRes] = await Promise.all([
    fetch(`${BASE}/api/wallet/balance`, { cache: "no-store" }),
    fetch(`${BASE}/api/wallet/transactions`, { cache: "no-store" }),
  ]);

  if (balanceRes.status === 401 || transactionsRes.status === 401) {
    redirect("/login");
  }

  const [balanceRaw, transactionsRaw] = await Promise.all([
    balanceRes.json() as Promise<unknown>,
    transactionsRes.json() as Promise<unknown>,
  ]);

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
          Error al cargar los datos de la cartera. Intenta de nuevo mas tarde.
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
      <WalletPageClient
        wallet={walletParsed.data}
        transactions={transactionsParsed.data}
      />
    </div>
  );
}
