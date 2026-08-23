import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourRepository } from '../interfaces/tour.repository';
import { Tour, TourFilterOptions } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class GetToursUseCase {
  private readonly tourRepo = inject(TourRepository);

  execute(filters?: TourFilterOptions): Observable<Tour[]> {
    return this.tourRepo.getAllTours(filters);
  }
}
