import { Component, computed, inject, signal, SecurityContext } from '@angular/core';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { DashboardActions } from '../../../../store/dashboard/dashboard.actions';
import {
  selectCoinDetail,
  selectCoinDetailError,
  selectCoinDetailLoading,
  selectDetailModalOpen,
  selectSparkline,
} from '../../../../store/dashboard/dashboard.selectors';
import { CoinDetail } from '../../../../data/model/dashboard/coin-detail.interface';
import { TranslocoPipe } from '@jsverse/transloco';
import { SparklineChartComponent } from '../../../../shared/components/sparkline-chart/sparkline-chart.component';

function pickLocalizedDescription(desc: Record<string, string> | undefined): string {
  if (!desc || typeof desc !== 'object') return '';
  const en = desc['en'];
  if (en?.trim()) return en;
  const first = Object.values(desc).find((v) => typeof v === 'string' && v.trim());
  return first ?? '';
}

function formatCompact(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

@Component({
  selector: 'app-asset-detail',
  imports: [DialogModule, Skeleton, CurrencyPipe, DecimalPipe, NgClass, SparklineChartComponent, TranslocoPipe],
  templateUrl: './asset-detail.component.html',
})
export class AssetDetailComponent {
  private readonly store = inject(Store);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly visible = this.store.selectSignal(selectDetailModalOpen);
  protected readonly loading = this.store.selectSignal(selectCoinDetailLoading);
  protected readonly detail = this.store.selectSignal(selectCoinDetail);
  protected readonly detailError = this.store.selectSignal(selectCoinDetailError);
  protected readonly sparkline = this.store.selectSignal(selectSparkline);

  protected readonly isNarrow = signal(
    typeof globalThis !== 'undefined' &&
      'matchMedia' in globalThis &&
      globalThis.matchMedia('(max-width: 767px)').matches,
  );

  protected readonly dialogStyle = computed(() =>
    this.isNarrow()
      ? ({ width: '100vw', height: '100dvh', maxHeight: '100dvh' } as const)
      : ({ width: '600px', maxWidth: 'calc(100vw - 2rem)', maxHeight: '90dvh' } as const),
  );

  protected readonly descriptionHtml = computed((): SafeHtml | null => {
    const d = this.detail();
    const raw = pickLocalizedDescription(d?.description);
    if (!raw.trim()) return null;
    const cleaned = this.sanitizer.sanitize(SecurityContext.HTML, raw) ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  });

  protected readonly descriptionExpanded = signal(false);

  protected readonly isPricePositive = computed(() => {
    const d = this.detail();
    return (d?.market_data?.price_change_percentage_24h ?? 0) >= 0;
  });

  constructor() {
    if (typeof globalThis !== 'undefined' && 'matchMedia' in globalThis) {
      const mq = globalThis.matchMedia('(max-width: 767px)');
      mq.addEventListener('change', () => this.isNarrow.set(mq.matches));
    }
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.close();
    }
  }

  close(): void {
    this.store.dispatch(DashboardActions.closeCoinDetail());
    this.descriptionExpanded.set(false);
  }

  toggleDescription(): void {
    this.descriptionExpanded.update((v) => !v);
  }

  protected usd(data: Record<string, number> | undefined): number | null {
    return data?.['usd'] ?? null;
  }

  protected compact(value: number | null): string {
    if (value == null) return '—';
    return formatCompact(value);
  }
}
