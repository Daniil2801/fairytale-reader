import type { CryptoChainId } from '@/types/payment';

export const CRYPTO_CHAIN_ORDER: CryptoChainId[] = ['trc20', 'eth', 'btc', 'ton', 'sol'];

export const CRYPTO_CHAIN_LABELS: Record<CryptoChainId, string> = {
  eth: 'Ethereum',
  trc20: 'TRC20',
  btc: 'Bitcoin',
  ton: 'TON',
  sol: 'Solana',
};
