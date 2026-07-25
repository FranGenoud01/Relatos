import { Component, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RatingSummary } from '../../core/models/rating.model';
import { ExamComment } from '../../core/models/comment.model';
import { RatingService } from '../../core/services/rating.service';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-exam-rating',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './exam-rating.html',
  styleUrls: ['./exam-rating.css'],
})
export class ExamRatingComponent {
  examId = input.required<number>();

  private ratingService = inject(RatingService);
  private commentService = inject(CommentService);
  auth = inject(AuthService);

  currentUser = toSignal(this.auth.currentUser$, { initialValue: this.auth.currentUser });

  readonly stars = [1, 2, 3, 4, 5];

  summary = signal<RatingSummary | null>(null);
  comments = signal<ExamComment[]>([]);
  loading = signal(false);
  submittingRating = signal(false);
  submittingComment = signal(false);
  errorMsg = signal<string | null>(null);

  newCommentCtrl = new FormControl('');

  constructor() {
    effect(() => {
      const id = this.examId();
      this.loadSummary(id);
      this.loadComments(id);
    });
  }

  private loadSummary(examId: number): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.ratingService.getSummary(examId).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar la valoración');
        this.loading.set(false);
      },
    });
  }

  private loadComments(examId: number): void {
    this.commentService.getAll(examId).subscribe({
      next: (res) => this.comments.set(res.items),
    });
  }

  round(value: number): number {
    return Math.round(value);
  }

  rate(stars: number): void {
    if (!this.auth.currentUser || this.submittingRating()) {
      return;
    }

    this.submittingRating.set(true);
    this.ratingService.rate(this.examId(), stars).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.submittingRating.set(false);
      },
      error: () => this.submittingRating.set(false),
    });
  }

  submitComment(): void {
    const text = this.newCommentCtrl.value?.trim();
    if (!text || this.submittingComment()) {
      return;
    }

    this.submittingComment.set(true);
    this.commentService.create(this.examId(), text).subscribe({
      next: () => {
        this.newCommentCtrl.reset('');
        this.submittingComment.set(false);
        this.loadComments(this.examId());
      },
      error: () => this.submittingComment.set(false),
    });
  }
}
