import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonCardComponent } from './skeleton-card.component';

describe('SkeletonCardComponent', () => {
  let fixture: ComponentFixture<SkeletonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardComponent],
    })
      .overrideComponent(SkeletonCardComponent, {
        set: { imports: [], template: '<div class="skeleton-card">skeleton</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SkeletonCardComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
