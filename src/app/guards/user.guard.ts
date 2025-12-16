import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState$.pipe(
      filter((authState) => !authState.isLoading), // Wait until loading is complete
      map((authState) => {
        if (authState.isAuthenticated && authState.user && authState.user.accessId == 1) {
          return true;
        }

        // Redirect to login if not authenticated
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
