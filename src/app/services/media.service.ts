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
  getAllMedia(filters: MediaFilters = {}): Observable<{ media: Media[]; meta: any }> {
    let params = new HttpParams();

    if (filters.category) params = params.set('category', filters.category);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.featured !== undefined)
      params = params.set('featured', filters.featured.toString());
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<MediaListApiResponse>(this.API_URL + '/api/media', { params }).pipe(
      map((response) => ({
        media: response.data.map((item) => this.transformApiMediaToMedia(item)),
        meta: response.meta,
      }))
    );
  }

  /**
   * Get single media by ID
   */
  getMediaById(id: string): Observable<Media> {
    return this.http
      .get<MediaApiResponse>(`${this.API_URL}/api/media/${id}`)
      .pipe(map((response) => this.transformApiMediaToMedia(response.data)));
  }

  /**
   * Create new media
   */
  createMedia(mediaData: CreateMediaDto): Observable<Media> {
    return this.http
      .post<MediaApiResponse>(`${this.API_URL}/api/media`, mediaData)
      .pipe(map((response) => this.transformApiMediaToMedia(response.data)));
  }

  /**
   * Update existing media
   */
  updateMedia(id: string, mediaData: UpdateMediaDto): Observable<Media> {
    return this.http
      .put<MediaApiResponse>(`${this.API_URL}/api/media/${id}`, mediaData)
      .pipe(map((response) => this.transformApiMediaToMedia(response.data)));
  }

  /**
   * Delete media
   */
  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/media/${id}`);
  }

  /**
   * Transform API response data to Media interface
   */
  private transformApiMediaToMedia(apiData: any): Media {
    return {
      _id: apiData.id,
      title: apiData.attributes.title,
      description: apiData.attributes.description,
      type: apiData.attributes.type,
      url: apiData.attributes.url,
      thumbnail: apiData.attributes.thumbnail,
      category: apiData.attributes.category,
      featured: apiData.attributes.featured,
      createdAt: new Date(apiData.attributes.createdAt),
      updatedAt: new Date(apiData.attributes.updatedAt),
    };
  }
}
