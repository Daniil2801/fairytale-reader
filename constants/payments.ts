import type { UiKey } from '@/constants/i18n';
import type { PlanId } from '@/types/payment';

export const PLAN_USD: Record<PlanId, number> = {
  monthly: 4.99,
  yearly: 39.99,
};

/** Telegram Stars (XTR) — approximate equivalents */
export const PLAN_STARS: Record<PlanId, number> = {
  monthly: 250,
  yearly: 2000,
};

export const PAYMENT_METHODS = [
  {
    id: 'card' as const,
    icon: '💳',
    titleKey: 'payment.method.card' as UiKey,
    descKey: 'payment.method.cardDesc' as UiKey,
  },
  {
    id: 'crypto' as const,
    icon: '₿',
    titleKey: 'payment.method.crypto' as UiKey,
    descKey: 'payment.method.cryptoDesc' as UiKey,
  },
  {
    id: 'telegram_stars' as const,
    icon: '⭐',
    titleKey: 'payment.method.telegram' as UiKey,
    descKey: 'payment.method.telegramDesc' as UiKey,
  },
];
