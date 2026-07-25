import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PendingExam } from '../../core/models/pending-exam.model';
import { AdminService } from '../../core/services/admin.service';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-admin-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './admin-pendientes.html',
  styleUrls: ['./admin-pendientes.css'],
})
export class AdminPendientesComponent implements OnInit {
  items = signal<PendingExam[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  processingId = signal<number | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.adminService.getPendingExams().subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar los relatos pendientes');
        this.loading.set(false);
      },
    });
  }

  approve(id: number): void {
    this.processingId.set(id);
    this.adminService.approve(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => this.processingId.set(null),
    });
  }

  reject(id: number): void {
    this.processingId.set(id);
    this.adminService.reject(id).subscribe({
      next: () => this.removeFromList(id),
      error: () => this.processingId.set(null),
    });
  }

  similarityPercent(score: number | null): number {
    return score ? Math.round(score * 100) : 0;
  }

  private removeFromList(id: number): void {
    this.items.update((list) => list.filter((x) => x.id !== id));
    this.processingId.set(null);
  }
}
