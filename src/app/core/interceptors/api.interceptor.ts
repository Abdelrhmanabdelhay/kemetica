import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Use the backend base URL from environment for API requests
  const baseUrl = 'https://pants-similar-sea-lion.abasthan.app';

  // Clone the request to modify it
  let modifiedReq = req;

  // If the request starts with /api, prepend the base URL
  if (req.url.startsWith('/api')) {
    // If we're uploading a file (FormData), don't set the Content-Type header.
    // The browser will automatically set it to multipart/form-data with the correct boundary.
    const isFormData = req.body instanceof FormData;

    let headers = req.headers.set('X-App-Client', 'Kemetica-Web');
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    modifiedReq = req.clone({
      url: `${baseUrl}${req.url}`,
      withCredentials: true, // Send HttpOnly cookies for authentication
      headers: headers,
    });
  }

  loadingService.show();

  return next(modifiedReq).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
