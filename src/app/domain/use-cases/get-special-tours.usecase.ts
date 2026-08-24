import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourRepository } from '../interfaces/tour.repository';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class GetSpecialToursUseCase {
  private readonly repository = inject(TourRepository);

  execute(destination?: string): Observable<Tour[]> {
    return this.repository.getSpecialTours(destination);
  }
}
