import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlrtifyService } from '../services/alrtify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertify: AlrtifyService) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.firstChild.data['roles']as Array<string>;
      if (roles) {
        const match = this.authService.roleMatch(roles);
        if (match) {
          return true;
        } else {
          this.router.navigate(['members']);
          this.alertify.error('You are not authorised to access this area');
        }
      }
      if (this.authService.loggedIn()) {
        return true;
      }

      this.alertify.error('You need to be logged in to access this area');
      this.router.navigate(['/home']);
      return false;
  }
}
