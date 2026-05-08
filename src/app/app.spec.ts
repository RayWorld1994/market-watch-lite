import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { App } from './app';

@Component({ selector: 'app-main-layout', template: '', standalone: true })
class MockMainLayoutComponent {}

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideComponent(App, {
        set: {
          imports: [MockMainLayoutComponent],
          template: '<app-main-layout />',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
