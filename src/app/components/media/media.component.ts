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

  private readonly fakeData: Media[] = [
    {
      _id: '1',
      title: 'Portrait Session #1',
      url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
      description: 'Professional portrait photography session',
      type: 'image',
      category: 'portrait',
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '2',
      title: 'Fashion Photography',
      url: 'https://images.unsplash.com/photo-1559070104-51892ffb72f3?auto=format&fit=crop&w=900&q=80',
      description: 'High-fashion editorial shoot',
      type: 'image',
      category: 'portrait',
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '3',
      title: 'Creative Portrait',
      url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      description: 'Artistic portrait with creative lighting',
      type: 'image',
      category: 'portrait',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '4',
      title: 'Studio Session',
      url: 'https://images.unsplash.com/photo-1610878180933-022a5c4fdc0c?auto=format&fit=crop&w=900&q=80',
      description: 'Professional studio photography',
      type: 'image',
      category: 'portrait',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '5',
      title: 'Outdoor Portrait',
      url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80',
      description: 'Natural light outdoor session',
      type: 'image',
      category: 'portrait',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '6',
      title: 'Professional Headshot',
      url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      description: 'Corporate headshot photography',
      type: 'image',
      category: 'portrait',
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

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
          this.mediaItems = response.data.map((item) => ({
            _id: item.id,
            title: item.attributes.title,
            url: item.attributes.url,
            thumbnail: item.attributes.thumbnail,
            description: item.attributes.description,
            type: item.attributes.type,
            category: item.attributes.category,
            featured: item.attributes.featured,
            createdAt: new Date(item.attributes.createdAt),
            updatedAt: new Date(item.attributes.updatedAt),
          }));
        } else {
          this.mediaItems = this.fakeData;
        }
        this.isLoading = false;
      });
  }
}
