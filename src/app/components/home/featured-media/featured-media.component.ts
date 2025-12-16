import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Media, MediaListApiResponse } from '../../../models/media.model';

@Component({
  selector: 'app-featured-media',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-media.component.html',
})
export class FeaturedMediaComponent implements OnInit {
  private http = inject(HttpClient);

  featuredMedia: Media[] = [];
  isLoading = true;

  private readonly API_URL = environment.apiUrl;

  ngOnInit() {
    this.loadFeaturedMedia();
  }

  private loadFeaturedMedia() {
    this.http
      .get<MediaListApiResponse>(`${this.API_URL}/api/media?limit=3`)
      .pipe(
        catchError((error) => {
          console.log('Failed to fetch from backend, using fake data:', error);
          return of({
            data: [],
            meta: { currentPage: 1, totalPages: 1, totalItems: 3, itemsPerPage: 3 },
          });
        })
      )
      .subscribe((response) => {
        this.featuredMedia = response.data.slice(0, 3) as any; // Ensure only 3 items
        this.isLoading = false;
      });
  }
}
