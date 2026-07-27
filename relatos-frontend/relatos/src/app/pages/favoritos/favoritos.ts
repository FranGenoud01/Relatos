import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FavoriteExam } from '../../core/models/favorite.model';
import { FavoriteService } from '../../core/services/favorite.service';
import { ExamFavoriteComponent } from '../../shared/exam-favorite/exam-favorite';
import { PageHeaderComponent } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ExamFavoriteComponent,
    PageHeaderComponent,
  ],
  templateUrl: './favoritos.html',
  styleUrls: ['./favoritos.css'],
})
export class FavoritosComponent implements OnInit {
  items = signal<FavoriteExam[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.favoriteService.getMine().subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar tus favoritos');
        this.loading.set(false);
      },
    });
  }

  onFavoriteChanged(examId: number, isFavorite: boolean): void {
    if (!isFavorite) {
      this.items.update((list) => list.filter((x) => x.id !== examId));
    }
  }
}
