import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { Subject } from '../../core/models/subject.model';
import { Teacher } from '../../core/models/teacher.model';
import { ExamListItem } from '../../core/models/exam-list-item.model';

import { SubjectService } from '../../core/services/subject.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ExamService } from '../../core/services/exam.service';

@Component({
  selector: 'app-explorar-examen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
  ],
  templateUrl: './explorar-examen.html',
  styleUrls: ['./explorar-examen.css'],
})
export class ExplorarExamenComponent implements OnInit {
  // Estado como signals: esta app corre zoneless (sin zone.js), así que asignar
  // propiedades planas dentro de un .subscribe() no dispara re-render por sí solo.
  subjects = signal<Subject[]>([]);
  teachers: Teacher[] = [];
  filteredTeachers = signal<Teacher[]>([]);
  teacherFilterCtrl = new FormControl('');

  subjectIdCtrl = new FormControl<number | null>(null);
  teacherIdCtrl = new FormControl<number | null>(null);
  searchCtrl = new FormControl('');

  exams = signal<ExamListItem[]>([]);
  total = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => this.subjects.set(data),
      error: () => this.errorMsg.set('No se pudieron cargar las materias'),
    });

    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
        this.filteredTeachers.set(data);
      },
    });

    this.teacherFilterCtrl.valueChanges.subscribe((search) => this.filterTeachers(search));

    this.subjectIdCtrl.valueChanges.subscribe(() => {
      this.pageIndex.set(0);
      this.fetch();
    });

    this.teacherIdCtrl.valueChanges.subscribe(() => {
      this.pageIndex.set(0);
      this.fetch();
    });

    this.searchCtrl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.fetch();
      });

    this.fetch();
  }

  filterTeachers(search: string | null): void {
    if (!search) {
      this.filteredTeachers.set(this.teachers);
      return;
    }
    const term = search.toLowerCase();
    this.filteredTeachers.set(this.teachers.filter((t) => t.name.toLowerCase().includes(term)));
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.examService
      .getList({
        subjectId: this.subjectIdCtrl.value,
        teacherId: this.teacherIdCtrl.value,
        search: this.searchCtrl.value?.trim() || null,
        page: this.pageIndex() + 1,
        limit: this.pageSize(),
      })
      .subscribe({
        next: (res) => {
          this.exams.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('Error al buscar relatos');
          this.loading.set(false);
        },
      });
  }
}
