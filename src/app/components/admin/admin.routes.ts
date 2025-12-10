import { Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminMediaComponent } from './media/admin-media.component';
import { AdminBlogsComponent } from './blogs/admin-blogs.component';
import { AdminBookingsComponent } from './bookings/admin-bookings.component';
import { AdminMessagesComponent } from './messages/admin-messages.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminSettingsComponent } from './settings/admin-settings.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'media',
        component: AdminMediaComponent,
      },
      {
        path: 'blogs',
        component: AdminBlogsComponent,
      },
      {
        path: 'bookings',
        component: AdminBookingsComponent,
      },
      {
        path: 'messages',
        component: AdminMessagesComponent,
      },
      {
        path: 'users',
        component: AdminUsersComponent,
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
      },
    ],
  },
];
