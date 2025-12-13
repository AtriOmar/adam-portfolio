import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  User,
  AuthState,
  CreateUserRequest,
  VerifyUserRequest,
  LoginRequest,
  CreateUserResponse,
  VerifyUserResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('-------------------- API_URL --------------------');
    console.log(this.API_URL);
    this.checkInitialAuthStatus();
  }

  private checkInitialAuthStatus() {
    this.getAuthStatus()
      .pipe(
        tap((response) => {
          this.updateAuthState(response.user);
        }),
        catchError(() => {
          this.updateAuthState(null);
          return of(null);
        })
      )
      .subscribe();
  }

  private updateAuthState(user: User | null) {
    this.authStateSubject.next({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }

  createUser(userData: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.API_URL}/api/users`, userData);
  }

  verifyUser(verificationData: VerifyUserRequest): Observable<VerifyUserResponse> {
    return this.http.put<VerifyUserResponse>(`${this.API_URL}/api/users/verify`, verificationData);
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http
      .post<User>(`${this.API_URL}/api/auth/login`, credentials, {
        withCredentials: true, // Important for session cookies
      })
      .pipe(
        tap((user) => {
          this.updateAuthState(user);
        })
      );
  }

  logout(): Observable<{ user: null }> {
    return this.http
      .post<{ user: null }>(
        `${this.API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.updateAuthState(null);
        })
      );
  }

  getAuthStatus(): Observable<{ user: User | null }> {
    return this.http.get<{ user: User | null }>(`${this.API_URL}/api/auth/status`, {
      withCredentials: true,
    });
  }

  refreshUser(): void {
    this.authStateSubject.next({
      ...this.authStateSubject.value,
      isLoading: true,
    });

    this.getAuthStatus()
      .pipe(
        tap((response) => {
          this.updateAuthState(response.user);
        }),
        catchError(() => {
          this.updateAuthState(null);
          return of(null);
        })
      )
      .subscribe();
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  isLoading(): boolean {
    return this.authStateSubject.value.isLoading;
  }
}
