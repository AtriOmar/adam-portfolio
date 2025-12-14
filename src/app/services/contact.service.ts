import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
}

export interface ContactResponse {
  data: Contact[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ContactStatsResponse {
  data: ContactStats;
}

export interface SingleContactResponse {
  data: Contact;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/api/contact`;

  constructor(private http: HttpClient) {}

  // Get all contact messages (admin)
  getMessages(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<ContactResponse> {
    let params = new HttpParams();

    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);

    return this.http.get<ContactResponse>(`${this.apiUrl}/admin/messages`, { params });
  }

  // Get contact statistics (admin)
  getStats(): Observable<ContactStatsResponse> {
    return this.http.get<ContactStatsResponse>(`${this.apiUrl}/admin/stats`);
  }

  // Get single contact message (admin)
  getMessage(id: string): Observable<SingleContactResponse> {
    return this.http.get<SingleContactResponse>(`${this.apiUrl}/admin/messages/${id}`);
  }

  // Update message status (admin)
  updateStatus(
    id: string,
    status: 'read' | 'unread' | 'replied'
  ): Observable<SingleContactResponse> {
    return this.http.put<SingleContactResponse>(`${this.apiUrl}/admin/messages/${id}/status`, {
      status,
    });
  }

  // Submit contact form (public)
  submitMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
}
