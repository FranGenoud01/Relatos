import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { ExamComment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  getAll(examId: number): Observable<{ items: ExamComment[] }> {
    return this.http.get<{ items: ExamComment[] }>(`${API_BASE_URL}/exams/${examId}/comments`);
  }

  create(examId: number, text: string): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${API_BASE_URL}/exams/${examId}/comments`, { text });
  }
}
