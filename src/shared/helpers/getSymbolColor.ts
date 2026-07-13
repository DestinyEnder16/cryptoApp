import { Colors } from '../constants/styles';

const SYMBOL_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  USDT: '#26A17B',
  BNB: '#F3BA2F',
  SOL: '#9945FF',
  XRP: '#23292F',
  DOGE: '#C2A633',
  LINK: '#2A5ADA',
  ADA: '#0033AD',
  AVAX: '#E84142',
  MATIC: '#8247E5',
  DOT: '#E6007A',
};

export function getSymbolColor(symbol: string): string {
  return SYMBOL_COLORS[symbol] ?? Colors.green;
}
