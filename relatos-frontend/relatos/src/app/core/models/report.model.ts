export type ReportReason =
  | 'duplicado'
  | 'materia_o_profesor_incorrecto'
  | 'contenido_inapropiado'
  | 'otro';

export const REPORT_REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: 'duplicado', label: 'Es un relato duplicado' },
  { value: 'materia_o_profesor_incorrecto', label: 'Materia o profesor incorrecto' },
  { value: 'contenido_inapropiado', label: 'Contenido inapropiado u ofensivo' },
  { value: 'otro', label: 'Otro motivo' },
];

export interface OpenReport {
  id: number;
  exam_id: number;
  reason: ReportReason;
  comment: string | null;
  created_at: string;
  reporter_name: string;
  subject_name: string;
  exam_text: string;
}
