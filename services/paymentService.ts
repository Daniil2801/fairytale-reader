import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

import { API_BASE_URL, PAYMENT_RETURN_SCHEME } from '@/constants/config';
import { getDeviceId } from '@/lib/deviceId';
import { getJson, setJson } from '@/lib/storage';
import type {
  CreatePaymentResponse,
  CryptoChainId,
  PaymentMethod,
  PaymentStatusResponse,
  PlanId,
} from '@/types/payment';

export async function createPayment(
  planId: PlanId,
  method: PaymentMethod,
): Promise<CreatePaymentResponse> {
  const deviceId = await getDeviceId();
  const res = await fetch(`${API_BASE_URL}/api/payments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ planId, method, deviceId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Payment failed (${res.status})`);
  }

  return res.json() as Promise<CreatePaymentResponse>;
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/payments/${paymentId}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Could not load payment status');
  }
  return res.json() as Promise<PaymentStatusResponse>;
}

export async function openCardCheckout(checkoutUrl: string): Promise<WebBrowser.WebBrowserResult> {
  return WebBrowser.openAuthSessionAsync(
    checkoutUrl,
    `${PAYMENT_RETURN_SCHEME}://payment`,
  );
}

export async function openTelegramInvoice(invoiceUrl: string): Promise<void> {
  const canOpen = await Linking.canOpenURL(invoiceUrl);
  if (!canOpen) {
    throw new Error('Cannot open Telegram payment link');
  }
  await Linking.openURL(invoiceUrl);
}

/** Dev / sandbox: mark payment complete on server */
export async function selectCryptoChain(
  paymentId: string,
  chainId: CryptoChainId,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/crypto-chain`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ chainId }),
  });
  if (!res.ok) {
    throw new Error('Could not save chain selection');
  }
}

export async function simulatePaymentComplete(paymentId: string): Promise<PaymentStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/simulate-complete`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Simulate failed');
  }
  return res.json() as Promise<PaymentStatusResponse>;
}

export async function savePaymentSession(
  paymentId: string,
  data: CreatePaymentResponse,
): Promise<void> {
  await setJson(`@fairytale/payment/${paymentId}`, data);
}

export async function loadPaymentSession(
  paymentId: string,
): Promise<CreatePaymentResponse | null> {
  return getJson<CreatePaymentResponse | null>(`@fairytale/payment/${paymentId}`, null);
}

export function isTelegramWebApp(): boolean {
  if (typeof globalThis === 'undefined') return false;
  const tg = (globalThis as { Telegram?: { WebApp?: unknown } }).Telegram;
  return Boolean(tg?.WebApp);
}
