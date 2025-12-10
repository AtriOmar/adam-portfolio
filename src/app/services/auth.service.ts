import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface VerifyUserRequest {
  token: string;
  otp: string;
}

export interface CreateUserResponse {
  data: {
    type: string;
    attributes: {
      token: string;
    };
  };
}

export interface VerifyUserResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      username: string;
      email: string;
      picture: string;
      active: number;
      accessId: number;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createUser(userData: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.API_URL}/users`, userData);
  }

  verifyUser(verificationData: VerifyUserRequest): Observable<VerifyUserResponse> {
    return this.http.put<VerifyUserResponse>(`${this.API_URL}/users/verify`, verificationData);
  }
}
