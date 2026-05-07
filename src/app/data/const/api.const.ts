import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
  markets: `${API_BASE_URL}/coins/markets`,
  coinDetail: (id: string) => `${API_BASE_URL}/coins/${id}`,
} as const;

export const DEFAULT_MARKET_PARAMS = {
  vs_currency: 'usd',
  per_page: '50',
  page: '1',
  sparkline: 'false',
  price_change_percentage: '24h',
} as const;
