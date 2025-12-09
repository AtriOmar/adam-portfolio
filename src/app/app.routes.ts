import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MediaComponent } from './components/media/media.component';
import { BlogsComponent } from './components/blogs/blogs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'media', component: MediaComponent },
  { path: 'blogs', component: BlogsComponent },
  // Future routes for other pages
  // { path: 'about', component: AboutComponent },
  // { path: 'contact', component: ContactComponent },
];
