import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Media,
  MediaListApiResponse,
  MediaApiResponse,
  CreateMediaDto,
  UpdateMediaDto,
  MediaFilters,
} from '../models/media.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all media with filtering and pagination
   */
  getAllMedia(filters: MediaFilters = {}): Observable<{ data: Media[]; meta: any }> {
    let params = new HttpParams();

    if (filters.category) params = params.set('category', filters.category);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.featured !== undefined)
      params = params.set('featured', filters.featured.toString());
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<MediaListApiResponse>(this.API_URL + '/api/media', { params });
  }

  /**
   * Get single media by ID
   */
  getMediaById(id: string): Observable<{ data: Media }> {
    return this.http.get<MediaApiResponse>(`${this.API_URL}/api/media/${id}`);
  }

  /**
   * Create new media
   */
  createMedia(mediaData: CreateMediaDto): Observable<{ data: Media }> {
    return this.http.post<MediaApiResponse>(`${this.API_URL}/api/media`, mediaData);
  }

  /**
   * Update existing media
   */
  updateMedia(id: string, mediaData: UpdateMediaDto): Observable<{ data: Media }> {
    return this.http.put<MediaApiResponse>(`${this.API_URL}/api/media/${id}`, mediaData);
  }

  /**
   * Delete media
   */
  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/media/${id}`);
  }
}
