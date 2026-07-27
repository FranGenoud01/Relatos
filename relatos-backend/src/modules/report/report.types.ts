export type ReportReason =
  | 'duplicado'
  | 'materia_o_profesor_incorrecto'
  | 'contenido_inapropiado'
  | 'otro';

export const REPORT_REASONS: ReportReason[] = [
  'duplicado',
  'materia_o_profesor_incorrecto',
  'contenido_inapropiado',
  'otro',
];

export interface OpenReportItem {
  id: number;
  exam_id: number;
  reason: ReportReason;
  comment: string | null;
  created_at: string;
  reporter_name: string;
  subject_name: string;
  exam_text: string;
}
