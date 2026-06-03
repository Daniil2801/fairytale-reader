export type PaymentMethod = 'card' | 'crypto' | 'telegram_stars';

export type CryptoChainId = 'eth' | 'trc20' | 'btc' | 'ton' | 'sol';

export type PaymentStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

export type PlanId = 'monthly' | 'yearly';

export interface PaymentIntent {
  paymentId: string;
  planId: PlanId;
  method: PaymentMethod;
  status: PaymentStatus;
  amountUsd: number;
  currency: string;
  createdAt: string;
  completedAt?: string;
  selectedCryptoChain?: CryptoChainId;
}

export interface CardPaymentDetails {
  checkoutUrl: string;
}

export interface CryptoChainOption {
  id: CryptoChainId;
  label: string;
  network: string;
  currency: string;
  address: string;
  amount: string;
  icon: string;
  /** Optional native-token equivalent (ETH, TON, SOL) */
  altAmount?: string;
}

export interface CryptoPaymentDetails {
  chains: CryptoChainOption[];
  memo: string;
  expiresAt: string;
  defaultChainId: CryptoChainId;
}

export interface TelegramStarsPaymentDetails {
  stars: number;
  invoiceUrl: string;
  botUsername?: string;
  useInAppInvoice: boolean;
}

export interface CreatePaymentResponse {
  payment: PaymentIntent;
  card?: CardPaymentDetails;
  crypto?: CryptoPaymentDetails;
  telegram?: TelegramStarsPaymentDetails;
}

export interface PaymentStatusResponse {
  payment: PaymentIntent;
  premiumActivated: boolean;
}
