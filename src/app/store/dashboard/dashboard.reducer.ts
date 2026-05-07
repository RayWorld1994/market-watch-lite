import { createFeature, createReducer, on } from '@ngrx/store';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';
import { DashboardActions } from './dashboard.actions';

export interface DashboardState {
  coins: CoinMarket[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  coins: [],
  loading: false,
  error: null,
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
  ),
});
