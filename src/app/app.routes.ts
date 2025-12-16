import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MediaComponent } from './components/media/media.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogDetailComponent } from './components/blogs/blog-detail/blog-detail.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './components/admin/admin-layout.component';
import { AdminDashboardComponent } from './components/admin/dashboard/admin-dashboard.component';
import { AdminMediaComponent } from './components/admin/media/admin-media.component';
import { AdminBlogsComponent } from './components/admin/blogs/admin-blogs.component';
import { AdminBookingsComponent } from './components/admin/bookings/admin-bookings.component';
import { AdminMessagesComponent } from './components/admin/messages/admin-messages.component';
import { LayoutComponent } from './layout.component';
import { AdminUsersComponent } from './components/admin/users/admin-users.component';
import { AdminSettingsComponent } from './components/admin/settings/admin-settings.component';
import { BlogEditor } from './components/admin/blog-editor/blog-editor';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'work', component: MediaComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blogs/:id', component: BlogDetailComponent },
      { path: 'reservation', component: ReservationComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'media', component: AdminMediaComponent },
      { path: 'blogs', component: AdminBlogsComponent },
      { path: 'blogs/new', component: BlogEditor },
      { path: 'blogs/edit/:id', component: BlogEditor },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'messages', component: AdminMessagesComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ],
  },
];
