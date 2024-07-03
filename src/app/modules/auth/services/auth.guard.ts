import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.user;
    const currentToken = this.authService.token;
    let expiration = JSON.parse(atob(currentToken.split('.')[1])).exp;

    if (!currentUser || !currentToken) {
      this.authService.logout();
      return false;
    }

    if (Math.floor(new Date().getTime() / 1000) >= expiration) {
      this.authService.logout();
      return false;
    }

    return true;
  }
}
