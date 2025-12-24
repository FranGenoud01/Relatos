import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../models/subject.model';
import { API_BASE_URL } from './api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${API_BASE_URL}/subjects`);
  }
}
