import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationApiService } from '../../data/services/destination-api.service';
import { Destination } from '../models/destination.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetDestinationsUseCase {
  private readonly apiService = inject(DestinationApiService);

  execute(): Observable<Destination[]> {
    const prependUrl = (url: string) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return url.startsWith('/') ? `${environment.backendUrl}${url}` : `${environment.backendUrl}/${url}`;
    };

    return this.apiService.getDestinations().pipe(
      map(dtos => dtos.map(dto => ({
        id: dto._id,
        slug: dto.slug,
        name: dto.name,
        iconUrl: prependUrl(dto.iconUrl),
        toursCount: dto.toursCount || 0
      })))
    );
  }
}
