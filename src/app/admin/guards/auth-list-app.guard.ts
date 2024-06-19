import { CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';

export const authListAppGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const tokenLogin = tokenService.getToken();
  if (!tokenLogin) {
    router.navigate(['/page-not-found']);
    return false;
  }
  return true;
};
