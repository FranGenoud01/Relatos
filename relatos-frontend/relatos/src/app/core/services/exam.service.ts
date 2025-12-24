import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ExamRandom } from '../models/exam-random.model';
import { CreateExamPayload } from '../models/exam-create.model';
@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(private http: HttpClient) {}

  getRandom(subjectId: number, teacherId?: number | null, excludeIds: number[] = []) {
    let params = new HttpParams().set('subject_id', String(subjectId));

    if (teacherId) {
      params = params.set('teacher_id', String(teacherId));
    }

    if (excludeIds.length > 0) {
      params = params.set('exclude', excludeIds.join(','));
    }

    return this.http.get<ExamRandom>(`${API_BASE_URL}/exams/random`, { params });
  }

  create(payload: CreateExamPayload): Observable<any> {
    return this.http.post(`${API_BASE_URL}/exams`, payload);
  }
}
