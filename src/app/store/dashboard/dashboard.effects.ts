import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap, of, switchMap } from 'rxjs';

import { CoingeckoService } from '../../data/service/dashboard/coingecko.service';
import { DashboardActions } from './dashboard.actions';

export const loadCoins$ = createEffect(
  (actions$ = inject(Actions), coingeckoService = inject(CoingeckoService)) =>
    actions$.pipe(
      ofType(DashboardActions.loadCoins),
      exhaustMap(() =>
        coingeckoService.getMarkets().pipe(
          map((coins) => DashboardActions.loadCoinsSuccess({ coins })),
          catchError((error) =>
            of(DashboardActions.loadCoinsFailure({ error: error.error.message ?? 'Failed to load coins' })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadCoinDetail$ = createEffect(
  (actions$ = inject(Actions), coingeckoService = inject(CoingeckoService)) =>
    actions$.pipe(
      ofType(DashboardActions.openCoinDetail),
      switchMap(({ coinId }) =>
        coingeckoService.getCoinById(coinId).pipe(
          map((detail) => DashboardActions.loadCoinDetailSuccess({ detail })),
          catchError((error) =>
            of(DashboardActions.loadCoinDetailFailure({ error: error.error.message ?? 'Failed to load coin details' })),
          ),
        ),
      ),
    ),
  { functional: true },
);
