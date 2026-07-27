import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MyExam } from '../../core/models/my-exam.model';
import { ExamService } from '../../core/services/exam.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

const STATUS_LABEL: Record<MyExam['status'], string> = {
  approved: 'Publicado',
  pending: 'En revisión',
  rejected: 'Rechazado',
};

const STATUS_ICON: Record<MyExam['status'], string> = {
  approved: 'check_circle',
  pending: 'hourglass_empty',
  rejected: 'cancel',
};

@Component({
  selector: 'app-mis-aportes',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, PageHeaderComponent],
  templateUrl: './mis-aportes.html',
  styleUrls: ['./mis-aportes.css'],
})
export class MisAportesComponent implements OnInit {
  items = signal<MyExam[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.examService.getMine().subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar tus relatos');
        this.loading.set(false);
      },
    });
  }

  statusLabel(status: MyExam['status']): string {
    return STATUS_LABEL[status];
  }

  statusIcon(status: MyExam['status']): string {
    return STATUS_ICON[status];
  }
}
