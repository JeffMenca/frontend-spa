import "server-only";

import { apiFetch } from "./client";
import {
  WalletBalanceSchema,
  TransactionListSchema,
  TopUpSchema,
  PaymentSchema,
  type WalletBalanceData,
  type TransactionListData,
  type TopUpData,
  type PaymentData,
} from "@/lib/validators/wallet";
import { z } from "zod";

const WALLET_URL =
  process.env["WALLET_INTERNAL_URL"] ??
  process.env["NEXT_PUBLIC_WALLET_URL"] ??
  "http://localhost:8083";

const SystemConfigSchema = z.object({
  commissionPercent: z.number().min(0).max(100),
  updatedBy: z.string().uuid().nullable(),
  updatedAt: z.string().nullable(),
});

// --- Wallet ---

export async function getWalletBalance(token: string): Promise<WalletBalanceData> {
  return apiFetch(`${WALLET_URL}/wallet/balance`, WalletBalanceSchema, { token });
}

export async function getWalletTransactions(
  token: string,
  params: URLSearchParams,
): Promise<TransactionListData> {
  return apiFetch(
    `${WALLET_URL}/wallet/transactions?${params.toString()}`,
    TransactionListSchema,
    { token },
  );
}

export async function topUpWallet(data: TopUpData, token: string): Promise<WalletBalanceData> {
  const validated = TopUpSchema.parse(data);
  return apiFetch(`${WALLET_URL}/wallet/top-up`, WalletBalanceSchema, {
    method: "POST",
    body: validated,
    token,
  });
}

// --- Payments ---

export async function getPayment(id: string, token: string): Promise<PaymentData> {
  return apiFetch(`${WALLET_URL}/payments/${id}`, PaymentSchema, { token });
}

export async function listPayments(
  token: string,
  params: URLSearchParams,
): Promise<{ items: PaymentData[]; totalItems: number; totalPages: number }> {
  const PaymentListSchema = z.object({
    items: z.array(PaymentSchema),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
  return apiFetch(`${WALLET_URL}/payments?${params.toString()}`, PaymentListSchema, { token });
}

// --- System Config ---

export async function getSystemConfig(
  token: string,
): Promise<z.infer<typeof SystemConfigSchema>> {
  return apiFetch(`${WALLET_URL}/system/config`, SystemConfigSchema, { token });
}

export async function updateSystemConfig(
  commissionPercent: number,
  token: string,
): Promise<z.infer<typeof SystemConfigSchema>> {
  return apiFetch(`${WALLET_URL}/system/config`, SystemConfigSchema, {
    method: "PUT",
    body: { commissionPercent },
    token,
  });
}
