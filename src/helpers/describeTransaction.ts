import type { Transaction, TransactionType } from '../types/wallet/types';
import { formatAmount } from './formatAmount';

export type TxDirection = 'credit' | 'debit' | 'neutral';

/**
 * Whether a transaction reads as money in (green), out (red), or a wash
 * (swap/transfer, where one asset becomes another). Drives row/headline color.
 */
export function txDirection(type: TransactionType): TxDirection {
  switch (type) {
    case 'deposit':
    case 'sell':
      return 'credit';
    case 'withdrawal':
    case 'buy':
      return 'debit';
    default:
      return 'neutral'; // swap, transfer
  }
}

export interface TransactionDisplay {
  /** Human title, e.g. "ETH → USDC swap", "USDT deposit". */
  title: string;
  /** Compact signed amount for list rows, e.g. "+250 USDT". */
  amountLabel: string;
  /** Headline amount for the detail screen (shows both legs of a swap). */
  detailAmount: string;
  direction: TxDirection;
}

const amount = (value?: number, asset?: string) =>
  value != null && asset ? `${formatAmount(value)} ${asset}` : '—';

/**
 * Turn a raw API transaction into the strings the UI shows. Kept in one place
 * so the row and the detail screen always agree on title/sign/color.
 */
export function describeTransaction(tx: Transaction): TransactionDisplay {
  const { type, fromAsset, toAsset, fromAmount, toAmount } = tx;
  const direction = txDirection(type);

  let title: string;
  switch (type) {
    case 'deposit':
      title = `${toAsset ?? fromAsset} deposit`;
      break;
    case 'withdrawal':
      title = `${fromAsset} withdrawal`;
      break;
    case 'buy':
      title = `Buy ${toAsset}`;
      break;
    case 'sell':
      title = `Sell ${fromAsset}`;
      break;
    case 'swap':
      title = `${fromAsset} → ${toAsset} swap`;
      break;
    default:
      title = `${fromAsset ?? toAsset} transfer`;
  }

  let amountLabel: string;
  let detailAmount: string;
  if (direction === 'credit') {
    const credited = amount(toAmount ?? fromAmount, toAsset ?? fromAsset);
    amountLabel = `+${credited}`;
    detailAmount = `+${credited}`;
  } else if (direction === 'debit') {
    const debited = amount(fromAmount, fromAsset);
    amountLabel = `-${debited}`;
    detailAmount = `-${debited}`;
  } else {
    // swap / transfer: show what you received in the row, both legs on detail
    amountLabel = amount(toAmount, toAsset);
    detailAmount = `${amount(fromAmount, fromAsset)} → ${amount(toAmount, toAsset)}`;
  }

  return { title, amountLabel, detailAmount, direction };
}
