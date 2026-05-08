import { createFeature, createReducer, on } from '@ngrx/store';
import { CoinDetail } from '../../data/model/dashboard/coin-detail.interface';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';
import { DashboardActions } from './dashboard.actions';

export interface DashboardState {
  coins: CoinMarket[];
  loading: boolean;
  error: string | null;
  detailModalOpen: boolean;
  detailCoinId: string | null;
  coinDetailLoading: boolean;
  coinDetail: CoinDetail | null;
  coinDetailError: string | null;
  sparkline: number[];
}

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

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(DashboardActions.loadCoins, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(DashboardActions.loadCoinsSuccess, (state, { coins }) => ({
      ...state,
      coins,
      loading: false,
    })),
    on(DashboardActions.loadCoinsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(DashboardActions.openCoinDetail, (state, { coinId, sparkline }) => ({
      ...state,
      detailModalOpen: true,
      detailCoinId: coinId,
      coinDetailLoading: true,
      coinDetail: null,
      coinDetailError: null,
      sparkline: sparkline ?? [],
    })),
    on(DashboardActions.loadCoinDetailSuccess, (state, { detail }) => ({
      ...state,
      coinDetail: detail,
      coinDetailLoading: false,
      coinDetailError: null,
    })),
    on(DashboardActions.loadCoinDetailFailure, (state, { error }) => ({
      ...state,
      coinDetailLoading: false,
      coinDetail: null,
      coinDetailError: error,
    })),
    on(DashboardActions.closeCoinDetail, (state) => ({
      ...state,
      detailModalOpen: false,
      detailCoinId: null,
      coinDetailLoading: false,
      coinDetail: null,
      coinDetailError: null,
      sparkline: [],
    })),
  ),
});
