// auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.getIsAuth();

  if (!isAuth) {
    router.navigate(['/auth/login']);
  }

  return isAuth;
};
