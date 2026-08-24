import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestinationDto } from '../dto/destination.dto';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable({
  providedIn: 'root',
})
export class DestinationApiService {
  private readonly http = inject(HttpClient);

  getDestinations(): Observable<DestinationDto[]> {
    return this.http.get<ApiResponse<DestinationDto[]>>('/api/v1/destinations').pipe(
      map(res => res.data)
    );
  }
}
