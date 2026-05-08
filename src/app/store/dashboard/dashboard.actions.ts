import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CoinDetail } from '../../data/model/dashboard/coin-detail.interface';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load Coins': emptyProps(),
    'Load Coins Success': props<{ coins: CoinMarket[] }>(),
    'Load Coins Failure': props<{ error: string }>(),
    'Open Coin Detail': props<{ coinId: string; sparkline?: number[] }>(),
    'Load Coin Detail Success': props<{ detail: CoinDetail }>(),
    'Load Coin Detail Failure': props<{ error: string }>(),
    'Close Coin Detail': emptyProps(),
  },
});
