export const PLAN_USD = {
  monthly: 4.99,
  yearly: 39.99,
};

export const PLAN_STARS = {
  monthly: 250,
  yearly: 2000,
};

export const PLAN_CRYPTO_USDT = {
  monthly: '4.99',
  yearly: '39.99',
};

export function planLabel(planId) {
  return planId === 'yearly' ? 'Fairytale Dreams Premium (Yearly)' : 'Fairytale Dreams Premium (Monthly)';
}
