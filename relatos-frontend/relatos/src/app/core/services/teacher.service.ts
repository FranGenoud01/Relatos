import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${API_BASE_URL}/teachers`);
  }

  create(name: string): Observable<Teacher> {
    return this.http.post<Teacher>(`${API_BASE_URL}/teachers`, { name });
  }
}
