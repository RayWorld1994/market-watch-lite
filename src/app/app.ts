import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [ToastModule, MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
