import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  status: string;
  results?: number;
  message: string;
  data: T;
  url?: string; // used for cloudinary upload response
  success?: boolean; // used for cloudinary upload response
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private http = inject(HttpClient);

  // --- Users ---
  getUsers(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>('/api/v1/users');
  }

  createUser(userData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/v1/users', userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`/api/v1/users/${userId}`);
  }

  // --- Reviews ---
  getReviews(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>('/api/v1/reviews');
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`/api/v1/reviews/${reviewId}`);
  }

  // --- Categories ---
  getCategories(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>('/api/v1/admin/categories');
  }

  createCategory(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/v1/admin/categories', data);
  }

  updateCategory(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`/api/v1/admin/categories/${id}`, data);
  }

  toggleCategoryStatus(id: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`/api/v1/admin/categories/${id}/toggle-status`, {});
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`/api/v1/admin/categories/${id}`);
  }

  // --- Tours ---
  createTour(tourData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/v1/tours', tourData);
  }

  updateTour(id: string, tourData: any): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`/api/v1/tours/${id}`, tourData);
  }

  deleteTour(tourId: string): Observable<any> {
    return this.http.delete(`/api/v1/tours/${tourId}`);
  }

  // --- Cloudinary Upload ---
  uploadImage(file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', file);
    // Note: The interceptor is configured to let the browser set the Content-Type for FormData
    return this.http.post<ApiResponse<any>>('/api/v1/upload', formData);
  }
}
