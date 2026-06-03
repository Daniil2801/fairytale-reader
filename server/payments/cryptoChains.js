import { PLAN_USD } from './plans.js';

/** Rough demo rates — replace with live rates in production */
const BTC_USD = Number(process.env.CRYPTO_BTC_USD_RATE ?? 65000);
const ETH_USD = Number(process.env.CRYPTO_ETH_USD_RATE ?? 3200);
const TON_USD = Number(process.env.CRYPTO_TON_USD_RATE ?? 5.5);
const SOL_USD = Number(process.env.CRYPTO_SOL_USD_RATE ?? 140);

const ADDRESSES = {
  eth: process.env.CRYPTO_ETH_ADDRESS ?? '0xFairytaleDreams0000000000000000000001',
  trc20: process.env.CRYPTO_TRC20_ADDRESS ?? 'TDevFairytaleDreams0000000000001',
  btc: process.env.CRYPTO_BTC_ADDRESS ?? 'bc1qfairytaledev0000000000000000000001',
  ton: process.env.CRYPTO_TON_ADDRESS ?? 'UQFairytaleDreams-dev-ton-wallet-00001',
  sol: process.env.CRYPTO_SOL_ADDRESS ?? 'FairytaleDevSol1111111111111111111111111',
};

function usdAmount(planId) {
  return PLAN_USD[planId].toFixed(2);
}

function formatBtc(planId) {
  const usd = PLAN_USD[planId];
  return (usd / BTC_USD).toFixed(8);
}

function formatEth(planId) {
  const usd = PLAN_USD[planId];
  return (usd / ETH_USD).toFixed(6);
}

function formatTon(planId) {
  const usd = PLAN_USD[planId];
  return (usd / TON_USD).toFixed(4);
}

function formatSol(planId) {
  const usd = PLAN_USD[planId];
  return (usd / SOL_USD).toFixed(4);
}

const CHAIN_BUILDERS = {
  eth: (planId) => ({
    id: 'eth',
    label: 'Ethereum',
    network: 'ERC-20',
    currency: 'USDT',
    address: ADDRESSES.eth,
    amount: usdAmount(planId),
    icon: '⟠',
    altAmount: `${formatEth(planId)} ETH`,
  }),
  trc20: (planId) => ({
    id: 'trc20',
    label: 'TRON',
    network: 'TRC20',
    currency: 'USDT',
    address: ADDRESSES.trc20,
    amount: usdAmount(planId),
    icon: '🔴',
  }),
  btc: (planId) => ({
    id: 'btc',
    label: 'Bitcoin',
    network: 'Bitcoin',
    currency: 'BTC',
    address: ADDRESSES.btc,
    amount: formatBtc(planId),
    icon: '₿',
  }),
  ton: (planId) => ({
    id: 'ton',
    label: 'TON',
    network: 'TON',
    currency: 'USDT',
    address: ADDRESSES.ton,
    amount: usdAmount(planId),
    icon: '💎',
    altAmount: `${formatTon(planId)} TON`,
  }),
  sol: (planId) => ({
    id: 'sol',
    label: 'Solana',
    network: 'SPL',
    currency: 'USDT',
    address: ADDRESSES.sol,
    amount: usdAmount(planId),
    icon: '◎',
    altAmount: `${formatSol(planId)} SOL`,
  }),
};

const ORDER = ['trc20', 'eth', 'btc', 'ton', 'sol'];

export function buildCryptoChainsForPlan(planId) {
  return ORDER.map((id) => CHAIN_BUILDERS[id](planId));
}

export function getChainById(planId, chainId) {
  const builder = CHAIN_BUILDERS[chainId];
  return builder ? builder(planId) : null;
}
