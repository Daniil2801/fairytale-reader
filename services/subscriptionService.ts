import { SUBSCRIPTION_PRODUCT_IDS } from '@/constants/config';
import {
  activatePremiumFromPayment,
  setSubscriptionTier,
} from '@/services/entitlementService';
import {
  createPayment,
  getPaymentStatus,
  openCardCheckout,
  openTelegramInvoice,
} from '@/services/paymentService';
import type { CreatePaymentResponse } from '@/types/payment';
import type { PaymentMethod } from '@/types/payment';
import type { SubscriptionTier } from '@/types/story';

export type PlanId = keyof typeof SUBSCRIPTION_PRODUCT_IDS;

export const subscriptionService = {
  async getTier(): Promise<SubscriptionTier> {
    return 'free';
  },

  async purchase(
    plan: PlanId,
    method: PaymentMethod = 'card',
  ): Promise<
    | { type: 'completed'; tier: SubscriptionTier }
    | { type: 'pending'; paymentId: string; created: CreatePaymentResponse }
  > {
    const created = await createPayment(plan, method);

    if (method === 'card' && created.card?.checkoutUrl) {
      await openCardCheckout(created.card.checkoutUrl);
      const tier = await pollUntilComplete(created.payment.paymentId);
      return { type: 'completed', tier };
    }

    if (method === 'telegram_stars' && created.telegram?.invoiceUrl) {
      if (created.telegram.useInAppInvoice) {
        try {
          await openTelegramInAppInvoice(created.telegram.invoiceUrl);
          const tier = await pollUntilComplete(created.payment.paymentId, 30_000);
          return { type: 'completed', tier };
        } catch {
          /* fall through to external link + polling */
        }
      }
      await openTelegramInvoice(created.telegram.invoiceUrl);
      return {
        type: 'pending',
        paymentId: created.payment.paymentId,
        created,
      };
    }

    if (method === 'crypto' && created.crypto) {
      return {
        type: 'pending',
        paymentId: created.payment.paymentId,
        created,
      };
    }

    throw new Error('Unsupported payment flow');
  },

  async completePayment(paymentId: string): Promise<SubscriptionTier> {
    return pollUntilComplete(paymentId, 300_000);
  },

  async restorePurchases(): Promise<SubscriptionTier> {
    await new Promise((r) => setTimeout(r, 500));
    return 'free';
  },

  async devTogglePremium(enabled: boolean): Promise<SubscriptionTier> {
    const tier: SubscriptionTier = enabled ? 'premium' : 'free';
    await setSubscriptionTier(tier);
    return tier;
  },
};

async function pollUntilComplete(
  paymentId: string,
  maxMs = 120_000,
): Promise<SubscriptionTier> {
  const started = Date.now();
  while (Date.now() - started < maxMs) {
    const { payment, premiumActivated } = await getPaymentStatus(paymentId);
    if (payment.status === 'completed' || premiumActivated) {
      await activatePremiumFromPayment(paymentId);
      return 'premium';
    }
    if (payment.status === 'failed' || payment.status === 'expired') {
      throw new Error('Payment was not completed');
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error('Payment timed out');
}

async function openTelegramInAppInvoice(invoiceUrl: string): Promise<void> {
  const tg = (
    globalThis as {
      Telegram?: {
        WebApp?: {
          openInvoice: (url: string, cb: (status: string) => void) => void;
        };
      };
    }
  ).Telegram?.WebApp;

  if (!tg?.openInvoice) {
    await openTelegramInvoice(invoiceUrl);
    return;
  }

  return new Promise((resolve, reject) => {
    tg.openInvoice(invoiceUrl, (status) => {
      if (status === 'paid') resolve();
      else if (status === 'cancelled') reject(new Error('Payment cancelled'));
      else reject(new Error(`Payment status: ${status}`));
    });
  });
}
