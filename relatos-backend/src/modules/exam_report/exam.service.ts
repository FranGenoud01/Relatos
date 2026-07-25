import { CreateExamDTO } from './exam.types';
import {
  createExamRepo,
  getRandomExamBySubjectRepo,
  deleteExamById,
  findAllExamsRepo,
  FindAllExamsParams,
} from './exam.repository';

export async function createExamService(dto: CreateExamDTO) {
  if (!dto.subjectId || !dto.text || !dto.text.trim()) {
    throw new Error('DATOS_OBLIGATORIOS');
  }

  const title = dto.title ?? `Relato ${new Date().toISOString().slice(0, 10)}`;

  const id = await createExamRepo({
    subjectId: dto.subjectId,
    title,
    text: dto.text.trim(),
    dateExamen: dto.dateExamen,
    teachersIds: dto.teachersIds || [],
    createdBy: dto.createdBy ?? null,
  });

  return { id, subjectId: dto.subjectId, title };
}

export async function getRandomExamService(
  subject_id: number,
  teacher_id?: number,
  excludeIds: number[] = []
) {
  if (!subject_id) throw new Error('MATERIA_OBLIGATORIA');

  const exam = await getRandomExamBySubjectRepo(
    subject_id,
    teacher_id,
    excludeIds
  );
  if (!exam) throw new Error('SIN_RELATOS');

  return exam;
}

export async function deleteExamService(id: number): Promise<void> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('INVALID_ID');
  }

  const deleted = await deleteExamById(id);

  if (!deleted) {
    throw new Error('NOT_FOUND');
  }
}

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

export async function findAllExamsService(params: {
  subjectId?: number | undefined;
  teacherId?: number | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 && params.limit <= MAX_LIMIT
      ? params.limit
      : DEFAULT_LIMIT;

  const repoParams: FindAllExamsParams = {
    subjectId: params.subjectId,
    teacherId: params.teacherId,
    search: params.search?.trim() || undefined,
    page,
    limit,
  };

  const { items, total } = await findAllExamsRepo(repoParams);

  return { items, total, page, limit };
}
