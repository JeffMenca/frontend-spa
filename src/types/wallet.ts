export type TransactionType = "TOP_UP" | "PAYMENT";

export interface Wallet {
  userId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  walletUserId: string;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  referencePaymentId: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  congressId: string;
  amount: number;
  commissionAmount: number;
  netAmount: number;
  paymentDate: string;
  idempotencyKey: string;
  createdAt: string;
}
