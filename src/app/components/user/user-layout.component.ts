import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserHeaderComponent } from './user-header.component';
import { UserSidebarComponent } from './user-sidebar.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, UserHeaderComponent, UserSidebarComponent],
  templateUrl: './user-layout.component.html',
})
export class UserLayoutComponent {}
