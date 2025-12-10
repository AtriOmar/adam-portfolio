import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User, AuthState } from '../../models/user.model';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, UserDropdownComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  currentUser: User | null = null;
  isLoading = true;
  showUserMenu = false;

  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authState$.subscribe((authState: AuthState) => {
      this.currentUser = authState.user;
      this.isLoading = authState.isLoading;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.showUserMenu = false;
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }

  getAvatarUrl(): string {
    if (this.currentUser?.picture) {
      // Handle both relative and absolute URLs
      if (this.currentUser.picture.startsWith('http')) {
        return this.currentUser.picture;
      }
      // For relative paths from your backend
      return `http://localhost:5000${this.currentUser.picture}`;
    }
    return '/assets/images/default-avatar.svg';
  }
}
