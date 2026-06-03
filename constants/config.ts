/** Free users can open this many unique stories per rolling 7-day window */
export const FREE_STORIES_PER_WEEK = 2;

/** Stories published within this many days count as "new" */
export const NEW_STORY_DAYS = 7;

/** API base — set EXPO_PUBLIC_API_URL in .env for device testing */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export const SUBSCRIPTION_PRODUCT_IDS = {
  monthly: 'fairytale_premium_monthly',
  yearly: 'fairytale_premium_yearly',
} as const;

export const SUBSCRIPTION_PRICES = {
  monthly: { amount: 4.99, label: '$4.99/mo' },
  yearly: { amount: 39.99, label: '$39.99/yr', savings: 'Save 33%' },
} as const;

/** Deep link scheme for payment return (matches app.json) */
export const PAYMENT_RETURN_SCHEME = 'fairytale-dreams';
