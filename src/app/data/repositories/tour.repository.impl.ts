import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TourRepository } from '../../domain/interfaces/tour.repository';
import { Tour, TourFilterOptions } from '../../domain/models/tour.model';
import { TourApiService } from '../services/tour-api.service';
import { TourMapper } from '../mappers/tour.mapper';

@Injectable({
  providedIn: 'root',
})
export class TourRepositoryImpl extends TourRepository {
  private readonly apiService = inject(TourApiService);

  override getAllTours(filters?: TourFilterOptions): Observable<Tour[]> {
    // Pass the filters directly to the backend
    return this.apiService.getTours(filters).pipe(
      map((dtos) => TourMapper.fromDtoList(dtos))
    );
  }

  override getFeaturedTours(): Observable<Tour[]> {
    return this.apiService.getFeaturedTours().pipe(
      map((dtos) => TourMapper.fromDtoList(dtos))
    );
  }

  override getSpecialTours(destination?: string): Observable<Tour[]> {
    return this.apiService.getSpecialTours(destination).pipe(
      map((dtos) => TourMapper.fromDtoList(dtos))
    );
  }

  override getTourById(id: string): Observable<Tour | null> {
    return this.apiService.getTourById(id).pipe(
      map((dto) => (dto ? TourMapper.fromDto(dto) : null))
    );
  }

  override getTourBySlug(slug: string): Observable<Tour | null> {
    return this.getTourById(slug);
  }
}
