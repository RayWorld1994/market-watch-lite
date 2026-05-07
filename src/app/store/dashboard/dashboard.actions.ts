import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load Coins': emptyProps(),
    'Load Coins Success': props<{ coins: CoinMarket[] }>(),
    'Load Coins Failure': props<{ error: string }>(),
  },
});
