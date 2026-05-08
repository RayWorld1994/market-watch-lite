import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TranslocoPipe } from '@jsverse/transloco';
import { DashboardActions } from '../../store/dashboard/dashboard.actions';
import { selectCoins, selectLoading, selectError } from '../../store/dashboard/dashboard.selectors';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { CoinMarket } from '../../data/model/dashboard/coin-market.interface';

@Component({
  selector: 'app-dashboard',
  imports: [AssetListComponent, AssetDetailComponent, InputTextModule, IconFieldModule, InputIconModule, TranslocoPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  private readonly allCoins = this.store.selectSignal(selectCoins);
  protected readonly loading = this.store.selectSignal(selectLoading);
  protected readonly error = this.store.selectSignal(selectError);

  protected readonly searchValue = signal('');
  protected readonly searchTerm = signal('');
  private readonly searchInput$ = new Subject<string>();

  protected readonly filteredCoins = computed<CoinMarket[]>(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const coins = this.allCoins();
    if (!term) return coins;
    return coins.filter(
      (c) => c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.loadCoins());

    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchTerm.set(value));
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
    this.searchInput$.next(value);
  }

  protected clearSearch(): void {
    this.searchValue.set('');
    this.searchTerm.set('');
    this.searchInput$.next('');
  }

  onAssetSelected(coinId: string): void {
    const coin = this.allCoins().find((c) => c.id === coinId);
    const sparkline = coin?.sparkline_in_7d?.price;
    this.store.dispatch(DashboardActions.openCoinDetail({ coinId, sparkline }));
  }
}
