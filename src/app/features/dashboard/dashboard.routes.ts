import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { DashboardComponent } from './dashboard.component';
import { dashboardFeature } from '../../store/dashboard/dashboard.reducer';
import * as dashboardEffects from '../../store/dashboard/dashboard.effects';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState(dashboardFeature),
      provideEffects(dashboardEffects),
    ],
    component: DashboardComponent,
  },
];
