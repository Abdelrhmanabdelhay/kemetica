import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TourDto } from '../dto/tour.dto';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private readonly http = inject(HttpClient);

  getTours(filters?: any): Observable<TourDto[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        params = params.set('category', filters.category);
      }
      if (filters.maxPrice) {
        params = params.set('maxPrice', filters.maxPrice.toString());
      }
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        params = params.set('q', filters.searchQuery.trim());
      }
      if (filters.sub_type) {
        params = params.set('sub_type', filters.sub_type);
      }
      if (filters.tour_type) {
        params = params.set('tour_type', filters.tour_type);
      }
      if (filters.destination) {
        params = params.set('destination', filters.destination);
      }
    }

    return this.http.get<ApiResponse<TourDto[]>>('/api/v1/tours', { params }).pipe(
      map(res => res.data)
    );
  }

  getFeaturedTours(): Observable<TourDto[]> {
    return this.http.get<ApiResponse<TourDto[]>>('/api/v1/tours/featured').pipe(
      map(res => res.data)
    );
  }

  getSpecialTours(destination?: string): Observable<TourDto[]> {
    let params = new HttpParams();
    if (destination) {
      params = params.set('destination', destination);
    }
    return this.http.get<ApiResponse<TourDto[]>>('/api/v1/tours/special', { params }).pipe(
      map(res => res.data)
    );
  }

  getPopularTours(): Observable<TourDto[]> {
    return this.http.get<ApiResponse<TourDto[]>>('/api/v1/tours/popular').pipe(
      map(res => res.data)
    );
  }

  getTourById(id: string): Observable<TourDto | undefined> {
    return this.http.get<ApiResponse<TourDto>>(`/api/v1/tours/${id}`).pipe(
      map(res => res.data)
    );
  }

  getReviews(tourId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`/api/v1/tours/${tourId}/reviews`).pipe(
      map(res => res.data)
    );
  }

  addAnonymousReview(tourId: string, authorName: string, rating: number, comment: string) {
    const payload = {
      authorName: authorName,
      rating: rating,
      comment: comment
    };
    
    return this.http.post<ApiResponse<any>>(`/api/v1/tours/${tourId}/reviews`, payload);
  }
}
