import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { CoinMarket } from '../../../../data/model/dashboard/coin-market.interface';

@Component({
  selector: 'app-asset-card',
  imports: [CurrencyPipe, DecimalPipe, NgClass],
  templateUrl: './asset-card.component.html',
  styleUrl: './asset-card.component.css',
})
export class AssetCardComponent {
  readonly coin = input.required<CoinMarket>();
  readonly selected = output<string>();

  onSelect(): void {
    this.selected.emit(this.coin().id);
  }
}
