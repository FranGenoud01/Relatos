import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { ExamRandom } from '../models/exam-random.model';
import { CreateExamPayload } from '../models/exam-create.model';
import { ExamListQuery, ExamListResponse } from '../models/exam-list-item.model';
import { MyExam } from '../models/my-exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(private http: HttpClient) {}

  getRandom(subjectId: number, teacherId?: number | null, excludeIds: number[] = []) {
    let params = new HttpParams().set('subject_id', String(subjectId));

    if (teacherId !== null && teacherId !== undefined) {
      params = params.set('teacher_id', String(teacherId));
    }

    if (excludeIds.length > 0) {
      params = params.set('exclude', excludeIds.join(','));
    }

    return this.http.get<ExamRandom>(`${API_BASE_URL}/exams/random`, { params });
  }

  getList(query: ExamListQuery): Observable<ExamListResponse> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('limit', String(query.limit));

    if (query.subjectId) {
      params = params.set('subject_id', String(query.subjectId));
    }
    if (query.teacherId) {
      params = params.set('teacher_id', String(query.teacherId));
    }
    if (query.search) {
      params = params.set('search', query.search);
    }

    return this.http.get<ExamListResponse>(`${API_BASE_URL}/exams`, { params });
  }

  create(payload: CreateExamPayload): Observable<any> {
    return this.http.post(`${API_BASE_URL}/exams`, payload);
  }

  getMine(): Observable<{ items: MyExam[] }> {
    return this.http.get<{ items: MyExam[] }>(`${API_BASE_URL}/exams/mine`);
  }
}
