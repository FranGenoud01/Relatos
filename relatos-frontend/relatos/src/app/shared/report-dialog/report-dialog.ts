import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { REPORT_REASON_OPTIONS, ReportReason } from '../../core/models/report.model';
import { ReportService } from '../../core/services/report.service';

export interface ReportDialogData {
  examId: number;
}

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './report-dialog.html',
  styleUrls: ['./report-dialog.css'],
})
export class ReportDialogComponent {
  data = inject<ReportDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ReportDialogComponent>);
  private reportService = inject(ReportService);

  readonly reasonOptions = REPORT_REASON_OPTIONS;

  reasonCtrl = new FormControl<ReportReason>('duplicado', { nonNullable: true });
  commentCtrl = new FormControl('', { nonNullable: true });

  submitting = signal(false);
  errorMsg = signal<string | null>(null);

  get commentRequired(): boolean {
    return this.reasonCtrl.value === 'otro';
  }

  submit(): void {
    if (this.commentRequired && !this.commentCtrl.value.trim()) {
      this.errorMsg.set('Contanos brevemente cuál es el problema');
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    this.reportService
      .create(this.data.examId, this.reasonCtrl.value, this.commentCtrl.value.trim())
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMsg.set('No se pudo enviar el reporte, probá de nuevo');
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
