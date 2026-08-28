import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login - Kemetica',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./dashboard/overview/overview.component').then(m => m.OverviewComponent),
        title: 'Dashboard - Kemetica Admin',
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'Manage Users - Kemetica Admin',
      },
      {
        path: 'tours',
        loadComponent: () => import('./dashboard/tours/admin-tours.component').then(m => m.AdminToursComponent),
        title: 'Manage Tours - Kemetica Admin',
      },
      {
        path: 'categories',
        loadComponent: () => import('./dashboard/categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
        title: 'Manage Categories - Kemetica Admin',
      },
      {
        path: 'reviews',
        loadComponent: () => import('./dashboard/reviews/admin-reviews.component').then(m => m.AdminReviewsComponent),
        title: 'Manage Reviews - Kemetica Admin',
      }
    ]
  }
];
