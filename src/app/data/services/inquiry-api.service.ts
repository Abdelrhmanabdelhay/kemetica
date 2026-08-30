import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InquiryPayload {
  fullName: string;
  email: string;
  phoneCountryCode?: string;
  phone?: string;
  nationality?: string;
  tourTitle?: string;
  tourSlug?: string;
  travelDateFrom?: string;
  travelDateTo?: string;
  adults?: number;
  children?: number;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class InquiryApiService {
  private http = inject(HttpClient);
  private readonly BASE = '/api/v1/inquiries';

  submit(payload: InquiryPayload): Observable<any> {
    return this.http.post(this.BASE, payload);
  }
}
