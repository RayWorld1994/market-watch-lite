import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap, of } from 'rxjs';

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
            of(DashboardActions.loadCoinsFailure({ error: error.message ?? 'Failed to load coins' })),
          ),
        ),
      ),
    ),
  { functional: true },
);
