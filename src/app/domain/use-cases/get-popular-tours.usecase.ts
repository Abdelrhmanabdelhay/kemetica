import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TourApiService } from '../../data/services/tour-api.service';
import { TourMapper } from '../../data/mappers/tour.mapper';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class GetPopularToursUseCase {
  private readonly tourApiService = inject(TourApiService);

  execute(): Observable<Tour[]> {
    return this.tourApiService.getPopularTours().pipe(
      map(dtos => TourMapper.fromDtoList(dtos))
    );
  }
}
