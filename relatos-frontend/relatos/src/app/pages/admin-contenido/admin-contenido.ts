import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ExamListItem } from '../../core/models/exam-list-item.model';
import { DeletedExam } from '../../core/models/deleted-exam.model';
import { Teacher } from '../../core/models/teacher.model';
import { DeletedTeacher } from '../../core/models/deleted-teacher.model';
import { OpenReport, REPORT_REASON_OPTIONS } from '../../core/models/report.model';

import { AdminService } from '../../core/services/admin.service';
import { ExamService } from '../../core/services/exam.service';
import { TeacherService } from '../../core/services/teacher.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

type ExamsView = 'active' | 'deleted';
type TeachersView = 'active' | 'deleted';

@Component({
  selector: 'app-admin-contenido',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    PageHeaderComponent,
  ],
  templateUrl: './admin-contenido.html',
  styleUrls: ['./admin-contenido.css'],
})
export class AdminContenidoComponent implements OnInit {
  examsView = signal<ExamsView>('active');
  teachersView = signal<TeachersView>('active');

  exams = signal<ExamListItem[]>([]);
  examsTotal = signal(0);
  examsPageIndex = signal(0);
  examsPageSize = signal(10);
  examsLoading = signal(false);
  examsError = signal<string | null>(null);
  examsProcessingId = signal<number | null>(null);

  deletedExams = signal<DeletedExam[]>([]);
  deletedExamsLoading = signal(false);
  deletedExamsError = signal<string | null>(null);
  deletedExamsProcessingId = signal<number | null>(null);

  teachers = signal<Teacher[]>([]);
  teachersLoading = signal(false);
  teachersError = signal<string | null>(null);
  teachersProcessingId = signal<number | null>(null);

  deletedTeachers = signal<DeletedTeacher[]>([]);
  deletedTeachersLoading = signal(false);
  deletedTeachersError = signal<string | null>(null);
  deletedTeachersProcessingId = signal<number | null>(null);

  reports = signal<OpenReport[]>([]);
  reportsLoading = signal(false);
  reportsError = signal<string | null>(null);
  reportsProcessingId = signal<number | null>(null);

  readonly reasonLabels = Object.fromEntries(
    REPORT_REASON_OPTIONS.map((opt) => [opt.value, opt.label])
  );

  constructor(
    private adminService: AdminService,
    private examService: ExamService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.fetchExams();
    this.fetchTeachers();
    this.fetchReports();
  }

  setExamsView(view: ExamsView): void {
    this.examsView.set(view);
    if (view === 'active') {
      this.fetchExams();
    } else {
      this.fetchDeletedExams();
    }
  }

  setTeachersView(view: TeachersView): void {
    this.teachersView.set(view);
    if (view === 'active') {
      this.fetchTeachers();
    } else {
      this.fetchDeletedTeachers();
    }
  }

  fetchExams(): void {
    this.examsLoading.set(true);
    this.examsError.set(null);

    this.examService
      .getList({
        page: this.examsPageIndex() + 1,
        limit: this.examsPageSize(),
      })
      .subscribe({
        next: (res) => {
          this.exams.set(res.items);
          this.examsTotal.set(res.total);
          this.examsLoading.set(false);
        },
        error: () => {
          this.examsError.set('No se pudieron cargar los relatos');
          this.examsLoading.set(false);
        },
      });
  }

  onExamsPage(event: PageEvent): void {
    this.examsPageIndex.set(event.pageIndex);
    this.examsPageSize.set(event.pageSize);
    this.fetchExams();
  }

  deleteExam(exam: ExamListItem): void {
    if (!confirm(`¿Eliminar el relato de "${exam.subject_name}"? Vas a poder restaurarlo después desde la papelera.`)) {
      return;
    }
    this.examsProcessingId.set(exam.id);
    this.adminService.deleteExam(exam.id).subscribe({
      next: () => {
        this.exams.update((list) => list.filter((x) => x.id !== exam.id));
        this.examsTotal.update((t) => t - 1);
        this.examsProcessingId.set(null);
      },
      error: () => this.examsProcessingId.set(null),
    });
  }

  fetchDeletedExams(): void {
    this.deletedExamsLoading.set(true);
    this.deletedExamsError.set(null);

    this.adminService.getDeletedExams().subscribe({
      next: (res) => {
        this.deletedExams.set(res.items);
        this.deletedExamsLoading.set(false);
      },
      error: () => {
        this.deletedExamsError.set('No se pudieron cargar los relatos eliminados');
        this.deletedExamsLoading.set(false);
      },
    });
  }

  restoreExam(exam: DeletedExam): void {
    this.deletedExamsProcessingId.set(exam.id);
    this.adminService.restoreExam(exam.id).subscribe({
      next: () => {
        this.deletedExams.update((list) => list.filter((x) => x.id !== exam.id));
        this.deletedExamsProcessingId.set(null);
      },
      error: () => this.deletedExamsProcessingId.set(null),
    });
  }

  fetchTeachers(): void {
    this.teachersLoading.set(true);
    this.teachersError.set(null);

    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers.set(data);
        this.teachersLoading.set(false);
      },
      error: () => {
        this.teachersError.set('No se pudieron cargar los profesores');
        this.teachersLoading.set(false);
      },
    });
  }

  deleteTeacher(teacher: Teacher): void {
    if (!confirm(`¿Eliminar a "${teacher.name}"? Vas a poder restaurarlo después desde la papelera.`)) {
      return;
    }
    this.teachersProcessingId.set(teacher.id);
    this.adminService.deleteTeacher(teacher.id).subscribe({
      next: () => {
        this.teachers.update((list) => list.filter((x) => x.id !== teacher.id));
        this.teachersProcessingId.set(null);
      },
      error: () => this.teachersProcessingId.set(null),
    });
  }

  fetchDeletedTeachers(): void {
    this.deletedTeachersLoading.set(true);
    this.deletedTeachersError.set(null);

    this.adminService.getDeletedTeachers().subscribe({
      next: (res) => {
        this.deletedTeachers.set(res.items);
        this.deletedTeachersLoading.set(false);
      },
      error: () => {
        this.deletedTeachersError.set('No se pudieron cargar los profesores eliminados');
        this.deletedTeachersLoading.set(false);
      },
    });
  }

  restoreTeacher(teacher: DeletedTeacher): void {
    this.deletedTeachersProcessingId.set(teacher.id);
    this.adminService.restoreTeacher(teacher.id).subscribe({
      next: () => {
        this.deletedTeachers.update((list) => list.filter((x) => x.id !== teacher.id));
        this.deletedTeachersProcessingId.set(null);
      },
      error: () => this.deletedTeachersProcessingId.set(null),
    });
  }

  fetchReports(): void {
    this.reportsLoading.set(true);
    this.reportsError.set(null);

    this.adminService.getOpenReports().subscribe({
      next: (res) => {
        this.reports.set(res.items);
        this.reportsLoading.set(false);
      },
      error: () => {
        this.reportsError.set('No se pudieron cargar los reportes');
        this.reportsLoading.set(false);
      },
    });
  }

  dismissReport(report: OpenReport): void {
    this.reportsProcessingId.set(report.id);
    this.adminService.dismissReport(report.id).subscribe({
      next: () => {
        this.reports.update((list) => list.filter((x) => x.id !== report.id));
        this.reportsProcessingId.set(null);
      },
      error: () => this.reportsProcessingId.set(null),
    });
  }

  deleteReportedExam(report: OpenReport): void {
    if (
      !confirm(`¿Eliminar el relato de "${report.subject_name}"? Vas a poder restaurarlo después desde la papelera.`)
    ) {
      return;
    }

    this.reportsProcessingId.set(report.id);
    this.adminService.deleteExam(report.exam_id).subscribe({
      next: () => {
        this.reports.update((list) => list.filter((x) => x.exam_id !== report.exam_id));
        if (this.exams().some((x) => x.id === report.exam_id)) {
          this.exams.update((list) => list.filter((x) => x.id !== report.exam_id));
          this.examsTotal.update((t) => t - 1);
        }
        this.reportsProcessingId.set(null);
      },
      error: () => this.reportsProcessingId.set(null),
    });
  }
}
