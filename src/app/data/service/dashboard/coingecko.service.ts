import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CoinMarket } from '../../model/dashboard/coin-market.interface';
import { CoinDetail } from '../../model/dashboard/coin-detail.interface';
import { API_ENDPOINTS, DEFAULT_MARKET_PARAMS } from '../../const/api.const';

@Injectable({ providedIn: 'root' })
export class CoingeckoService {
  private readonly http = inject(HttpClient);

  getMarkets(params?: Partial<typeof DEFAULT_MARKET_PARAMS>): Observable<CoinMarket[]> {
    const merged = { ...DEFAULT_MARKET_PARAMS, ...params };
    const httpParams = new HttpParams({ fromObject: merged });
    return this.http.get<CoinMarket[]>(API_ENDPOINTS.markets, { params: httpParams });
  }

  getCoinById(id: string): Observable<CoinDetail> {
    return this.http.get<CoinDetail>(API_ENDPOINTS.coinDetail(id));
  }
}
