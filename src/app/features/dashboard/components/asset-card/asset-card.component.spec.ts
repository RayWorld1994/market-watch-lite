import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetCardComponent } from './asset-card.component';
import { CoinMarket } from '../../../../data/model/dashboard/coin-market.interface';

const mockCoin: CoinMarket = {
  id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://example.com/btc.png',
  current_price: 50000, market_cap: 1e12, market_cap_rank: 1,
  fully_diluted_valuation: null, total_volume: 3e10,
  high_24h: 51000, low_24h: 49000, price_change_24h: 500,
  price_change_percentage_24h: 1.01, market_cap_change_24h: 5e9,
  market_cap_change_percentage_24h: 0.5, circulating_supply: 19e6,
  total_supply: 21e6, max_supply: 21e6, ath: 69000,
  ath_change_percentage: -27, ath_date: '', atl: 67,
  atl_change_percentage: 74000, atl_date: '', last_updated: '',
};

describe('AssetCardComponent', () => {
  let fixture: ComponentFixture<AssetCardComponent>;
  let component: AssetCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('coin', mockCoin);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the coin name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Bitcoin');
  });

  it('should display the coin symbol', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('btc');
  });

  it('should emit selected event with coin id on click', () => {
    const emitSpy = vi.spyOn(component.selected, 'emit');
    component.onSelect();
    expect(emitSpy).toHaveBeenCalledWith('bitcoin');
  });

  it('should apply green class for positive price change', () => {
    const el: HTMLElement = fixture.nativeElement;
    const changeEl = el.querySelector('.text-green-600');
    expect(changeEl).toBeTruthy();
  });

  it('should apply red class for negative price change', () => {
    const negativeCoin = { ...mockCoin, price_change_percentage_24h: -2.5 };
    fixture.componentRef.setInput('coin', negativeCoin);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const changeEl = el.querySelector('.text-red-600');
    expect(changeEl).toBeTruthy();
  });
});
