import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

@Component({ selector: 'app-header', template: '', standalone: true })
class MockHeaderComponent {}

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let component: MainLayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
    })
      .overrideComponent(MainLayoutComponent, {
        set: {
          imports: [MockHeaderComponent, RouterOutlet],
          template: '<app-header /><main><router-outlet /></main>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
