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
      { path: 'home', component: HomeComponent, title: 'Home | Khlif Adam' },
      { path: 'work', component: MediaComponent, title: 'Work | Khlif Adam' },
      { path: 'blogs', component: BlogsComponent, title: 'Blogs | Khlif Adam' },
      {
        path: 'blogs/:id',
        component: BlogDetailComponent,
        title: 'Blog Detail | Khlif Adam',
      },
      {
        path: 'reservation',
        component: ReservationComponent,
        title: 'Reservation | Khlif Adam',
      },
      { path: 'contact', component: ContactComponent, title: 'Contact | Khlif Adam' },
      { path: 'register', component: RegisterComponent, title: 'Register | Khlif Adam' },
      { path: 'login', component: LoginComponent, title: 'Login | Khlif Adam' },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        title: 'Admin Dashboard | Khlif Adam',
      },
      {
        path: 'media',
        component: AdminMediaComponent,
        title: 'Admin Media | Khlif Adam',
      },
      {
        path: 'blogs',
        component: AdminBlogsComponent,
        title: 'Admin Blogs | Khlif Adam',
      },
      { path: 'blogs/new', component: BlogEditor, title: 'New Blog | Khlif Adam' },
      { path: 'blogs/edit/:id', component: BlogEditor, title: 'Edit Blog | Khlif Adam' },
      {
        path: 'bookings',
        component: AdminBookingsComponent,
        title: 'Admin Bookings | Khlif Adam',
      },
      {
        path: 'messages',
        component: AdminMessagesComponent,
        title: 'Admin Messages | Khlif Adam',
      },
      {
        path: 'users',
        component: AdminUsersComponent,
        title: 'Admin Users | Khlif Adam',
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        title: 'Admin Settings | Khlif Adam',
      },
    ],
  },
];
