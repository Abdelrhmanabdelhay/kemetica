import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  status: string;
  data?: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Expose a synchronous way to get current user if needed
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  constructor() {
    // Restore session on app startup — cookie is sent automatically via withCredentials
    this.restoreSession().subscribe();
  }

  /**
   * Calls the /me endpoint to restore the user session from a saved token.
   */
  restoreSession(): Observable<any> {
    return this.http.get<AuthResponse>('/api/v1/auth/me').pipe(
      tap(response => {
        if (response.data && response.data.user) {
          this.currentUserSubject.next(response.data.user);
        } else {
          // Token is invalid or expired — clear it
          this.clearSession();
        }
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/v1/auth/login', credentials).pipe(
      tap(response => {
        if (response.data && response.data.user) {
          this.currentUserSubject.next(response.data.user);
        } else {
          // If the backend doesn't return user data inline, restore it via /me
          this.restoreSession().subscribe();
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post('/api/v1/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      }),
      catchError(error => {
        // Even if the backend fails (e.g., token already expired), clear local state
        this.clearSession();
        return of(null);
      })
    );
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private clearSession(): void {
    this.currentUserSubject.next(null);
  }
}

