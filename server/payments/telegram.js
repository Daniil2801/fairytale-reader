/**
 * Telegram Bot API — createInvoiceLink for Stars (XTR).
 * Set TELEGRAM_BOT_TOKEN in server env.
 */
export async function createStarsInvoiceLink({
  botToken,
  title,
  description,
  payload,
  stars,
}) {
  const url = `https://api.telegram.org/bot${botToken}/createInvoiceLink`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      payload,
      currency: 'XTR',
      prices: [{ label: title, amount: stars }],
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description ?? 'Telegram invoice failed');
  }
  return data.result;
}
