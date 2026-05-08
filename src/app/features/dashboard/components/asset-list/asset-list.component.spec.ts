import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTransloco, TranslocoTestingModule } from '@jsverse/transloco';
import { AssetListComponent } from './asset-list.component';
import { CoinMarket } from '../../../../data/model/dashboard/coin-market.interface';

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
};

describe('AssetListComponent', () => {
  let fixture: ComponentFixture<AssetListComponent>;
  let component: AssetListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AssetListComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: { assetList: { emptyTitle: 'No assets found', emptyMessage: 'Nothing to show' } } },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('coins', []);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show skeleton cards when loading', () => {
    fixture.componentRef.setInput('coins', []);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const skeletons = el.querySelectorAll('app-skeleton-card');
    expect(skeletons.length).toBe(10);
  });

  it('should show empty state when no coins and not loading', () => {
    fixture.componentRef.setInput('coins', []);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No assets found');
  });

  it('should render asset cards when coins are present', () => {
    fixture.componentRef.setInput('coins', [mockCoin]);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('app-asset-card');
    expect(cards.length).toBe(1);
  });

  it('should have 10 skeleton slots', () => {
    expect(component['skeletonSlots'].length).toBe(10);
  });
});
