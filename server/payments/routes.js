import { Router } from 'express';
import { randomUUID } from 'crypto';

import {
  createPaymentRecord,
  getPayment,
  markCompleted,
  updatePayment,
} from './paymentStore.js';
import { buildCryptoChainsForPlan } from './cryptoChains.js';
import { PLAN_STARS, PLAN_USD, planLabel } from './plans.js';
import { createStarsInvoiceLink } from './telegram.js';

const router = Router();

const PUBLIC_URL = process.env.PUBLIC_API_URL ?? 'http://localhost:3001';
const APP_SCHEME = process.env.APP_SCHEME ?? 'fairytale-dreams';
const TELEGRAM_BOT = process.env.TELEGRAM_BOT_USERNAME ?? 'FairytaleDreamsBot';
const CRYPTO_CHAIN_IDS = ['eth', 'trc20', 'btc', 'ton', 'sol'];

function buildPaymentId() {
  return `pay_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

router.post('/create', async (req, res) => {
  const { planId, method, deviceId } = req.body ?? {};

  if (!['monthly', 'yearly'].includes(planId)) {
    res.status(400).json({ error: 'Invalid planId' });
    return;
  }
  if (!['card', 'crypto', 'telegram_stars'].includes(method)) {
    res.status(400).json({ error: 'Invalid payment method' });
    return;
  }

  const paymentId = buildPaymentId();
  const amountUsd = PLAN_USD[planId];

  const record = createPaymentRecord({
    paymentId,
    planId,
    method,
    deviceId: deviceId ?? 'anonymous',
    status: 'awaiting_payment',
    amountUsd,
    currency: method === 'telegram_stars' ? 'XTR' : method === 'crypto' ? 'USDT' : 'USD',
    createdAt: new Date().toISOString(),
  });

  const payment = {
    paymentId: record.paymentId,
    planId: record.planId,
    method: record.method,
    status: record.status,
    amountUsd: record.amountUsd,
    currency: record.currency,
    createdAt: record.createdAt,
  };

  const response = { payment };

  if (method === 'card') {
    const checkoutUrl = `${PUBLIC_URL}/checkout/${paymentId}`;
    response.card = { checkoutUrl };
  }

  if (method === 'crypto') {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const chains = buildCryptoChainsForPlan(planId);
    response.crypto = {
      chains,
      memo: paymentId,
      expiresAt,
      defaultChainId: 'trc20',
    };
    updatePayment(paymentId, {
      cryptoMemo: paymentId,
      expiresAt,
      selectedCryptoChain: 'trc20',
    });
  }

  if (method === 'telegram_stars') {
    const stars = PLAN_STARS[planId];
    const title = planLabel(planId);
    const description = 'Unlimited fairy tales for your family';
    let invoiceUrl = `https://t.me/${TELEGRAM_BOT}?start=${paymentId}`;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken) {
      try {
        invoiceUrl = await createStarsInvoiceLink({
          botToken,
          title,
          description,
          payload: paymentId,
          stars,
        });
      } catch (err) {
        console.warn('Telegram invoice API:', err.message);
      }
    }

    response.telegram = {
      stars,
      invoiceUrl,
      botUsername: TELEGRAM_BOT,
      useInAppInvoice: Boolean(botToken),
    };
    updatePayment(paymentId, { stars, invoiceUrl });
  }

  res.status(201).json(response);
});

router.patch('/:paymentId/crypto-chain', (req, res) => {
  const { chainId } = req.body ?? {};
  if (!CRYPTO_CHAIN_IDS.includes(chainId)) {
    res.status(400).json({ error: 'Invalid chainId' });
    return;
  }
  const record = getPayment(req.params.paymentId);
  if (!record) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }
  updatePayment(req.params.paymentId, { selectedCryptoChain: chainId });
  res.json({ selectedCryptoChain: chainId });
});

router.get('/:paymentId', (req, res) => {
  const record = getPayment(req.params.paymentId);
  if (!record) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }

  res.json({
    payment: {
      paymentId: record.paymentId,
      planId: record.planId,
      method: record.method,
      status: record.status,
      amountUsd: record.amountUsd,
      currency: record.currency,
      createdAt: record.createdAt,
      completedAt: record.completedAt,
      selectedCryptoChain: record.selectedCryptoChain,
    },
    premiumActivated: record.status === 'completed',
  });
});

router.post('/:paymentId/simulate-complete', (req, res) => {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_PAYMENT_SIMULATE) {
    res.status(403).json({ error: 'Not available' });
    return;
  }
  const record = getPayment(req.params.paymentId);
  if (!record) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }
  markCompleted(req.params.paymentId);
  res.json({
    payment: { ...record, status: 'completed' },
    premiumActivated: true,
  });
});

/** Stripe / card processor webhook stub */
router.post('/webhook/card', (req, res) => {
  const { paymentId } = req.body ?? {};
  if (paymentId) markCompleted(paymentId);
  res.json({ received: true });
});

/** Crypto processor webhook stub */
router.post('/webhook/crypto', (req, res) => {
  const { paymentId, memo } = req.body ?? {};
  const id = paymentId ?? memo;
  if (id) markCompleted(id);
  res.json({ received: true });
});

/** Telegram successful_payment (Bot API update) */
router.post('/webhook/telegram', (req, res) => {
  const message = req.body?.message;
  const sp = message?.successful_payment;
  const payload = sp?.invoice_payload;
  if (payload) markCompleted(payload);
  res.json({ received: true });
});

export function registerCheckoutPage(app) {
  app.get('/checkout/:paymentId', (req, res) => {
    const record = getPayment(req.params.paymentId);
    if (!record) {
      res.status(404).send('Payment not found');
      return;
    }

    const returnUrl = `${APP_SCHEME}://payment?paymentId=${record.paymentId}&status=success`;

    res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Checkout</title>
<style>body{font-family:system-ui;background:#f3ebff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.card{background:#fff;border-radius:20px;padding:32px;max-width:400px;text-align:center;box-shadow:0 8px 32px rgba(107,76,230,.2)}
h1{color:#6B4CE6}button{background:#6B4CE6;color:#fff;border:none;padding:14px 28px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;margin:8px}
p{color:#6B6580;line-height:1.5}.muted{font-size:12px}</style></head>
<body><div class="card">
<h1>Fairytale Dreams</h1>
<p>Card payment (sandbox)<br/><strong>$${record.amountUsd}</strong> — ${record.planId}</p>
<button onclick="pay()">Pay with card</button>
<p class="muted">Production: connect Stripe Checkout here</p>
</div>
<script>
function pay(){
  fetch('/api/payments/${record.paymentId}/simulate-complete',{method:'POST'})
    .then(()=>{ window.location.href='${returnUrl}'; });
}
</script></body></html>`);
  });
}

export default router;
