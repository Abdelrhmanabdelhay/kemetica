import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Use localhost:3000 as the backend base URL for API requests
  const baseUrl = 'http://localhost:3000';
  
  // Clone the request to modify it
  let modifiedReq = req;

  // If the request starts with /api, prepend the base URL
  if (req.url.startsWith('/api')) {
    modifiedReq = req.clone({
      url: `${baseUrl}${req.url}`,
      withCredentials: true, // Send HttpOnly cookies for authentication
      setHeaders: {
        'Content-Type': 'application/json',
        'X-App-Client': 'Kemetica-Web',
      },
    });
  }

  loadingService.show();

  return next(modifiedReq).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
