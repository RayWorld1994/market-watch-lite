import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from '../../store/dashboard/dashboard.actions';
import { selectCoins, selectLoading, selectError } from '../../store/dashboard/dashboard.selectors';
import { AssetListComponent } from './components/asset-list/asset-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [AssetListComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly coins = this.store.selectSignal(selectCoins);
  protected readonly loading = this.store.selectSignal(selectLoading);
  protected readonly error = this.store.selectSignal(selectError);

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.loadCoins());
  }

  onAssetSelected(coinId: string): void {
    // Will be handled by Feature 4 (Asset Detail Modal)
    console.log('Asset selected:', coinId);
  }
}
