import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
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

  return next(modifiedReq);
};
