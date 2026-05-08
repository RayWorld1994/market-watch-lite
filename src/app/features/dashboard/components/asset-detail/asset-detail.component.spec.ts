import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AssetDetailComponent } from './asset-detail.component';
import { DashboardActions } from '../../../../store/dashboard/dashboard.actions';
import { DashboardState } from '../../../../store/dashboard/dashboard.reducer';
import { CoinDetail } from '../../../../data/model/dashboard/coin-detail.interface';

const mockDetail: CoinDetail = {
  id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', market_cap_rank: 1,
  description: { en: '<p>A decentralized cryptocurrency</p>' },
  image: { thumb: '', small: '', large: 'https://example.com/btc.png' },
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

const initialDashboardState: DashboardState = {
  coins: [], loading: false, error: null,
  detailModalOpen: false, detailCoinId: null,
  coinDetailLoading: false, coinDetail: null,
  coinDetailError: null, sparkline: [],
};

describe('AssetDetailComponent', () => {
  let component: AssetDetailComponent;
  let fixture: ComponentFixture<AssetDetailComponent>;
  let store: MockStore;

  beforeEach(async () => {
    globalThis.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    await TestBed.configureTestingModule({
      imports: [AssetDetailComponent],
      providers: [
        provideMockStore({ initialState: { dashboard: initialDashboardState } }),
      ],
    })
      .overrideComponent(AssetDetailComponent, {
        set: { imports: [], template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AssetDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch closeCoinDetail and reset description on close', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.close();
    expect(dispatchSpy).toHaveBeenCalledWith(DashboardActions.closeCoinDetail());
    expect(component['descriptionExpanded']()).toBe(false);
  });

  it('should toggle descriptionExpanded', () => {
    expect(component['descriptionExpanded']()).toBe(false);
    component.toggleDescription();
    expect(component['descriptionExpanded']()).toBe(true);
    component.toggleDescription();
    expect(component['descriptionExpanded']()).toBe(false);
  });

  it('should call close when visibility changes to false', () => {
    const closeSpy = vi.spyOn(component, 'close');
    component.onVisibleChange(false);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not call close when visibility changes to true', () => {
    const closeSpy = vi.spyOn(component, 'close');
    component.onVisibleChange(true);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  describe('usd', () => {
    it('should return usd value from record', () => {
      expect(component['usd']({ usd: 50000, eur: 45000 })).toBe(50000);
    });

    it('should return null for undefined', () => {
      expect(component['usd'](undefined)).toBeNull();
    });

    it('should return null when usd key is missing', () => {
      expect(component['usd']({ eur: 45000 })).toBeNull();
    });
  });

  describe('compact', () => {
    it('should format trillions', () => {
      expect(component['compact'](1_500_000_000_000)).toBe('$1.50T');
    });

    it('should format billions', () => {
      expect(component['compact'](2_300_000_000)).toBe('$2.30B');
    });

    it('should format millions', () => {
      expect(component['compact'](4_500_000)).toBe('$4.50M');
    });

    it('should return dash for null', () => {
      expect(component['compact'](null)).toBe('—');
    });
  });

  describe('isPricePositive', () => {
    it('should be true when price change >= 0', () => {
      store.setState({
        dashboard: { ...initialDashboardState, coinDetail: mockDetail },
      });
      store.refreshState();
      expect(component['isPricePositive']()).toBe(true);
    });

    it('should be false when price change < 0', () => {
      const negative = {
        ...mockDetail,
        market_data: { ...mockDetail.market_data, price_change_percentage_24h: -2.5 },
      };
      store.setState({
        dashboard: { ...initialDashboardState, coinDetail: negative },
      });
      store.refreshState();
      expect(component['isPricePositive']()).toBe(false);
    });
  });

  describe('descriptionHtml', () => {
    it('should return sanitized HTML when description exists', () => {
      store.setState({
        dashboard: { ...initialDashboardState, coinDetail: mockDetail },
      });
      store.refreshState();
      const html = component['descriptionHtml']();
      expect(html).not.toBeNull();
    });

    it('should return null when description is empty', () => {
      const noDesc = { ...mockDetail, description: { en: '' } };
      store.setState({
        dashboard: { ...initialDashboardState, coinDetail: noDesc },
      });
      store.refreshState();
      expect(component['descriptionHtml']()).toBeNull();
    });

    it('should return null when detail is null', () => {
      expect(component['descriptionHtml']()).toBeNull();
    });
  });
});
