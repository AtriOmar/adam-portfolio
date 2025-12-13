import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog, BlogResponse, BlogStats } from '../models/blog.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/api/blogs`;

  constructor(private http: HttpClient) {}

  getBlogs(params?: {
    page?: number;
    limit?: number;
    category?: string;
    published?: boolean;
    featured?: boolean;
    author?: string;
  }): Observable<BlogResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<BlogResponse>(this.apiUrl, { params: httpParams });
  }

  getBlog(id: string): Observable<{ data: Blog }> {
    return this.http.get<{ data: Blog }>(`${this.apiUrl}/${id}`);
  }

  getBlogBySlug(slug: string): Observable<{ data: Blog }> {
    return this.http.get<{ data: Blog }>(`${this.apiUrl}/slug/${slug}`);
  }

  createBlog(blogData: any): Observable<{ data: Blog }> {
    return this.http.post<{ data: Blog }>(this.apiUrl, blogData);
  }

  updateBlog(id: string, blogData: any): Observable<{ data: Blog }> {
    return this.http.put<{ data: Blog }>(`${this.apiUrl}/${id}`, blogData);
  }

  deleteBlog(id: string): Observable<{ data: Blog }> {
    return this.http.delete<{ data: Blog }>(`${this.apiUrl}/${id}`);
  }

  getBlogStats(): Observable<BlogStats> {
    // This would calculate stats from the blog data
    return this.http.get<BlogStats>(`${this.apiUrl}/stats`);
  }
}
