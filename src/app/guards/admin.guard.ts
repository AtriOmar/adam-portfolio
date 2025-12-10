import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState$.pipe(
      filter((authState) => !authState.isLoading), // Wait until loading is complete
      map((authState) => {
        if (authState.isAuthenticated && authState.user && authState.user.accessId >= 3) {
          return true;
        }

        // Redirect to home if not admin
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}
