import { Component, signal, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, TranslocoPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  private readonly transloco = inject(TranslocoService);

  protected readonly isDark = signal(false);
  protected readonly currentLang = signal(this.transloco.getActiveLang());

  ngOnInit(): void {
    this.isDark.set(document.documentElement.classList.contains('dark'));

    this.transloco.langChanges$.subscribe((lang) => {
      this.currentLang.set(lang);
      document.documentElement.lang = lang;
    });
  }

  toggleDarkMode(): void {
    const html = document.documentElement;
    const dark = !this.isDark();
    this.isDark.set(dark);

    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  switchLocale(): void {
    const target = this.currentLang() === 'es' ? 'en' : 'es';
    this.transloco.setActiveLang(target);
    localStorage.setItem('lang', target);
  }
}
