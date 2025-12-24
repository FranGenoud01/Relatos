import { CreateExamDTO } from './exam.types';
import {
  createExamRepo,
  getRandomExamBySubjectRepo,
  deleteExamById,
  findAllExamsRepo,
} from './exam.repository';
import { get } from 'node:http';

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

export async function findAllExamsService() {
  const result = await findAllExamsRepo();

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('NO_EXAMS_FOUND');
  }

  return result;
}
