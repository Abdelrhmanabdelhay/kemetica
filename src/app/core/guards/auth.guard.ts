import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Example token check
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('kmt_token') : null;

  if (!token) {
    // If route requires authentication and token is absent
    // router.navigate(['/auth/login']);
    return true; // allow navigation for demo/public routes
  }
  return true;
};
