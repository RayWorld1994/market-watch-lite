import {
  Component,
  ElementRef,
  effect,
  input,
  viewChild,
  OnDestroy,
} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

@Component({
  selector: 'app-sparkline-chart',
  imports: [],
  template: `<canvas #canvas class="h-full w-full"></canvas>`,
})
export class SparklineChartComponent implements OnDestroy {
  readonly prices = input.required<number[]>();
  readonly positive = input(true);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      const prices = this.prices();
      const canvas = this.canvasRef();
      if (!canvas || prices.length === 0) return;
      this.renderChart(canvas.nativeElement, prices);
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(canvas: HTMLCanvasElement, prices: number[]): void {
    this.chart?.destroy();

    const positive = this.positive();
    const lineColor = positive ? '#22c55e' : '#ef4444';
    const fillColor = positive ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';

    const labels = prices.map((_, i) => String(i));

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: prices,
            borderColor: lineColor,
            backgroundColor: fillColor,
            borderWidth: 1.5,
            fill: true,
            pointRadius: 0,
            pointHitRadius: 6,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (ctx) => `$${Number(ctx.raw).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              title: () => '',
            },
          },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
      },
    });
  }
}
