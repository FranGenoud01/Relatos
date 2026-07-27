import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.ready$.pipe(
    filter((ready) => ready),
    take(1),
    map(() => {
      if (auth.currentUser?.isAdmin) {
        return true;
      }
      router.navigate(['/estudiar']);
      return false;
    })
  );
};
