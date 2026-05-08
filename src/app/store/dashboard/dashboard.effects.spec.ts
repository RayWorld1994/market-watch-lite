import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { Action } from '@ngrx/store';

import { DashboardActions } from './dashboard.actions';
import { loadCoins$, loadCoinDetail$ } from './dashboard.effects';
import { CoingeckoService } from '../../data/service/dashboard/coingecko.service';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';
import { CoinDetail } from '../../data/model/dashboard/coin-detail.interface';

const mockCoin: CoinMarket = {
  id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: '', current_price: 50000,
  market_cap: 1e12, market_cap_rank: 1, fully_diluted_valuation: null,
  total_volume: 3e10, high_24h: 51000, low_24h: 49000,
  price_change_24h: 500, price_change_percentage_24h: 1.01,
  market_cap_change_24h: 5e9, market_cap_change_percentage_24h: 0.5,
  circulating_supply: 19e6, total_supply: 21e6, max_supply: 21e6,
  ath: 69000, ath_change_percentage: -27, ath_date: '', atl: 67,
  atl_change_percentage: 74000, atl_date: '', last_updated: '',
};

const mockDetail: CoinDetail = {
  id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1,
  description: { en: 'A crypto' },
  image: { thumb: '', small: '', large: '' },
  market_data: {
    current_price: { usd: 50000 }, market_cap: { usd: 1e12 },
    total_volume: { usd: 3e10 }, high_24h: { usd: 51000 },
    low_24h: { usd: 49000 }, price_change_24h: 500,
    price_change_percentage_24h: 1.01, market_cap_change_24h: 5e9,
    market_cap_change_percentage_24h: 0.5, circulating_supply: 19e6,
    total_supply: 21e6, max_supply: 21e6,
  },
  links: { homepage: [], blockchain_site: [], subreddit_url: '', repos_url: { github: [] } },
  last_updated: '',
};

describe('Dashboard Effects', () => {
  let actions$: Observable<Action>;
  let coingeckoService: { getMarkets: ReturnType<typeof vi.fn>; getCoinById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    coingeckoService = {
      getMarkets: vi.fn(),
      getCoinById: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: CoingeckoService, useValue: coingeckoService },
      ],
    });
  });

  describe('loadCoins$', () => {
    it('should dispatch loadCoinsSuccess on success', async () => {
      coingeckoService.getMarkets.mockReturnValue(of([mockCoin]));
      actions$ = of(DashboardActions.loadCoins());

      const action = await TestBed.runInInjectionContext(() =>
        firstValueFrom(loadCoins$(actions$, coingeckoService as any)),
      );
      expect(action).toEqual(DashboardActions.loadCoinsSuccess({ coins: [mockCoin] }));
    });

    it('should dispatch loadCoinsFailure on error', async () => {
      const error = { error: { message: 'API down' } };
      coingeckoService.getMarkets.mockReturnValue(throwError(() => error));
      actions$ = of(DashboardActions.loadCoins());

      const action = await TestBed.runInInjectionContext(() =>
        firstValueFrom(loadCoins$(actions$, coingeckoService as any)),
      );
      expect(action).toEqual(DashboardActions.loadCoinsFailure({ error: 'API down' }));
    });

    it('should use fallback message when error.message is missing', async () => {
      const error = { error: {} };
      coingeckoService.getMarkets.mockReturnValue(throwError(() => error));
      actions$ = of(DashboardActions.loadCoins());

      const action = await TestBed.runInInjectionContext(() =>
        firstValueFrom(loadCoins$(actions$, coingeckoService as any)),
      );
      expect(action).toEqual(DashboardActions.loadCoinsFailure({ error: 'Failed to load coins' }));
    });
  });

  describe('loadCoinDetail$', () => {
    it('should dispatch loadCoinDetailSuccess on success', async () => {
      coingeckoService.getCoinById.mockReturnValue(of(mockDetail));
      actions$ = of(DashboardActions.openCoinDetail({ coinId: 'bitcoin' }));

      const action = await TestBed.runInInjectionContext(() =>
        firstValueFrom(loadCoinDetail$(actions$, coingeckoService as any)),
      );
      expect(action).toEqual(DashboardActions.loadCoinDetailSuccess({ detail: mockDetail }));
    });

    it('should dispatch loadCoinDetailFailure on error', async () => {
      const error = { error: { message: 'Not found' } };
      coingeckoService.getCoinById.mockReturnValue(throwError(() => error));
      actions$ = of(DashboardActions.openCoinDetail({ coinId: 'xyz' }));

      const action = await TestBed.runInInjectionContext(() =>
        firstValueFrom(loadCoinDetail$(actions$, coingeckoService as any)),
      );
      expect(action).toEqual(DashboardActions.loadCoinDetailFailure({ error: 'Not found' }));
    });
  });
});
