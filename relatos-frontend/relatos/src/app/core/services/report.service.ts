import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ReportReason } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  create(examId: number, reason: ReportReason, comment?: string): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${API_BASE_URL}/exams/${examId}/report`, {
      reason,
      comment,
    });
  }
}
