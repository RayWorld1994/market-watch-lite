import { Component, signal, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  protected readonly isDark = signal(false);

  ngOnInit(): void {
    this.isDark.set(document.documentElement.classList.contains('dark'));
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
}
