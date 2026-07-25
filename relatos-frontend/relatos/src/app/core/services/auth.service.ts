import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { AuthResponse, User } from '../models/user.model';

export const TOKEN_STORAGE_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (this.isBrowser && this.getToken()) {
      this.restoreSession();
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/register`, { name, email, password })
      .pipe(tap((res) => this.storeSession(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    this.currentUserSubject.next(null);
  }

  private restoreSession(): void {
    this.http.get<User>(`${API_BASE_URL}/auth/me`).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.logout(),
    });
  }

  private storeSession(res: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    }
    this.currentUserSubject.next(res.user);
  }
}
