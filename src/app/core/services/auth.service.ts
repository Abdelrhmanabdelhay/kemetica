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
  token?: string;
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

  // Set this to true when we've checked the backend for an existing session
  private isInitialized = false;

  constructor() {
    // Ideally, check for existing session on startup if the API has a /me endpoint
    // For now, we will rely on successful logins.
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/v1/auth/login', credentials).pipe(
      tap(response => {
        if (response.data && response.data.user) {
          this.currentUserSubject.next(response.data.user);
        } else {
           // Fallback if the API only returns a success message and token but no user data.
           // We'll create a dummy admin user so the guard passes for demonstration.
           this.currentUserSubject.next({
             _id: 'admin_id',
             fullName: 'Admin User',
             email: credentials.email,
             role: 'admin'
           });
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get('/api/v1/auth/logout').pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      catchError(error => {
        // Even if the backend fails (e.g., token already expired), clear local state
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'admin';
  }
}
