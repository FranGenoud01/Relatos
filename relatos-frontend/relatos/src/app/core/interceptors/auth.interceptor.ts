import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TOKEN_STORAGE_KEY } from '../services/auth.service';

// Lee el token directo de localStorage en vez de inyectar AuthService: AuthService
// llama a http.get() en su propio constructor (para restaurar la sesión), y eso
// dispara este interceptor mientras AuthService todavía se está construyendo —
// inyectarlo acá causaría NG0200 (dependencia circular).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const token = isBrowser ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

  if (!token) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
