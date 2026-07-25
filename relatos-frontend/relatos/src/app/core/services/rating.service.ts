import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { RatingSummary } from '../models/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(private http: HttpClient) {}

  getSummary(examId: number): Observable<RatingSummary> {
    return this.http.get<RatingSummary>(`${API_BASE_URL}/exams/${examId}/ratings`);
  }

  rate(examId: number, stars: number): Observable<RatingSummary> {
    return this.http.put<RatingSummary>(`${API_BASE_URL}/exams/${examId}/ratings`, { stars });
  }
}
