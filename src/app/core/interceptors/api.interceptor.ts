import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('kmt_token') : null;

  let modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'X-App-Client': 'Kemetica-Web',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(modifiedReq);
};
