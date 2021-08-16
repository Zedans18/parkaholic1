import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: FirebaseService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    return this.auth.user$.pipe(
      take(1),
      map(user => user ? true : false),
      tap(isLoggedIn => {
        if (!isLoggedIn)
         {
          this.router.navigateByUrl('login');
          return false;
         }
        return true;
      })
    )
  }
}
