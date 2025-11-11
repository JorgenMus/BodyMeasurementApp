import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('../users/users.page').then((m) => m.UsersPage),
      },
      {
        path: 'measurements',
        loadComponent: () =>
          import('../measurements/measurements.page').then((m) => m.MeasurementsPage),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('../statistics/statistics.page').then((m) => m.StatisticsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/users',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/users',
    pathMatch: 'full',
  },
];
