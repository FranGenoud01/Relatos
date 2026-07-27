import {
  createReportRepo,
  findOpenReportsRepo,
  resolveReportRepo,
} from './report.repository';
import { OpenReportItem, REPORT_REASONS, ReportReason } from './report.types';

const MAX_COMMENT_LENGTH = 500;

function validateExamId(examId: number): void {
  if (!Number.isFinite(examId) || examId <= 0) {
    throw new Error('INVALID_EXAM_ID');
  }
}

export async function createReportService(
  examId: number,
  reporterId: number,
  reason: string,
  comment?: string
): Promise<{ id: number }> {
  validateExamId(examId);

  if (!REPORT_REASONS.includes(reason as ReportReason)) {
    throw new Error('MOTIVO_INVALIDO');
  }

  const trimmedComment = (comment || '').trim();
  if (trimmedComment.length > MAX_COMMENT_LENGTH) {
    throw new Error('COMENTARIO_MUY_LARGO');
  }

  const id = await createReportRepo(
    examId,
    reporterId,
    reason as ReportReason,
    trimmedComment || null
  );
  return { id };
}

export async function getOpenReportsService(): Promise<OpenReportItem[]> {
  return findOpenReportsRepo();
}

export async function dismissReportService(id: number, adminId: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  const resolved = await resolveReportRepo(id, adminId);
  if (!resolved) {
    throw new Error('NOT_FOUND');
  }
}
