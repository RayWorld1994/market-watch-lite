import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Component, input, output } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardActions } from '../../store/dashboard/dashboard.actions';
import { DashboardState } from '../../store/dashboard/dashboard.reducer';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';

@Component({ selector: 'app-asset-list', template: '', standalone: true })
class MockAssetListComponent {
  coins = input<CoinMarket[]>([]);
  loading = input(false);
  assetSelected = output<string>();
}

@Component({ selector: 'app-asset-detail', template: '', standalone: true })
class MockAssetDetailComponent {}

const mockCoin: CoinMarket = {
  id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: '',
  current_price: 50000, market_cap: 1e12, market_cap_rank: 1,
  fully_diluted_valuation: null, total_volume: 3e10,
  high_24h: 51000, low_24h: 49000, price_change_24h: 500,
  price_change_percentage_24h: 1.01, market_cap_change_24h: 5e9,
  market_cap_change_percentage_24h: 0.5, circulating_supply: 19e6,
  total_supply: 21e6, max_supply: 21e6, ath: 69000,
  ath_change_percentage: -27, ath_date: '', atl: 67,
  atl_change_percentage: 74000, atl_date: '', last_updated: '',
  sparkline_in_7d: { price: [1, 2, 3] },
};

const ethCoin: CoinMarket = {
  ...mockCoin, id: 'ethereum', symbol: 'eth', name: 'Ethereum',
};

const initialState: DashboardState = {
  coins: [mockCoin, ethCoin], loading: false, error: null,
  detailModalOpen: false, detailCoinId: null,
  coinDetailLoading: false, coinDetail: null,
  coinDetailError: null, sparkline: [],
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideMockStore({ initialState: { dashboard: initialState } }),
      ],
    })
      .overrideComponent(DashboardComponent, {
        set: {
          imports: [MockAssetListComponent, MockAssetDetailComponent],
          template: '<app-asset-list /><app-asset-detail />',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCoins on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(DashboardActions.loadCoins());
  });

  describe('filteredCoins', () => {
    it('should return all coins when search term is empty', () => {
      fixture.detectChanges();
      expect(component['filteredCoins']().length).toBe(2);
    });

    it('should filter coins by name', () => {
      fixture.detectChanges();
      component['searchTerm'].set('bitcoin');
      expect(component['filteredCoins']().length).toBe(1);
      expect(component['filteredCoins']()[0].id).toBe('bitcoin');
    });

    it('should filter coins by symbol (case-insensitive)', () => {
      fixture.detectChanges();
      component['searchTerm'].set('ETH');
      expect(component['filteredCoins']().length).toBe(1);
      expect(component['filteredCoins']()[0].id).toBe('ethereum');
    });

    it('should return empty array when no match', () => {
      fixture.detectChanges();
      component['searchTerm'].set('dogecoin');
      expect(component['filteredCoins']().length).toBe(0);
    });
  });

  describe('onSearchInput', () => {
    it('should push values to searchInput$ subject', () => {
      fixture.detectChanges();
      const nextSpy = vi.spyOn(component['searchInput$'], 'next');
      component.onSearchInput('btc');
      expect(nextSpy).toHaveBeenCalledWith('btc');
    });

    it('should clear search value and term', () => {
      fixture.detectChanges();
      const nextSpy = vi.spyOn(component['searchInput$'], 'next');
      component.onSearchInput('btc');
      component['searchTerm'].set('btc');

      component['clearSearch']();

      expect(component['searchValue']()).toBe('');
      expect(component['searchTerm']()).toBe('');
      expect(nextSpy).toHaveBeenLastCalledWith('');
    });
  });

  describe('onAssetSelected', () => {
    it('should dispatch openCoinDetail with sparkline data', () => {
      fixture.detectChanges();
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.onAssetSelected('bitcoin');
      expect(dispatchSpy).toHaveBeenCalledWith(
        DashboardActions.openCoinDetail({ coinId: 'bitcoin', sparkline: [1, 2, 3] }),
      );
    });

    it('should dispatch openCoinDetail with undefined sparkline for unknown coin', () => {
      fixture.detectChanges();
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.onAssetSelected('unknown');
      expect(dispatchSpy).toHaveBeenCalledWith(
        DashboardActions.openCoinDetail({ coinId: 'unknown', sparkline: undefined }),
      );
    });
  });
});
