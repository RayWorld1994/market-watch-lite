import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CoinMarket } from '../../../../data/model/dashboard/coin-market.interface';
import { AssetCardComponent } from '../asset-card/asset-card.component';
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-asset-list',
  imports: [AssetCardComponent, SkeletonCardComponent, TranslocoPipe],
  templateUrl: './asset-list.component.html',
})
export class AssetListComponent {
  readonly coins = input.required<CoinMarket[]>();
  readonly loading = input(false);
  readonly assetSelected = output<string>();

  protected readonly skeletonSlots = Array.from({ length: 10 });
}
