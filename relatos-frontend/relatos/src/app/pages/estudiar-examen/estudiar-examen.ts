import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// 1. IMPORTAR EL MÓDULO DE BÚSQUEDA
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { Subject } from '../../core/models/subject.model';
import { Teacher } from '../../core/models/teacher.model';
import { ExamRandom } from '../../core/models/exam-random.model';

import { SubjectService } from '../../core/services/subject.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ExamService } from '../../core/services/exam.service';

@Component({
  selector: 'app-estudiar-examen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    NgxMatSelectSearchModule, // 2. AGREGAR A LOS IMPORTS
  ],
  templateUrl: './estudiar-examen.html',
  styleUrls: ['./estudiar-examen.css'],
})
export class EstudiarExamenComponent implements OnInit {
  isDarkMode = false;

  subjects: Subject[] = [];
  teachers: Teacher[] = [];

  // 3. VARIABLES PARA EL FILTRO
  filteredTeachers: Teacher[] = []; // Lista filtrada que se muestra en el HTML
  teacherFilterCtrl = new FormControl(''); // Input del buscador

  subjectIdCtrl = new FormControl<number | null>(null);
  teacherIdCtrl = new FormControl<number | null>(0);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  errorMsg: string | null = null;
  exam$?: Observable<ExamRandom>;

  private seenByFilter = new Map<string, number[]>();

  constructor(
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private examService: ExamService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Lógica Dark Mode
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        this.renderer.addClass(this.document.body, 'dark-theme');
      }
    }

    // 4. ESCUCHAR CAMBIOS EN EL BUSCADOR DE PROFESORES
    this.teacherFilterCtrl.valueChanges.subscribe((search) => {
      this.filterTeachers(search);
    });

    // Resetear vista al cambiar filtros principales
    this.subjectIdCtrl.valueChanges.subscribe(() => this.resetView());
    this.teacherIdCtrl.valueChanges.subscribe(() => this.resetView());
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        this.renderer.addClass(this.document.body, 'dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        this.renderer.removeClass(this.document.body, 'dark-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  loadData() {
    this.subjectService.getAll().subscribe({
      next: (data) => (this.subjects = data),
      error: () => (this.errorMsg = 'No se pudieron cargar las materias'),
    });

    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
        this.filteredTeachers = data; // 5. INICIALIZAR LA LISTA FILTRADA
      },
      error: () => (this.errorMsg = 'No se pudieron cargar los profesores'),
    });
  }

  // 6. LÓGICA DE FILTRADO
  filterTeachers(search: string | null) {
    if (!search) {
      this.filteredTeachers = this.teachers;
      return;
    }
    search = search.toLowerCase();
    this.filteredTeachers = this.teachers.filter((t) => t.name.toLowerCase().includes(search!));
  }

  resetView() {
    this.exam$ = undefined;
    this.errorMsg = null;
  }

  private filterKey(subjectId: number, teacherId: number | null) {
    return `${subjectId}-${teacherId ?? 'all'}`;
  }

  getRandomExam() {
    const subjectId = this.subjectIdCtrl.value;
    const teacherIdRaw = this.teacherIdCtrl.value ?? 0;
    const teacherId = teacherIdRaw === 0 ? null : teacherIdRaw;

    if (!subjectId) {
      this.errorMsg = 'Elegí una materia primero';
      return;
    }

    this.errorMsg = null;
    const key = this.filterKey(subjectId, teacherId);
    const seen = this.seenByFilter.get(key) ?? [];

    this.loadingSubject.next(true);

    this.exam$ = this.examService.getRandom(subjectId, teacherId, seen).pipe(
      tap((exam) => {
        this.seenByFilter.set(key, [...seen, exam.id]);
      }),
      catchError((err) => {
        if (err?.status === 404) {
          this.errorMsg = 'No hay más relatos para ese filtro (sin repetir).';
        } else if (err?.status === 400) {
          this.errorMsg = 'Materia/profesor inválido.';
        } else {
          this.errorMsg = 'Error al traer relato aleatorio.';
        }
        return EMPTY;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  resetSessionForFilter() {
    const subjectId = this.subjectIdCtrl.value;
    const teacherIdRaw = this.teacherIdCtrl.value ?? 0;
    const teacherId = teacherIdRaw === 0 ? null : teacherIdRaw;

    if (!subjectId) return;

    const key = this.filterKey(subjectId, teacherId);
    this.seenByFilter.set(key, []);

    this.exam$ = undefined;
    this.errorMsg = null;
  }
}
