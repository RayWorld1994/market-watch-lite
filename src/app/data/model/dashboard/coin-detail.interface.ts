export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number | null;
  description: Record<string, string>;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: CoinMarketData;
  links: CoinLinks;
  last_updated: string;
}

export interface CoinMarketData {
  current_price: Record<string, number>;
  market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  high_24h: Record<string, number>;
  low_24h: Record<string, number>;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
}

export interface CoinLinks {
  homepage: string[];
  blockchain_site: string[];
  subreddit_url: string;
  repos_url: {
    github: string[];
  };
}
