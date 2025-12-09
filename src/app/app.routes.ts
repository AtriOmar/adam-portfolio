import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MediaComponent } from './components/media/media.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'media', component: MediaComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'contact', component: ContactComponent },
];
