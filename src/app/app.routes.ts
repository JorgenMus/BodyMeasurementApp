import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.page').then( m => m.UsersPage)
  },
  {
    path: 'measurements',
    loadComponent: () => import('./measurements/measurements.page').then( m => m.MeasurementsPage)
  },
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.page').then( m => m.StatisticsPage)
  },  {
    path: 'user-create',
    loadComponent: () => import('./user-create/user-create.page').then( m => m.UserCreatePage)
  },

];
