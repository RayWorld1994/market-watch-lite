import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparklineChartComponent } from './sparkline-chart.component';

describe('SparklineChartComponent', () => {
  let fixture: ComponentFixture<SparklineChartComponent>;
  let component: SparklineChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparklineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SparklineChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('prices', []);
    fixture.componentRef.setInput('positive', true);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have a canvas element', () => {
    fixture.componentRef.setInput('prices', []);
    fixture.componentRef.setInput('positive', true);
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should clean up chart on destroy', () => {
    fixture.componentRef.setInput('prices', [100, 200, 300]);
    fixture.componentRef.setInput('positive', true);
    fixture.detectChanges();
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('should default positive to true', () => {
    fixture.componentRef.setInput('prices', []);
    fixture.detectChanges();
    expect(component.positive()).toBe(true);
  });
});
