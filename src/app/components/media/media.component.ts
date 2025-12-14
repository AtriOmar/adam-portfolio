import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Media, MediaListApiResponse } from '../../models/media.model';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit {
  private http = inject(HttpClient);

  mediaItems: Media[] = [];
  isLoading = true;

  private readonly API_URL = environment.apiUrl;

  ngOnInit() {
    this.loadMediaItems();
  }

  private loadMediaItems() {
    this.http
      .get<MediaListApiResponse>(`${this.API_URL}/api/media`)
      .pipe(
        catchError((error) => {
          console.log('Failed to fetch from backend, using fake data:', error);
          return of({
            data: [],
            meta: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
          });
        })
      )
      .subscribe((response) => {
        if (response.data && response.data.length > 0) {
          this.mediaItems = response.data;
        } else {
          this.mediaItems = [];
        }
        this.isLoading = false;
      });
  }
}
