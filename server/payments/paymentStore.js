import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, '..', 'data', 'payments.json');

function load() {
  if (!fs.existsSync(STORE_PATH)) {
    return { payments: {} };
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

function save(data) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

export function createPaymentRecord(record) {
  const data = load();
  data.payments[record.paymentId] = record;
  save(data);
  return record;
}

export function getPayment(paymentId) {
  const data = load();
  return data.payments[paymentId] ?? null;
}

export function updatePayment(paymentId, patch) {
  const data = load();
  const existing = data.payments[paymentId];
  if (!existing) return null;
  const next = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  data.payments[paymentId] = next;
  save(data);
  return next;
}

export function markCompleted(paymentId) {
  return updatePayment(paymentId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}
