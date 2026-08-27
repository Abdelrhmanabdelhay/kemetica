import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/home/home.component').then((m) => m.HomeComponent),
    title: 'Kemetica - Luxury Egyptian Expeditions & Cultural Journeys',
  },
  {
    path: 'tours',
    loadComponent: () => import('./presentation/tours/tours.component').then((m) => m.ToursComponent),
    title: 'Curated Expeditions - Kemetica',
  },
  {
    path: 'contact',
    loadComponent: () => import('./presentation/contact/contact.component').then((m) => m.ContactComponent),
    title: 'VIP Concierge & Inquiries - Kemetica',
  },
  {
    path: 'about',
    loadComponent: () => import('./presentation/about/about').then((m) => m.About),
    title: 'About Kemetica - Born in Aswan, 2018',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
