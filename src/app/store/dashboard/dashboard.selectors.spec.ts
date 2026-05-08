import {
  selectCoins,
  selectLoading,
  selectError,
  selectDetailModalOpen,
  selectDetailCoinId,
  selectCoinDetailLoading,
  selectCoinDetail,
  selectCoinDetailError,
  selectSparkline,
} from './dashboard.selectors';
import { DashboardState } from './dashboard.reducer';

const baseState: DashboardState = {
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

const rootState = (overrides: Partial<DashboardState> = {}) => ({
  dashboard: { ...baseState, ...overrides },
});

describe('Dashboard Selectors', () => {
  it('selectCoins should return coins array', () => {
    expect(selectCoins(rootState({ coins: [] }))).toEqual([]);
  });

  it('selectLoading should return loading flag', () => {
    expect(selectLoading(rootState({ loading: true }))).toBe(true);
  });

  it('selectError should return error string', () => {
    expect(selectError(rootState({ error: 'fail' }))).toBe('fail');
  });

  it('selectDetailModalOpen should return modal flag', () => {
    expect(selectDetailModalOpen(rootState({ detailModalOpen: true }))).toBe(true);
  });

  it('selectDetailCoinId should return coin id', () => {
    expect(selectDetailCoinId(rootState({ detailCoinId: 'btc' }))).toBe('btc');
  });

  it('selectCoinDetailLoading should return detail loading', () => {
    expect(selectCoinDetailLoading(rootState({ coinDetailLoading: true }))).toBe(true);
  });

  it('selectCoinDetail should return detail or null', () => {
    expect(selectCoinDetail(rootState())).toBeNull();
  });

  it('selectCoinDetailError should return detail error', () => {
    expect(selectCoinDetailError(rootState({ coinDetailError: 'err' }))).toBe('err');
  });

  it('selectSparkline should return sparkline array', () => {
    expect(selectSparkline(rootState({ sparkline: [1, 2, 3] }))).toEqual([1, 2, 3]);
  });
});
