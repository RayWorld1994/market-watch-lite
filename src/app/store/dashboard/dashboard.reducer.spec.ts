import { DashboardActions } from './dashboard.actions';
import { dashboardFeature, DashboardState } from './dashboard.reducer';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';
import { CoinDetail } from '../../data/model/dashboard/coin-detail.interface';

const reducer = dashboardFeature.reducer;

const initialState: DashboardState = {
  coins: [],
  loading: false,
  error: null,
  detailModalOpen: false,
  detailCoinId: null,
  coinDetailLoading: false,
  coinDetail: null,
  coinDetailError: null,
  sparkline: [],
};

const mockCoin: CoinMarket = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  current_price: 50000,
  market_cap: 1000000000000,
  market_cap_rank: 1,
  fully_diluted_valuation: null,
  total_volume: 30000000000,
  high_24h: 51000,
  low_24h: 49000,
  price_change_24h: 500,
  price_change_percentage_24h: 1.01,
  market_cap_change_24h: 5000000000,
  market_cap_change_percentage_24h: 0.5,
  circulating_supply: 19000000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 69000,
  ath_change_percentage: -27,
  ath_date: '2021-11-10',
  atl: 67,
  atl_change_percentage: 74000,
  atl_date: '2013-07-06',
  last_updated: '2024-01-01T00:00:00Z',
};

const mockDetail: CoinDetail = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  market_cap_rank: 1,
  description: { en: 'A cryptocurrency' },
  image: { thumb: '', small: '', large: '' },
  market_data: {
    current_price: { usd: 50000 },
    market_cap: { usd: 1000000000000 },
    total_volume: { usd: 30000000000 },
    high_24h: { usd: 51000 },
    low_24h: { usd: 49000 },
    price_change_24h: 500,
    price_change_percentage_24h: 1.01,
    market_cap_change_24h: 5000000000,
    market_cap_change_percentage_24h: 0.5,
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
  },
  links: { homepage: [], blockchain_site: [], subreddit_url: '', repos_url: { github: [] } },
  last_updated: '2024-01-01T00:00:00Z',
};

describe('Dashboard Reducer', () => {
  it('should return the initial state on unknown action', () => {
    const action = { type: 'UNKNOWN' };
    const state = reducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  describe('loadCoins', () => {
    it('should set loading to true and clear error', () => {
      const state = reducer({ ...initialState, error: 'old error' }, DashboardActions.loadCoins());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loadCoinsSuccess', () => {
    it('should set coins and loading to false', () => {
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, DashboardActions.loadCoinsSuccess({ coins: [mockCoin] }));
      expect(state.coins).toEqual([mockCoin]);
      expect(state.loading).toBe(false);
    });
  });

  describe('loadCoinsFailure', () => {
    it('should set error and loading to false', () => {
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, DashboardActions.loadCoinsFailure({ error: 'fail' }));
      expect(state.error).toBe('fail');
      expect(state.loading).toBe(false);
    });
  });

  describe('openCoinDetail', () => {
    it('should open modal, set coinId, and loading', () => {
      const state = reducer(
        initialState,
        DashboardActions.openCoinDetail({ coinId: 'bitcoin', sparkline: [1, 2, 3] }),
      );
      expect(state.detailModalOpen).toBe(true);
      expect(state.detailCoinId).toBe('bitcoin');
      expect(state.coinDetailLoading).toBe(true);
      expect(state.sparkline).toEqual([1, 2, 3]);
      expect(state.coinDetail).toBeNull();
      expect(state.coinDetailError).toBeNull();
    });

    it('should default sparkline to empty array when undefined', () => {
      const state = reducer(initialState, DashboardActions.openCoinDetail({ coinId: 'eth' }));
      expect(state.sparkline).toEqual([]);
    });
  });

  describe('loadCoinDetailSuccess', () => {
    it('should set detail and stop loading', () => {
      const prev = { ...initialState, coinDetailLoading: true };
      const state = reducer(prev, DashboardActions.loadCoinDetailSuccess({ detail: mockDetail }));
      expect(state.coinDetail).toEqual(mockDetail);
      expect(state.coinDetailLoading).toBe(false);
      expect(state.coinDetailError).toBeNull();
    });
  });

  describe('loadCoinDetailFailure', () => {
    it('should set error, clear detail, and stop loading', () => {
      const prev = { ...initialState, coinDetailLoading: true };
      const state = reducer(prev, DashboardActions.loadCoinDetailFailure({ error: 'not found' }));
      expect(state.coinDetailError).toBe('not found');
      expect(state.coinDetail).toBeNull();
      expect(state.coinDetailLoading).toBe(false);
    });
  });

  describe('closeCoinDetail', () => {
    it('should reset all detail modal state', () => {
      const prev: DashboardState = {
        ...initialState,
        detailModalOpen: true,
        detailCoinId: 'bitcoin',
        coinDetailLoading: false,
        coinDetail: mockDetail,
        sparkline: [1, 2],
      };
      const state = reducer(prev, DashboardActions.closeCoinDetail());
      expect(state.detailModalOpen).toBe(false);
      expect(state.detailCoinId).toBeNull();
      expect(state.coinDetail).toBeNull();
      expect(state.sparkline).toEqual([]);
    });

    it('should not affect coins list state', () => {
      const prev: DashboardState = {
        ...initialState,
        coins: [mockCoin],
        detailModalOpen: true,
      };
      const state = reducer(prev, DashboardActions.closeCoinDetail());
      expect(state.coins).toEqual([mockCoin]);
    });
  });
});
