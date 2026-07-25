import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StatsResponse } from '../../core/models/stats.model';
import { StatsService } from '../../core/services/stats.service';

interface KpiTile {
  label: string;
  value: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css'],
})
export class EstadisticasComponent implements OnInit {
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  stats = signal<StatsResponse | null>(null);

  kpis = computed<KpiTile[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Relatos', value: s.totals.exams },
      { label: 'Materias', value: s.totals.subjects },
      { label: 'Profesores', value: s.totals.teachers },
      { label: 'Usuarios', value: s.totals.users },
      { label: 'Valoraciones', value: s.totals.ratings },
      { label: 'Comentarios', value: s.totals.comments },
    ];
  });

  subjectMax = computed(() => {
    const s = this.stats();
    if (!s || s.bySubject.length === 0) return 0;
    return Math.max(...s.bySubject.map((x) => x.exam_count));
  });

  teacherMax = computed(() => {
    const s = this.stats();
    if (!s || s.byTeacher.length === 0) return 0;
    return Math.max(...s.byTeacher.map((x) => x.exam_count));
  });

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.statsService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar las estadísticas');
        this.loading.set(false);
      },
    });
  }

  barWidth(count: number, max: number): number {
    if (max <= 0) return 0;
    return Math.round((count / max) * 100);
  }
}
