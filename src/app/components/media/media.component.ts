import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

interface MediaItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit {
  private http = inject(HttpClient);

  mediaItems: MediaItem[] = [];
  isLoading = true;

  private readonly BACKEND_URL = 'http://localhost:3000'; // Change this to your backend URL

  private readonly fakeData: MediaItem[] = [
    {
      id: '1',
      title: 'Portrait Session #1',
      imageUrl:
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '2',
      title: 'Fashion Photography',
      imageUrl:
        'https://images.unsplash.com/photo-1559070104-51892ffb72f3?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '3',
      title: 'Creative Portrait',
      imageUrl:
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '4',
      title: 'Studio Session',
      imageUrl:
        'https://images.unsplash.com/photo-1610878180933-022a5c4fdc0c?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '5',
      title: 'Outdoor Portrait',
      imageUrl:
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '6',
      title: 'Professional Headshot',
      imageUrl:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    },
  ];

  ngOnInit() {
    this.loadMediaItems();
  }

  private loadMediaItems() {
    this.http
      .get<MediaItem[]>(`${this.BACKEND_URL}/api/media`)
      .pipe(
        catchError((error) => {
          console.log('Failed to fetch from backend, using fake data:', error);
          return of(this.fakeData);
        })
      )
      .subscribe((data) => {
        this.mediaItems = data && data.length > 0 ? data : this.fakeData;
        this.isLoading = false;
      });
  }
}
