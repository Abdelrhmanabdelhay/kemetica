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
    return this.apiService.getTours().pipe(
      map((dtos) => {
        let list = TourMapper.fromDtoList(dtos);
        if (filters?.category && filters.category !== 'all') {
          list = list.filter((t) => t.category === filters.category);
        }
        if (filters?.maxPrice) {
          list = list.filter((t) => t.price <= (filters.maxPrice ?? Infinity));
        }
        if (filters?.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          list = list.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.tagline.toLowerCase().includes(q) ||
              t.location.city.toLowerCase().includes(q)
          );
        }
        return list;
      })
    );
  }

  override getFeaturedTours(): Observable<Tour[]> {
    return this.apiService.getTours().pipe(
      map((dtos) => TourMapper.fromDtoList(dtos.filter((d) => d.is_featured)))
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
