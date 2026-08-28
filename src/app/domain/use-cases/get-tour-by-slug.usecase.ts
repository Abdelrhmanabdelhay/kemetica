import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourRepository } from '../interfaces/tour.repository';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class GetTourBySlugUseCase {
  private readonly tourRepo = inject(TourRepository);

  execute(slug: string): Observable<Tour | null> {
    return this.tourRepo.getTourBySlug(slug);
  }
}
