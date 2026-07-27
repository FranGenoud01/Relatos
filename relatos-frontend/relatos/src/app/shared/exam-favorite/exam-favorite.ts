import { Component, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-exam-favorite',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './exam-favorite.html',
  styleUrls: ['./exam-favorite.css'],
})
export class ExamFavoriteComponent {
  examId = input.required<number>();
  initialValue = input<boolean | null>(null);
  favoriteChanged = output<boolean>();

  private favoriteService = inject(FavoriteService);
  private auth = inject(AuthService);

  currentUser = toSignal(this.auth.currentUser$, { initialValue: this.auth.currentUser });

  isFavorite = signal(false);
  loading = signal(false);

  constructor() {
    effect(() => {
      const id = this.examId();
      const initial = this.initialValue();

      if (initial !== null) {
        this.isFavorite.set(initial);
        return;
      }

      if (!this.currentUser()) {
        this.isFavorite.set(false);
        return;
      }
      this.favoriteService.getStatus(id).subscribe({
        next: (res) => this.isFavorite.set(res.isFavorite),
      });
    });
  }

  toggle(): void {
    if (!this.currentUser() || this.loading()) {
      return;
    }

    this.loading.set(true);
    const action = this.isFavorite()
      ? this.favoriteService.remove(this.examId())
      : this.favoriteService.add(this.examId());

    action.subscribe({
      next: (res) => {
        this.isFavorite.set(res.isFavorite);
        this.loading.set(false);
        this.favoriteChanged.emit(res.isFavorite);
      },
      error: () => this.loading.set(false),
    });
  }
}
