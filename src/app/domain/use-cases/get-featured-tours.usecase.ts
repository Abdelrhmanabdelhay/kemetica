import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourRepository } from '../interfaces/tour.repository';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class GetFeaturedToursUseCase {
  private readonly tourRepo = inject(TourRepository);

  execute(): Observable<Tour[]> {
    return this.tourRepo.getFeaturedTours();
  }
}
