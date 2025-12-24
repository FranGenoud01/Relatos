import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DOCUMENT } from '@angular/common';
import { Subject } from '../../core/models/subject.model';
import { Teacher } from '../../core/models/teacher.model';
import { SubjectService } from '../../core/services/subject.service';
import { TeacherService } from '../../core/services/teacher.service';
import { ExamService } from '../../core/services/exam.service';

type AportarForm = FormGroup<{
  subject_id: FormControl<number | null>;
  text: FormControl<string>;
  date_exam: FormControl<Date | null>;
  teachersIds: FormControl<number[]>;
  newTeacherName: FormControl<string>;
}>;

@Component({
  selector: 'app-aportar-examen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './aportar-examen.html',
  styleUrls: ['./aportar-examen.css'],
})
export class AportarExamenComponent implements OnInit {
  isDarkMode = false;

  subjects: Subject[] = [];
  teachers: Teacher[] = [];

  loading = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;

  form!: AportarForm;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private examService: ExamService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.form = this.fb.group({
      subject_id: this.fb.control<number | null>(null, [Validators.required]),
      text: this.fb.control<string>('', [Validators.required, Validators.minLength(5)]),
      date_exam: this.fb.control<Date | null>(null),
      teachersIds: this.fb.control<number[]>([]),
      newTeacherName: this.fb.control<string>(''),
    }) as AportarForm;
  }

  ngOnInit(): void {
    this.loadInitialData();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.renderer.addClass(this.document.body, 'dark-theme'); // Usar this.document.body
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  get f() {
    return this.form.controls;
  }

  loadInitialData() {
    this.subjectService.getAll().subscribe({
      next: (data) => (this.subjects = data),
      error: () => (this.errorMsg = 'No se pudieron cargar las materias'),
    });

    this.teacherService.getAll().subscribe({
      next: (data) => (this.teachers = data),
      error: () => (this.errorMsg = 'No se pudieron cargar los profesores'),
    });
  }

  addTeacherIfNotExists() {
    const nameRaw = (this.form.value.newTeacherName || '').trim();
    if (!nameRaw) return;

    // check local (case-insensitive) para evitar duplicados en UI
    const already = this.teachers.find((t) => t.name.toLowerCase() === nameRaw.toLowerCase());
    if (already) {
      const current = this.form.value.teachersIds || [];
      if (!current.includes(already.id)) {
        this.form.patchValue({ teachersIds: [...current, already.id] });
      }
      this.form.patchValue({ newTeacherName: '' });
      return;
    }

    this.loading = true;
    this.errorMsg = null;
    this.successMsg = null;

    this.teacherService.create(nameRaw).subscribe({
      next: (created) => {
        this.teachers = [...this.teachers, created];
        const current = this.form.value.teachersIds || [];
        this.form.patchValue({
          teachersIds: [...current, created.id],
          newTeacherName: '',
        });
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo crear el profesor';
        this.loading = false;
      },
    });
  }

  submit() {
    this.errorMsg = null;
    this.successMsg = null;

    if (this.form.invalid) {
      this.errorMsg = 'Materia y relato son obligatorios';
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Date picker -> "YYYY-MM-DD"
    const date: Date | null = this.form.value.date_exam ?? null;
    const yyyyMmDd = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`
      : null;

    const payload = {
      subject_id: this.form.value.subject_id!,
      text: this.form.value.text!.trim(),
      date_exam: yyyyMmDd,
      teachersIds: this.form.value.teachersIds || [],
    };

    this.examService.create(payload).subscribe({
      next: () => {
        this.successMsg = '✅ Relato guardado';
        this.loading = false;

        // limpiar
        this.form.reset({
          subject_id: null,
          text: '',
          date_exam: null,
          teachersIds: [],
          newTeacherName: '',
        });
      },
      error: (err) => {
        this.errorMsg =
          err?.status === 400 ? 'Faltan datos obligatorios' : 'Error al guardar el relato';
        this.loading = false;
      },
    });
  }
}
