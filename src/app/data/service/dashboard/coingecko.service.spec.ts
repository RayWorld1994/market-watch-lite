import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { CoingeckoService } from './coingecko.service';
import { API_ENDPOINTS, DEFAULT_MARKET_PARAMS } from '../../const/api.const';

describe('CoingeckoService', () => {
  let service: CoingeckoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CoingeckoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getMarkets', () => {
    it('should call the markets endpoint with default params', () => {
      service.getMarkets().subscribe();

      const req = httpMock.expectOne((r) => r.url === API_ENDPOINTS.markets);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('vs_currency')).toBe(DEFAULT_MARKET_PARAMS.vs_currency);
      expect(req.request.params.get('per_page')).toBe(DEFAULT_MARKET_PARAMS.per_page);
      expect(req.request.params.get('sparkline')).toBe('true');
      req.flush([]);
    });

    it('should return CoinMarket array', async () => {
      const mockData = [{ id: 'bitcoin', name: 'Bitcoin' }];

      const promise = firstValueFrom(service.getMarkets());
      httpMock.expectOne((r) => r.url === API_ENDPOINTS.markets).flush(mockData);
      const data = await promise;
      expect(data).toEqual(mockData as any);
    });
  });

  describe('getCoinById', () => {
    it('should call the correct endpoint with coin id', () => {
      service.getCoinById('bitcoin').subscribe();

      const req = httpMock.expectOne(API_ENDPOINTS.coinDetail('bitcoin'));
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should return CoinDetail', async () => {
      const mockData = { id: 'bitcoin', name: 'Bitcoin' };

      const promise = firstValueFrom(service.getCoinById('bitcoin'));
      httpMock.expectOne(API_ENDPOINTS.coinDetail('bitcoin')).flush(mockData);
      const data = await promise;
      expect(data).toEqual(mockData as any);
    });
  });
});
