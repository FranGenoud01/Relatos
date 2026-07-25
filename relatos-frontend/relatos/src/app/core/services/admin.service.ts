import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { PendingExam } from '../models/pending-exam.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getPendingExams(): Observable<{ items: PendingExam[] }> {
    return this.http.get<{ items: PendingExam[] }>(`${API_BASE_URL}/admin/exams/pending`);
  }

  approve(examId: number): Observable<{ id: number; status: string }> {
    return this.http.post<{ id: number; status: string }>(
      `${API_BASE_URL}/admin/exams/${examId}/approve`,
      {}
    );
  }

  reject(examId: number): Observable<{ id: number; status: string }> {
    return this.http.post<{ id: number; status: string }>(
      `${API_BASE_URL}/admin/exams/${examId}/reject`,
      {}
    );
  }
}
