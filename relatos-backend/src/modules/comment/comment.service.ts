import { findCommentsByExamRepo, createCommentRepo } from './comment.repository';
import { CommentItem } from './comment.types';

const MAX_COMMENT_LENGTH = 1000;

function validateExamId(examId: number): void {
  if (!Number.isFinite(examId) || examId <= 0) {
    throw new Error('INVALID_EXAM_ID');
  }
}

export async function getCommentsService(examId: number): Promise<CommentItem[]> {
  validateExamId(examId);
  return findCommentsByExamRepo(examId);
}

export async function createCommentService(
  examId: number,
  userId: number,
  text: string
): Promise<{ id: number }> {
  validateExamId(examId);

  const trimmed = (text || '').trim();
  if (!trimmed) {
    throw new Error('TEXTO_OBLIGATORIO');
  }
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    throw new Error('TEXTO_MUY_LARGO');
  }

  const id = await createCommentRepo(examId, userId, trimmed);
  return { id };
}
