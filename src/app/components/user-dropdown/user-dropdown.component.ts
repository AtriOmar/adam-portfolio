import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dropdown.component.html',
})
export class UserDropdownComponent {
  @Input() user!: User;
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close.emit();
    }
  }

  toggleDropdown() {
    this.toggle.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  getAvatarUrl(): string {
    if (this.user?.picture) {
      // Handle both relative and absolute URLs
      if (this.user.picture.startsWith('http')) {
        return this.user.picture;
      }
      // For relative paths from your backend
      return `http://localhost:5000${this.user.picture}`;
    }
    return '/assets/images/default-avatar.svg';
  }
}
