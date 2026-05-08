import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let langChanges$: Subject<string>;
  let translocoService: {
    getActiveLang: ReturnType<typeof vi.fn>;
    setActiveLang: ReturnType<typeof vi.fn>;
    langChanges$: Subject<string>;
  };

  beforeEach(async () => {
    langChanges$ = new Subject<string>();
    translocoService = {
      getActiveLang: vi.fn().mockReturnValue('en'),
      setActiveLang: vi.fn(),
      langChanges$,
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: TranslocoService, useValue: translocoService },
      ],
    })
      .overrideComponent(HeaderComponent, {
        set: { imports: [], template: '<div></div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentLang from TranslocoService', () => {
    expect(component['currentLang']()).toBe('en');
  });

  describe('toggleDarkMode', () => {
    it('should toggle isDark signal', () => {
      expect(component['isDark']()).toBe(false);
      component.toggleDarkMode();
      expect(component['isDark']()).toBe(true);
    });

    it('should add "dark" class to html element when enabling', () => {
      component.toggleDarkMode();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should remove "dark" class when disabling', () => {
      document.documentElement.classList.add('dark');
      component['isDark'].set(true);
      component.toggleDarkMode();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('switchLocale', () => {
    it('should switch from en to es', () => {
      component['currentLang'].set('en');
      component.switchLocale();
      expect(translocoService.setActiveLang).toHaveBeenCalledWith('es');
      expect(localStorage.getItem('lang')).toBe('es');
    });

    it('should switch from es to en', () => {
      component['currentLang'].set('es');
      component.switchLocale();
      expect(translocoService.setActiveLang).toHaveBeenCalledWith('en');
      expect(localStorage.getItem('lang')).toBe('en');
    });
  });

  describe('ngOnInit', () => {
    it('should update currentLang when langChanges$ emits', () => {
      fixture.detectChanges();
      langChanges$.next('es');
      expect(component['currentLang']()).toBe('es');
    });

    it('should update document.documentElement.lang', () => {
      fixture.detectChanges();
      langChanges$.next('es');
      expect(document.documentElement.lang).toBe('es');
    });
  });
});
