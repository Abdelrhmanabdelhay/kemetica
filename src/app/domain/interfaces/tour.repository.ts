import { Observable } from 'rxjs';
import { Tour, TourFilterOptions } from '../models/tour.model';

export abstract class TourRepository {
  abstract getAllTours(filters?: TourFilterOptions): Observable<Tour[]>;
  abstract getFeaturedTours(): Observable<Tour[]>;
  abstract getSpecialTours(destination?: string): Observable<Tour[]>;
  abstract getTourById(id: string): Observable<Tour | null>;
  abstract getTourBySlug(slug: string): Observable<Tour | null>;
}
