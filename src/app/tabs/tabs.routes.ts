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
        path: 'user-create',  // form - when creating a new user
        loadComponent: () =>
          import('../user-create/user-create.page').then((m) => m.UserCreatePage),
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
