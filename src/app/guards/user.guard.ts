import { Injectable, Pipe } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): any {
    if(this.obtenerDatos("username") && this.obtenerDatos("user_role")){
      return true;
    }else{
      this.router.navigate(['/inicio'])
      return false;
    }
  }

  obtenerDatos(dataObtener) {
    return localStorage.getItem(dataObtener);
  }

}
