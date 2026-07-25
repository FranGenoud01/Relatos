import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { PendingExam } from '../models/pending-exam.model';
import { DeletedExam } from '../models/deleted-exam.model';
import { DeletedTeacher } from '../models/deleted-teacher.model';

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

  getDeletedExams(): Observable<{ items: DeletedExam[] }> {
    return this.http.get<{ items: DeletedExam[] }>(`${API_BASE_URL}/admin/exams/deleted`);
  }

  deleteExam(examId: number): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(`${API_BASE_URL}/admin/exams/${examId}`);
  }

  restoreExam(examId: number): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${API_BASE_URL}/admin/exams/${examId}/restore`, {});
  }

  getDeletedTeachers(): Observable<{ items: DeletedTeacher[] }> {
    return this.http.get<{ items: DeletedTeacher[] }>(`${API_BASE_URL}/admin/teachers/deleted`);
  }

  deleteTeacher(teacherId: number): Observable<{ id: number }> {
    return this.http.delete<{ id: number }>(`${API_BASE_URL}/admin/teachers/${teacherId}`);
  }

  restoreTeacher(teacherId: number): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      `${API_BASE_URL}/admin/teachers/${teacherId}/restore`,
      {}
    );
  }
}
