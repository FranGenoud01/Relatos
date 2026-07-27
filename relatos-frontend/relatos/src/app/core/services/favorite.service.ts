import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { FavoriteExam, FavoriteStatus } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: HttpClient) {}

  getStatus(examId: number): Observable<FavoriteStatus> {
    return this.http.get<FavoriteStatus>(`${API_BASE_URL}/exams/${examId}/favorite`);
  }

  add(examId: number): Observable<FavoriteStatus> {
    return this.http.post<FavoriteStatus>(`${API_BASE_URL}/exams/${examId}/favorite`, {});
  }

  remove(examId: number): Observable<FavoriteStatus> {
    return this.http.delete<FavoriteStatus>(`${API_BASE_URL}/exams/${examId}/favorite`);
  }

  getMine(): Observable<{ items: FavoriteExam[] }> {
    return this.http.get<{ items: FavoriteExam[] }>(`${API_BASE_URL}/favorites`);
  }
}
